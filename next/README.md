# Portfolio (Next.js)

Next.js 15 port of the Vite app in the parent folder. It uses the same UI, with all data in MongoDB.

## Run locally

    cp .env.example .env.local   # fill in MONGODB_URI, BLOG_SESSION_SECRET, BLOG_ADMIN_PASSWORD_HASH at minimum
    npm install
    npm run dev                  # http://localhost:3000
    npm test

## Deploy (Vercel)

1. Import the repo in Vercel and set **Root Directory = `next`**.
2. Add the variables from `.env.example` under Project → Settings → Environment Variables.
   Set `PUBLIC_SITE_URL` to the final domain; canonical tags and the sitemap use it.
3. Deploy.

## Move blog posts from Supabase (one time)

    SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... MONGODB_URI=... npm run migrate:blog -- --images

Safe to re-run (upserts by slug). `--images` copies Supabase-hosted covers into MongoDB as WebP.
Files from the old Share cloud backup are not migrated.

## Admin

`/login` uses the password whose scrypt hash is in `BLOG_ADMIN_PASSWORD_HASH`
(`BLOG_ADMIN_PASSWORD=... node scripts/hash-admin-password.mjs`). One session covers `/admin`, `/admin/visitors` and `/admin/blog`.

## After deploy (not code)

- Submit `https://<domain>/sitemap.xml` in Google Search Console.
- Run a service page and a blog post through Google's Rich Results Test.
