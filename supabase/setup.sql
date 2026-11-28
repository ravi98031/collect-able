-- Run this once: Supabase dashboard > SQL Editor > New query > paste > Run.
create table if not exists products(
  id text primary key, name text not null, cat text not null, price numeric not null,
  sizes text[] not null default '{}', color text, print text, bg int default 0, tag text,
  is_drop boolean default false, descr text, art text, image text,
  sort int default 0, active boolean default true, created_at timestamptz default now());
create table if not exists settings(key text primary key, value text);
create table if not exists admins(email text primary key);

create or replace function is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from admins where lower(email)=lower(auth.jwt()->>'email')) $$;

alter table products enable row level security;
alter table settings enable row level security;
alter table admins enable row level security;

create policy "anyone reads products" on products for select using (true);
create policy "admin writes products" on products for all using (is_admin()) with check (is_admin());
create policy "anyone reads settings" on settings for select using (true);
create policy "admin writes settings" on settings for all using (is_admin()) with check (is_admin());
create policy "admin reads admins" on admins for select using (is_admin());

insert into storage.buckets(id,name,public) values('product-images','product-images',true) on conflict (id) do nothing;
create policy "anyone views images" on storage.objects for select using (bucket_id='product-images');
create policy "admin uploads images" on storage.objects for insert with check (bucket_id='product-images' and is_admin());
create policy "admin updates images" on storage.objects for update using (bucket_id='product-images' and is_admin());
create policy "admin deletes images" on storage.objects for delete using (bucket_id='product-images' and is_admin());

-- IMPORTANT: put YOUR login email here (the same email you create in Authentication > Users):
insert into admins(email) values ('YOUR-EMAIL@example.com') on conflict do nothing;
