import { randomUUID } from 'node:crypto';
import type { Handler } from '@netlify/functions';
import { allowedOrigin, isAdmin, json } from './_blog/core';
const types: Record<string,string> = { 'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp' };
export const handler: Handler = async event => {
  if (event.httpMethod !== 'POST') return json(405, {error:'Method not allowed'});
  if (!isAdmin(event)) return json(401, {error:'Sign in required'});
  if (!allowedOrigin(event)) return json(403, {error:'Invalid origin'});
  try {
    const body = JSON.parse(event.body || '{}');
    const mime = String(body.mime || '');
    if (!types[mime] || typeof body.data !== 'string' || body.data.length > 4_300_000) return json(400, {error:'Use a JPEG, PNG, or WebP image under 3 MB'});
    const data = Buffer.from(body.data, 'base64');
    if (data.length === 0 || data.length > 3_145_728) return json(400, {error:'Image must be under 3 MB'});
    const valid = mime === 'image/jpeg' ? data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff : mime === 'image/png' ? data.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')) : data.toString('ascii',0,4) === 'RIFF' && data.toString('ascii',8,12) === 'WEBP';
    if (!valid) return json(400, {error:'Image contents do not match file type'});
    const url = process.env.SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return json(503, {error:'Image storage is not configured'});
    const path = `${randomUUID()}.${types[mime]}`;
    const response = await fetch(`${url}/storage/v1/object/blog-covers/${path}`, {method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':mime,'Cache-Control':'public, max-age=31536000, immutable'},body:data});
    if (!response.ok) return json(502, {error:'Image upload failed'});
    return json(200, {url:`${url}/storage/v1/object/public/blog-covers/${path}`});
  } catch { return json(400, {error:'Invalid upload'}); }
};
