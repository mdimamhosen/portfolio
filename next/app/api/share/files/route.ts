import { ObjectId } from 'mongodb';
import { isAdmin, json, rateLimited, sign } from '@/lib/server/auth';
import { getDb, hasMongo } from '@/lib/server/mongo';

const maxBytes = Number(process.env.SHARE_CLOUD_MAX_BYTES) || 50 * 1024 * 1024;
const clean = (value: unknown, max: number) => String(value ?? '').replace(/\p{Cc}/gu, '').trim().slice(0, max);

// Admin: list completed cloud backups.
export async function GET() {
  if (!(await isAdmin())) return json(401, { error: 'Sign in required' });
  const files = await (await getDb()).collection('shared_files')
    .find({ status: 'complete' }).sort({ created_at: -1 }).limit(500).toArray();
  return json(200, { files: files.map(({ _id, ...f }) => ({ ...f, id: _id.toString() })) });
}

// shortcut: abandoned 'uploading' rows and their chunks are never swept; add a cron cleanup if storage grows.
// Anyone on /share: start a backup. Returns an upload token bound to this file id.
export async function POST(req: Request) {
  if (!hasMongo()) return json(503, { error: 'Storage is not configured' });
  if (await rateLimited(req, 'share-upload', 10)) return json(429, { error: 'Too many uploads' });
  const body = await req.json().catch(() => ({}));
  const file_size = Number(body.file_size);
  if (!Number.isSafeInteger(file_size) || file_size <= 0) return json(400, { error: 'Invalid file size' });
  if (file_size > maxBytes) return json(413, { error: 'File too large for cloud backup' });
  const _id = new ObjectId();
  await (await getDb()).collection('shared_files').insertOne({
    _id,
    file_name: clean(body.file_name, 255) || 'file',
    file_size,
    file_type: clean(body.file_type, 100) || 'application/octet-stream',
    sender_name: clean(body.sender_name, 32) || null,
    receiver_name: clean(body.receiver_name, 32) || null,
    status: 'uploading',
    received: 0,
    chunks: 0,
    created_at: new Date().toISOString(),
  });
  const id = _id.toString();
  return json(200, { id, token: sign(`share:${id}`) });
}
