import sharp from 'sharp';
import { allowedOrigin, isAdmin, json } from '@/lib/server/auth';
import { bucket } from '@/lib/server/mongo';

const types = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: Request) {
  if (!(await isAdmin())) return json(401, { error: 'Sign in required' });
  if (!allowedOrigin(req)) return json(403, { error: 'Invalid origin' });
  try {
    const body = await req.json();
    const mime = String(body.mime || '');
    if (!types.includes(mime) || typeof body.data !== 'string' || body.data.length > 4_300_000) return json(400, { error: 'Use a JPEG, PNG, or WebP image under 3 MB' });
    const data = Buffer.from(body.data, 'base64');
    if (data.length === 0 || data.length > 3_145_728) return json(400, { error: 'Image must be under 3 MB' });
    const valid = mime === 'image/jpeg' ? data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff : mime === 'image/png' ? data.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')) : data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP';
    if (!valid) return json(400, { error: 'Image contents do not match file type' });
    // Re-encode: strips metadata and serves WebP everywhere.
    const webp = await sharp(data).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    const images = await bucket('images');
    const id = await new Promise<string>((resolve, reject) => {
      const stream = images.openUploadStream('cover.webp', { metadata: { contentType: 'image/webp' } });
      stream.once('finish', () => resolve(stream.id.toString())).once('error', reject).end(webp);
    });
    return json(200, { url: `/api/images/${id}` });
  } catch {
    return json(400, { error: 'Invalid upload' });
  }
}
