import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

// Mirrors lib/server/auth.ts (which imports server-only/next and can't load under plain node).
const secret = 's3cret';
const sign = (v: string) => createHmac('sha256', secret).update(v).digest('hex');
const verify = (value: string) => {
  const [expiry, signature] = value.split('.');
  if (!/^\d+$/.test(expiry || '') || Number(expiry) < Date.now() || !signature || signature.length !== 64) return false;
  return timingSafeEqual(Buffer.from(sign(expiry)), Buffer.from(signature));
};

test('session cookie: valid, expired, tampered', () => {
  const future = String(Date.now() + 60_000);
  assert.equal(verify(`${future}.${sign(future)}`), true);
  const past = String(Date.now() - 1);
  assert.equal(verify(`${past}.${sign(past)}`), false);
  assert.equal(verify(`${future}.${'0'.repeat(64)}`), false);
  assert.equal(verify('garbage'), false);
});

test('password hash format matches scripts/hash-admin-password.mjs', () => {
  const salt = randomBytes(32).toString('hex');
  const hash = scryptSync('correct horse battery', salt, 64).toString('hex');
  assert.match(hash, /^[a-f0-9]{128}$/);
  assert.ok(timingSafeEqual(scryptSync('correct horse battery', salt, 64), Buffer.from(hash, 'hex')));
});
