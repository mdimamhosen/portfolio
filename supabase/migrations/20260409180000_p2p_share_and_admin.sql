create table if not exists public.peer_presence (
  peer_id text primary key,
  device_name text not null,
  avatar text not null,
  room_code text,
  updated_at timestamptz not null default now()
);

alter table public.peer_presence enable row level security;

drop policy if exists "public read peer presence" on public.peer_presence;
create policy "public read peer presence"
on public.peer_presence
for select
using (true);

drop policy if exists "public write peer presence" on public.peer_presence;
create policy "public write peer presence"
on public.peer_presence
for insert
with check (true);

drop policy if exists "public update peer presence" on public.peer_presence;
create policy "public update peer presence"
on public.peer_presence
for update
using (true)
with check (true);

create table if not exists public.shared_files (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_size bigint not null,
  file_type text not null,
  storage_path text not null unique,
  sender_name text,
  receiver_name text,
  created_at timestamptz not null default now()
);

alter table public.shared_files enable row level security;

drop policy if exists "insert shared files by anyone" on public.shared_files;
create policy "insert shared files by anyone"
on public.shared_files
for insert
with check (true);

drop policy if exists "admin can view shared files" on public.shared_files;
create policy "admin can view shared files"
on public.shared_files
for select
using (auth.jwt() ->> 'email' = 'mdimam.cse9.bu@gmail.com');

insert into storage.buckets (id, name, public)
values ('shared-files', 'shared-files', false)
on conflict (id) do nothing;

drop policy if exists "allow upload shared files" on storage.objects;
create policy "allow upload shared files"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'shared-files');

drop policy if exists "admin read shared files bucket" on storage.objects;
create policy "admin read shared files bucket"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'shared-files'
  and auth.jwt() ->> 'email' = 'mdimam.cse9.bu@gmail.com'
);

drop policy if exists "admin delete shared files bucket" on storage.objects;
create policy "admin delete shared files bucket"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'shared-files'
  and auth.jwt() ->> 'email' = 'mdimam.cse9.bu@gmail.com'
);

drop policy if exists "admin can delete shared files" on public.shared_files;
create policy "admin can delete shared files"
on public.shared_files
for delete
using (auth.jwt() ->> 'email' = 'mdimam.cse9.bu@gmail.com');
