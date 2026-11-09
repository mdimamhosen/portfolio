# Md. Imam Hosen portfolio

Existing Vite + React portfolio. Netlify hosts the public site and serverless functions. The homepage, animations, projects, contact form, file sharing, visitor tracking, and portfolio chat remain in the application. This update adds a server-rendered blog, blog admin, two service pages, dynamic sitemap/feed, corrected SEO metadata, and optional consent-based GA4.

## Audit and implementation checklist

| Area | Current state / action |
| --- | --- |
| Public hosting | `https://mdimamhosen.netlify.app/` responded HTTP 200 with HTTPS on 15 Oct 2026. Keep it live. |
| Stack | npm, Vite 5, React 18, React Router, Tailwind, Netlify Functions; existing Supabase integration and separate MongoDB-based visitor/chat APIs. |
| Git | `main` on GitHub. Netlify automatically deployed security cleanup commit `0757d75` from `main` on 15 Oct 2026. The larger upgrade is on a separate branch. |
| Design | Existing home sections and animations remain. Service/blog links added to navigation. |
| SEO | Old homepage canonical and sitemap pointed at a Vercel URL. Corrected to live Netlify host; removed nonexistent sitemap paths. Blog and services return crawlable HTML from functions. |
| Blog | Added Supabase SQL migration, protected CRUD API, private cookie-based editor, cover uploads, HTML article pages, RSS feed, and dynamic sitemap. Requires database migration and server secrets. |
| Analytics | Optional GA4 measurement ID with consent gate. No placeholder ID is loaded. |
| Search Console | Code-side sitemap and robots prepared. Property ownership and submission require owner Google login. |
| Domain | `mdimamhosen.com` had no Verisign WHOIS match on 15 Oct 2026; confirm with registrar before registration. No purchase or DNS change made. |

All code-side changes use existing dependencies and Netlify/Supabase rather than a second application backend. Database and Netlify free tiers may be suitable, subject to their current quotas.

## Build and local checks

```sh
npm ci
npm run lint
npx tsc --noEmit -p tsconfig.app.json
npx tsc --noEmit -p tsconfig.server.json
npm run build
```

The Vite dev server serves the React homepage and blog editor. Public `/blog` and `/services` HTML are served by Netlify Functions in deployment. Use `netlify dev` for full local route tests after configuring server environment variables.

## Security finding in the inherited repository

The GitHub `main` received an obfuscated executable payload in `postcss.config.js`, plus a fake `.woff2` file containing JavaScript and VS Code settings/tasks configured to execute it when the folder opens. The earlier local commit also contained an obfuscated payload in PostCSS. These files have been removed or replaced with a minimal configuration in this branch. A previous `.env` file also exists in the public repository history, although it was later removed. **Treat credentials available on machines that opened or built the affected checkout as potentially exposed.** Rotate relevant GitHub, Netlify, MongoDB, AI provider, Supabase secret, and other private credentials from a trusted environment before production deployment. Review account activity and remove unrecognized access. Public Supabase publishable/anon keys are not secrets, but verify Row Level Security and rotate any privileged key that may have been present elsewhere. The code cleanup does not revoke credentials or rewrite Git history.

## Required production setup

1. In the existing Supabase project, apply `supabase/migrations/20261015000000_blog.sql` through the SQL editor or an authenticated migration workflow. It creates article and login-attempt tables and a public blog cover bucket. Back up the project before applying a migration. Keep the existing Supabase project and existing tables.
2. In the existing Netlify site's environment settings, set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server only), and `PUBLIC_SITE_URL=https://mdimamhosen.netlify.app`. Preserve existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` values for the file share and legacy admin features. Never prefix the service key with `VITE_` and never place it in repository files. Use a server secret key with service-role access where supported.
3. Generate a unique 16+ character admin password and set it in a temporary `BLOG_ADMIN_PASSWORD` environment variable on your own machine. Run `node scripts/hash-admin-password.mjs` and copy its output to Netlify's `BLOG_ADMIN_PASSWORD_HASH` environment variable. Remove the temporary plaintext variable. Generate `BLOG_SESSION_SECRET` with `openssl rand -hex 32` and store it in Netlify. Do not share either value in chat or source control.
4. Confirm Netlify is connected to `mdimamhosen/portfolio`, production branch `main`, build command `npm run build`, publish directory `dist`, and functions directory `netlify/functions`. Enable deploy previews and failure notifications in Netlify. After the migration and secrets are ready, merge/push this change and confirm the Netlify deploy status and logs. Automatic production deployment from `main` was observed for the security cleanup, but deploy previews still need dashboard verification.
5. Test `/`, `/blog`, `/services`, `/services/backend-development`, `/services/ai-integration`, `/admin/blog`, `/sitemap.xml`, `/feed.xml`, and a published `/blog/<slug>` URL in production. Refresh nested routes. Check that a draft slug returns 404 and the admin API rejects unauthenticated writes. A newly installed blog has no articles; this is expected.
6. Supabase database backups: use the project's available backup/export feature or a scheduled `pg_dump` to encrypted storage. Restore to a separate project first, then confirm article count and image references before switching production. Cover files in Storage require a separate bucket export.

