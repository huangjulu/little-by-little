# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

"Little by Little" (小步小步) is a Next.js 15 order management system using Supabase as backend. See `README.md` and `docs/getting-started/README.md` for standard commands.

### Running services

1. **Supabase (local, via Docker):** Required for all data and auth. Start with `sudo env "PATH=$PATH" npx supabase start` from the workspace root. This spins up PostgreSQL, Auth, REST API, and other services via Docker containers. The first run pulls images (~2-5 min).

2. **Next.js dev server:** `npx next dev` (or `npm run dev`, which also runs `prettier --write` first via the `predev` hook). Runs on port 3000.

### Database setup

The local Supabase instance requires manual table creation since no migration SQL files exist in the repo. The app needs two tables (`orders` and `customers`) with RLS policies for authenticated users. After `supabase start`, run the following SQL against the local database (`sudo docker exec -i supabase_db_little-by-little psql -U postgres -d postgres`):

```sql
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  base_price NUMERIC DEFAULT 0,
  current_price NUMERIC DEFAULT 0,
  contract_start_date TEXT,
  contract_end_date TEXT,
  payment_deadline TEXT,
  next_billing_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  customer_info JSONB DEFAULT '{}',
  order_id INTEGER REFERENCES orders(id),
  order_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert orders" ON orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update orders" ON orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to read customers" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert customers" ON customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update customers" ON customers FOR UPDATE TO authenticated USING (true);
```

### Auth setup

After starting Supabase, create the admin user via Supabase Auth API:

```bash
curl -X POST 'http://127.0.0.1:54321/auth/v1/signup' \
  -H 'apikey: <SUPABASE_ANON_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@lbl.local","password":"lbl-admin-1234"}'
```

The anon key is output by `supabase start`. The app's login passcode is `1234` (hardcoded in `src/app/api/auth/login/route.ts`).

### Environment variables

Create `.env.local` at the workspace root with values from `supabase start` output:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<publishable key from supabase start>
```

### Non-obvious caveats

- `npm run dev` triggers `predev` which runs `prettier --write` on all files first. To skip formatting, run `npx next dev` directly.
- Docker must be running before `supabase start`. In this environment, Docker needs `fuse-overlayfs` storage driver and `iptables-legacy`.
- The `supabase/config.toml` references a `seed.sql` that does not exist; the warning "no files matched pattern: supabase/seed.sql" is expected and harmless.
- Prisma and `postgres` npm packages are listed as dependencies but are NOT actively used in the source code.
- Standard dev commands are documented in `docs/development/scripts.md`.
