import { randomBytes, scryptSync } from 'node:crypto';
const password = process.env.BLOG_ADMIN_PASSWORD;
if (!password || password.length < 16) {
  console.error('Set BLOG_ADMIN_PASSWORD to a unique password of at least 16 characters.');
  process.exit(1);
}
const salt = randomBytes(32).toString('hex');
console.log(`${salt}:${scryptSync(password, salt, 64).toString('hex')}`);