Blog admin is at `/admin/blog`. There is no public admin registration or default password. Password attempts are limited to five per IP hash in 15 minutes. The login cookie is HttpOnly, Secure, SameSite=Strict and expires after 12 hours. Database tables deny browser roles and the API checks session authorization on every write. The existing legacy `/admin` file viewer retains its Supabase magic-link login and is separate from blog management.

The editor supports Markdown, tables, code blocks, syntax highlighting, and preview; images can be uploaded as JPEG/PNG/WebP up to 3 MB, or entered as HTTPS URLs with alt text. Draft and future scheduled articles do not appear in public queries, feed, or sitemap. Scheduled articles become public when their publication timestamp passes. Markdown rendering does not allow raw HTML. Avoid placing secrets or private information in article drafts.

## Domain, Search Console, and analytics

- Keep the Netlify subdomain live while registering a domain. After purchase, add the domain in Netlify, use Netlify's exact displayed DNS records, wait for ownership and TLS verification, select one primary host (recommend apex), redirect `www` to it, then update `PUBLIC_SITE_URL`, homepage canonical/OG tags, robots/sitemap base, and old-host redirect. Do not change DNS before the target site and certificate are ready.
- In [Google Search Console](https://search.google.com/search-console), add a Domain property for the purchased domain and copy Google's TXT record into the domain DNS settings. Verify in Search Console, submit `https://<primary-host>/sitemap.xml`, inspect the homepage, both service pages, and published articles. Request indexing for important URLs after substantive updates. Until a domain is owned, use a URL-prefix property for `https://mdimamhosen.netlify.app/` with the verification method Google provides. This repository does not contain a verification token.
- In [Google Analytics](https://analytics.google.com/), create a GA4 property and web data stream, then set `VITE_GA_MEASUREMENT_ID=G-...` in Netlify and redeploy. The tag loads only after visitor consent and avoids admin routes. Check Realtime/DebugView yourself. React pages emit `page_view`, and links emit `contact_click`, `email_click`, `github_click`, `linkedin_click`, `project_click`, and `resume_download` when applicable. Public blog HTML loads the tag after consent. No Analytics ID is currently configured or verified.

## Editorial backlog

| Topic / proposed title | Audience and intent | Target service | Evidence and internal links | Status |
| --- | --- | --- | --- | --- |
| Designing authorization for multi-role APIs | SaaS builders seeking implementation guidance | Backend development | Existing backend skills; link `/services/backend-development` | Idea; verify examples before drafting |
| Practical RAG evaluation for support agents | Teams researching AI support features | AI integration | ClientServe AI listing; link `/services/ai-integration` | Idea; obtain project details before drafting |
| Background jobs in Node.js applications | Developers solving long-running work | Backend development | Node.js experience; link backend service page | Idea; create original code examples |
| When to use an agent workflow versus a simple API call | Product teams evaluating AI architecture | AI integration | Portfolio AI work; link AI service page | Idea; review claims before publishing |

Publish only original, reviewed articles with accurate examples. Do not create artificial backlinks or claims of search rankings.

## Dependency audit

After compatible dependency updates, `npm audit --omit=dev` reports **0 high or critical** and **2 moderate** advisories in React Router 6. The suggested fix requires a major React Router 7 migration; this was not forced into the existing portfolio without route and UI regression testing. The reported server-side hydration issue does not apply to the Vite SPA, but the open-redirect advisory should still be addressed in a planned routing upgrade.

## Known limits

- Netlify account connection, database migration, environment secrets, Search Console, GA4, and domain purchase cannot be completed from this checkout alone.
- The homepage remains a client-rendered Vite SPA. The new blog and service pages are server-rendered for crawlers. Existing project detail pages are not yet present because project roles and implementation details require verification.
- Legacy project stats and employment/outcome claims were already in the portfolio. They should be checked by the owner before being promoted into new case studies or SEO pages.
- Blog admin currently has Markdown editing rather than a full WYSIWYG editor. The public blog has an RSS feed, search, and paginated listing; category/tag pages are future enhancements.
