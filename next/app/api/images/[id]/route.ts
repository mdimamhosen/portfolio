import { ObjectId } from 'mongodb';
import { Readable } from 'node:stream';
import { bucket } from '@/lib/server/mongo';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) return new Response('Not found', { status: 404 });
  const images = await bucket('images');
  const [file] = await images.find({ _id: new ObjectId(id) }).toArray();
  if (!file) return new Response('Not found', { status: 404 });
  return new Response(Readable.toWeb(images.openDownloadStream(file._id)) as ReadableStream, {
    headers: { 'Content-Type': String(file.metadata?.contentType || 'image/webp'), 'Content-Length': String(file.length), 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
