-- RokRest International Bakery — Supabase schema + seed
-- Run in the Supabase SQL editor (Dashboard → SQL → New query).
-- Afterwards: enable Realtime for `orders` if you want live kitchen status
-- (Database → Replication → `orders`).

-- Extensions (usually enabled on Supabase by default)
create extension if not exists "pgcrypto";

-- ─── products ─────────────────────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null,
  category text not null,
  image_url text not null,
  is_vegan boolean not null default false,
  is_nut_free boolean not null default false,
  featured boolean not null default false
);

-- ─── testimonials ─────────────────────────────────────────────────────────
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  rating int not null default 5,
  date date not null default (now() at time zone 'utc')::date
);

-- ─── newsletter ─────────────────────────────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz not null default now()
);

-- ─── contact submissions ──────────────────────────────────────────────────
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  order_type text not null,
  created_at timestamptz not null default now()
);

-- ─── opening hours (public read; maintain via dashboard) ───────────────────
create table if not exists public.opening_hours (
  id uuid primary key default gen_random_uuid(),
  day_label text not null,
  hours_text text not null,
  sort_order int not null default 0
);

-- ─── holiday notices ──────────────────────────────────────────────────────
create table if not exists public.holiday_notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  sort_order int not null default 0
);

-- ─── orders ───────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  customer_name text,
  items jsonb not null,
  total numeric(10, 2) not null,
  delivery_slot text not null,
  pickup_method text not null,
  postcode text,
  status text not null default 'pending',
  stripe_payment_intent_id text,
  created_at timestamptz not null default now()
);

create index if not exists orders_stripe_pi_idx
  on public.orders (stripe_payment_intent_id);

-- ─── Row Level Security (tighten for production) ─────────────────────────
-- Demo: allow anonymous reads for catalogue content; block direct public writes.
-- Server routes use the service role key to insert orders & forms.

alter table public.products enable row level security;
alter table public.testimonials enable row level security;
alter table public.opening_hours enable row level security;
alter table public.holiday_notices enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Public read products" on public.products;
drop policy if exists "Public read testimonials" on public.testimonials;
drop policy if exists "Public read opening_hours" on public.opening_hours;
drop policy if exists "Public read holiday_notices" on public.holiday_notices;

create policy "Public read products" on public.products for select using (true);
create policy "Public read testimonials" on public.testimonials for select using (true);
create policy "Public read opening_hours" on public.opening_hours for select using (true);
create policy "Public read holiday_notices" on public.holiday_notices for select using (true);

-- No anon insert/update/delete policies — all writes go through Next.js API + service role.

-- ─── Seed: products (15) ───────────────────────────────────────────────────
insert into public.products (name, description, price, category, image_url, is_vegan, is_nut_free, featured)
values
  ('Sourdough Bloomer', 'Slow-fermented loaf with a crackling crust.', 4.50, 'Artisan Breads', 'https://images.unsplash.com/photo-1586444248909-1c15a0a7b2c6?w=800&q=80', true, true, true),
  ('Butter Croissant', 'French-style layers, baked fresh each morning.', 2.80, 'Pastries', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80', false, true, true),
  ('Tiramisu Slice', 'Italian classic with espresso-soaked sponge.', 5.25, 'Cakes & Desserts', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80', false, false, true),
  ('Spinach & Feta Parcel', 'Flaky pastry with Mediterranean flavours.', 3.95, 'Savories', 'https://images.unsplash.com/photo-1625937759425-26d8e52dcb3e?w=800&q=80', false, true, true),
  ('Pretzel Roll', 'German-style pretzel dough with salt crystals.', 2.20, 'International Specials', 'https://images.unsplash.com/photo-1594631252849-802569c087d3?w=800&q=80', false, true, false),
  ('Baklava Bites', 'Middle Eastern honeyed pastry with pistachio.', 4.75, 'International Specials', 'https://images.unsplash.com/photo-1608743652456-0cfd3d85e51f?w=800&q=80', false, false, false),
  ('Custard Bun', 'Soft Asian-style milk bread with vanilla custard.', 2.90, 'International Specials', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80', false, true, false),
  ('Focaccia di Recco', 'Thin Italian flatbread with olive oil and rosemary.', 4.10, 'Artisan Breads', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80', true, true, false),
  ('Victoria Sponge', 'British tea-room classic with jam and cream.', 3.60, 'Cakes & Desserts', 'https://images.unsplash.com/photo-1562447279-89998b8c8b5c?w=800&q=80', false, true, false),
  ('Vegan Cinnamon Swirl', 'Plant-based swirl with caramel glaze.', 3.20, 'Pastries', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&q=80', true, true, false),
  ('Scotch Egg', 'Sausage-wrapped egg with wholegrain mustard.', 4.40, 'Savories', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80', false, true, false),
  ('Cardamom Bun', 'Nordic-inspired knot with pearl sugar.', 3.50, 'Pastries', 'https://images.unsplash.com/photo-1517433670267-08bbd4f89046?w=800&q=80', false, true, false),
  ('Manchester Tart', 'Regional favourite with custard and cherry.', 3.85, 'Cakes & Desserts', 'https://images.unsplash.com/photo-1586985289686-b3bf05bcc740?w=800&q=80', false, false, false),
  ('Seeded Rye', 'Hearty German-style rye with sunflower seeds.', 5.10, 'Artisan Breads', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', true, false, false),
  ('Leek & Montgomery Tart', 'British savoury tart with mature cheddar.', 4.95, 'Savories', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80', false, true, false);

insert into public.testimonials (name, text, rating, date)
values
  ('Aisha K.', 'Best croissants in Sheffield — flaky, buttery, and always warm.', 5, '2025-11-02'),
  ('James P.', 'The international specials are a treat. Baklava bites are incredible.', 5, '2025-10-18'),
  ('Elena M.', 'Ordered catering for our office; punctual and beautifully presented.', 5, '2025-09-30');

insert into public.opening_hours (day_label, hours_text, sort_order)
values
  ('Monday – Saturday', '08:00 – 19:00', 0),
  ('Sunday', '09:00 – 15:00', 1);

insert into public.holiday_notices (title, body, sort_order)
values
  ('Easter weekend', 'Adjusted hours: Good Friday 9am–3pm; Easter Monday closed.', 0),
  ('Christmas', '24 Dec 9am–2pm; closed 25–26 Dec; 27 Dec 10am–4pm.', 1),
  ('Summer closure', 'One-week summer break each August — dates posted in-store.', 2);
