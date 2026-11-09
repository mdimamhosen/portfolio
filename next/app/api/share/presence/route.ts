import { NextResponse } from 'next/server';
import { rateLimited } from '@/lib/server/auth';
import { getDb, hasMongo } from '@/lib/server/mongo';

const clean = (value: unknown, max: number) => String(value ?? '').replace(/[\p{Cc}<>]/gu, '').trim().slice(0, max);
const projection = { _id: 0, peer_id: 1, device_name: 1, avatar: 1, room_code: 1, updated_at: 1 };

// Heartbeat: { peer_id, device_name, avatar, room_code } → peers seen in the last 20 s.
// Lookup:    { room_code, lookup: true } → the newest peer in that room.
export async function POST(req: Request) {
  if (!hasMongo()) return NextResponse.json({ peers: [] });
  if (await rateLimited(req, 'presence', 60)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  const body = await req.json().catch(() => ({}));
  const presence = (await getDb()).collection('peer_presence');
  const room_code = clean(body.room_code, 12).toUpperCase() || null;

  if (body.lookup) {
    if (!room_code) return NextResponse.json({ peers: [] });
    const peers = await presence.find({ room_code }, { projection }).sort({ updated_at: -1 }).limit(1).toArray();
    return NextResponse.json({ peers });
  }

  const peer_id = clean(body.peer_id, 64);
  if (!/^[a-zA-Z0-9-]{8,64}$/.test(peer_id)) return NextResponse.json({ error: 'Invalid peer id' }, { status: 400 });
  await presence.updateOne(
    { peer_id },
    { $set: { peer_id, device_name: clean(body.device_name, 32) || 'Nearby Device', avatar: clean(body.avatar, 4) || 'U', room_code, updated_at: new Date() } },
    { upsert: true },
  );
  const peers = await presence.find({ updated_at: { $gte: new Date(Date.now() - 20_000) } }, { projection }).sort({ updated_at: -1 }).limit(50).toArray();
  return NextResponse.json({ peers });
}
