import { timingSafeEqual } from 'node:crypto';
import { Binary, ObjectId } from 'mongodb';
import { isAdmin, json, sign } from '@/lib/server/auth';
import { getDb } from '@/lib/server/mongo';

const CHUNK_MAX = 4 * 1024 * 1024;
type Params = { params: Promise<{ id: string }> };
const db = async () => {
  const d = await getDb();
  return { files: d.collection('shared_files'), chunks: d.collection('shared_file_chunks') };
};
const tokenOk = (id: string, token: string | null) => {
  const expected = Buffer.from(sign(`share:${id}`));
  return !!token && token.length === expected.length && timingSafeEqual(expected, Buffer.from(token));
};

// Uploader: ?chunk=N with the raw bytes as body, then ?finish=1.
export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  if (!ObjectId.isValid(id) || !tokenOk(id, req.headers.get('x-upload-token'))) return json(403, { error: 'Invalid upload token' });
  const _id = new ObjectId(id);
  const { files, chunks } = await db();
  const file = await files.findOne({ _id, status: 'uploading' });
  if (!file) return json(404, { error: 'Upload not found' });
  const search = new URL(req.url).searchParams;

  if (search.get('finish')) {
    if (file.received !== file.file_size) return json(400, { error: 'Upload incomplete' });
    await files.updateOne({ _id }, { $set: { status: 'complete' } });
    return json(200, { ok: true });
  }

  const n = Number(search.get('chunk'));
  if (n !== file.chunks) return json(409, { error: `Expected chunk ${file.chunks}` });
  const data = Buffer.from(await req.arrayBuffer());
  if (data.length === 0 || data.length > CHUNK_MAX || file.received + data.length > file.file_size) return json(400, { error: 'Invalid chunk size' });
  try {
    await chunks.insertOne({ file_id: _id, n, data: new Binary(data) });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) return json(409, { error: 'Chunk already received' });
    throw error;
  }
  // Conditional update so two racing requests for the same chunk can't both count.
  const updated = await files.updateOne({ _id, chunks: n }, { $inc: { chunks: 1, received: data.length } });
  if (!updated.modifiedCount) return json(409, { error: 'Chunk already received' });
  return json(200, { ok: true });
}

// Admin: stream the file back.
export async function GET(_req: Request, { params }: Params) {
  if (!(await isAdmin())) return json(401, { error: 'Sign in required' });
  const { id } = await params;
  if (!ObjectId.isValid(id)) return json(404, { error: 'Not found' });
  const { files, chunks } = await db();
  const file = await files.findOne({ _id: new ObjectId(id), status: 'complete' });
  if (!file) return json(404, { error: 'Not found' });
  const cursor = chunks.find({ file_id: file._id }).sort({ n: 1 });
  const stream = new ReadableStream({
    async pull(controller) {
      const chunk = await cursor.next();
      if (chunk) controller.enqueue(new Uint8Array((chunk.data as Binary).buffer));
      else controller.close();
    },
    cancel: () => cursor.close(),
  });
  return new Response(stream, {
    headers: {
      // Served inline for preview; nosniff + sandbox CSP keep uploaded HTML/SVG from running as our origin.
      'Content-Type': String(file.file_type),
      'Content-Length': String(file.file_size),
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(String(file.file_name))}`,
      'Content-Security-Policy': 'sandbox',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'private, no-store',
    },
  });
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await isAdmin())) return json(401, { error: 'Sign in required' });
  const { id } = await params;
  if (!ObjectId.isValid(id)) return json(404, { error: 'Not found' });
  const { files, chunks } = await db();
  await chunks.deleteMany({ file_id: new ObjectId(id) });
  await files.deleteOne({ _id: new ObjectId(id) });
  return json(200, { ok: true });
}
