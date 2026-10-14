create table if not exists public.blog_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 5 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null default '',
  content text not null default '',
  cover_image text,
  cover_image_alt text,
  status text not null default 'draft' check (status in ('draft','published','scheduled')),
  author text not null default 'Md. Imam Hosen',
  category text,
  tags text[] not null default '{}',
  seo_title text,
  seo_description text,
  canonical_url text,
  social_image text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_content check (status <> 'published' or (char_length(content) >= 100 and published_at is not null)),
  constraint scheduled_date check (status <> 'scheduled' or published_at > now())
);
create index if not exists blog_public_index on public.blog_articles (published_at desc) where status = 'published';
create index if not exists blog_category_index on public.blog_articles (category, published_at desc);
alter table public.blog_articles enable row level security;
revoke all on public.blog_articles from anon, authenticated;
-- Blog access goes through Netlify Functions using the server-only service role key.
create table if not exists public.blog_login_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  attempted_at timestamptz not null default now()
);
create index if not exists blog_login_attempts_lookup on public.blog_login_attempts (ip_hash, attempted_at desc);
alter table public.blog_login_attempts enable row level security;
revoke all on public.blog_login_attempts from anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-covers', 'blog-covers', true, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
-- Uploads are performed by the server with a service key after admin session checks.
