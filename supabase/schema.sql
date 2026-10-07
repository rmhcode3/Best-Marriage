-- BMM — initial schema (run in the Supabase SQL editor).
-- Profiles: one row per user. Sensitive fields live in `data` (jsonb); access is owner-only for now.
-- Member-to-member visibility (profile visibility, plan limits, phone privacy) must be added
-- server-side (RLS / RPC) when the member screens are built — never enforce it only in the UI.

create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb       not null default '{}'::jsonb,
  step       int         not null default 0,
  photos     text[]      not null default '{}',
  submitted  boolean     not null default false,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = user_id);

-- Private photo bucket. Photos are served only through signed URLs.
insert into storage.buckets (id, name, public) values ('profile-photos', 'profile-photos', false)
on conflict (id) do nothing;

create policy "photos_owner_read"   on storage.objects for select using (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos_owner_insert" on storage.objects for insert with check (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos_owner_delete" on storage.objects for delete using (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);
