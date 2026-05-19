# RokRest International Bakery

Production-ready Next.js 14 (App Router) site for **RokRest International Bakery**, Sheffield — menu, Supabase-backed content, Zustand cart, Stripe Checkout (Payment Element), and demo-safe email logging.

## Prerequisites

- Node 20+
- npm
- (Optional) Supabase project + Stripe test keys for full flow

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase env vars the site uses **in-memory mock products**, testimonials, and opening hours so UI and cart still work.

## Environment variables

Copy `.env.example` to `.env.local` and fill in values you need:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server reads (menu, home, locations). |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — newsletter, contact, and order inserts from API routes. Never expose to the client. |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Payment Intents + Payment Element ([test cards](https://stripe.com/docs/testing)). |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Order confirmation email; omit to log a demo message instead. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (metadata, Stripe return URL). |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` or `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Analytics (optional). |

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run `supabase/seed.sql` **once** on a fresh database (tables + RLS + seed rows).
3. Copy **Project URL**, **anon key**, and **service role** key into `.env.local`.
4. (Optional) Enable **Realtime** replication for table `orders` if you want live status on `/order-confirmation`.

**Storage:** Product images use remote Unsplash URLs in the seed; you can switch `image_url` to Supabase Storage public URLs later.

## Stripe test checkout

1. Add test keys from the Stripe dashboard.
2. Add items to the basket → **Checkout**.
3. Use card `4242 4242 4242 4242`, any future expiry, any CVC.

The server recalculates totals from catalogue prices before creating a Payment Intent.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint
```

## Deploying to Vercel

1. Push the repo and import the project in Vercel.
2. Add the same environment variables (use **Production** + **Preview** as needed).
3. `vercel.json` pins the default region to `lhr1` (London) — adjust if you prefer.

Placeholder domain: **rokrestbakery.co.uk** (update `metadata` / copy when live).

## Stack

- Next.js 14, React 18, TypeScript  
- Tailwind CSS + shadcn-style UI (Base UI primitives)  
- Zustand + `persist` (cart → `localStorage`)  
- Framer Motion  
- React Hook Form + Zod  
- Supabase (Postgres, optional Realtime)  
- Stripe Payment Intents + Payment Element  
- Leaflet + OpenStreetMap (locations map)  
- Resend (optional) for transactional email  

## Licence

Private / portfolio use — adjust as needed for your deployment.
