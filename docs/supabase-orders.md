# Supabase Order Capture

The RFQ endpoint (`/api/rfq`) can persist each submission to Supabase so that the sales team has a single dashboard for manual confirmations.

## 1. Environment variables
Create or update your `.env.local` file with the Supabase credentials (service role access stays on the server only):

```
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Restart the dev server after adding them.

## 2. Database schema
Run the SQL below inside the Supabase SQL editor to create the backing table. It stores the flattened totals, checkout details, and the raw payload for traceability.

```sql
create extension if not exists "uuid-ossp";

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_id text not null unique,
  status text not null default 'pending-review',
  received_at timestamptz not null,
  review_eta timestamptz,
  locale text,
  quantity_total int,
  total_amount numeric,
  discount_amount numeric,
  checkout jsonb,
  notes text,
  items jsonb not null,
  discounts jsonb,
  raw_payload jsonb not null,
  created_at timestamptz not null default now()
);
```

You can add RLS policies later; for now keep the table private since inserts are done with the service role key on the server.

## 3. Optional dashboards
- Use Supabase table editor or SQL views to build a simple queue (`status`, `assigned_to`, `follow_up_at`).
- Connect the table to a BI tool (Metabase, Supabase Studio charts) to follow conversion by pack.

## 4. Local testing without Supabase
If the environment variables are missing, the API responds with HTTP 500 (`Supabase is not configured`). This keeps the UI functional while you finish the setup.
