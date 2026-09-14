# Nicole App 🐻

A simple, mobile-friendly personal finance tracker. Log expenses and income, see
a monthly dashboard, and track spending trends over time — gated behind a single
6-digit PIN, no accounts needed.

**Stack:** Next.js (App Router) + TypeScript, Tailwind CSS, Drizzle ORM on Neon
Postgres, Recharts, deployed on Vercel.

## 1. Set up the database (Neon)

Pick one:

**Option A — Vercel Marketplace (recommended if deploying to Vercel)**

1. Push this repo to GitHub and import it into a new Vercel project (or open an
   existing one).
2. In the Vercel project, go to **Storage → Marketplace Database Providers → Neon**
   (or visit [vercel.com/marketplace/neon](https://vercel.com/marketplace/neon))
   and install it. This creates a free Neon project and automatically injects
   `DATABASE_URL` (and `DATABASE_URL_UNPOOLED`) into your Vercel project's
   environment variables.
3. Pull the env vars down for local development:
   ```bash
   npx vercel env pull .env.local
   ```

**Option B — Create a Neon project directly**

1. Sign up at [neon.tech](https://neon.tech) (free tier: 0.5GB storage,
   scale-to-zero compute — plenty for one person's transaction log).
2. Create a project, then go to **Connect** and copy the pooled connection
   string.
3. Paste it into `.env.local` as `DATABASE_URL` (see step 2 below).

## 2. Configure environment variables

Copy the example file and fill in real values:

```bash
cp .env.local.example .env.local
```

- `DATABASE_URL` — your Neon connection string from step 1.
- `APP_PIN` — the 6-digit PIN used to unlock the app. Keep it private; don't
  commit it.
- `SESSION_SECRET` — a random secret used to sign the login session cookie.
  Generate one with:
  ```bash
  openssl rand -hex 32
  ```

## 3. Install dependencies and create the schema

```bash
npm install
npm run db:push
```

`db:push` syncs the Drizzle schema in `src/db/schema.ts` directly to your Neon
database — no migration files needed for a project this size. If you'd rather
version migrations, use `npm run db:generate` (writes SQL files to `./drizzle`)
and apply them with your own tooling.

Optional: seed some sample transactions to try the UI with data:

```bash
npm run db:seed
```

## 4. Run it locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on the PIN
pad. Enter the `APP_PIN` you set above.

## 5. Deploy to Vercel

1. Push to GitHub, import the repo into Vercel.
2. Make sure `DATABASE_URL`, `APP_PIN`, and `SESSION_SECRET` are all set in the
   Vercel project's environment variables (if you used the Marketplace
   integration, `DATABASE_URL` is already there — just add the other two).
3. Deploy. Vercel builds and hosts the app; Neon's serverless Postgres handles
   the database with no server to manage.

## Project structure

- `src/db/schema.ts` — the single `transactions` table.
- `src/lib/categories.ts` — expense categories and income sources shown across
  the app (edit here to add/rename categories).
- `src/lib/transactions.ts` — data-fetching and aggregation helpers used by the
  dashboard, log, and summary pages.
- `src/app/actions.ts` — server actions for creating, updating, and deleting
  transactions.
- `src/app/login/actions.ts` — PIN verification and session cookie handling.
- `src/proxy.ts` — route protection (Next.js's middleware/proxy convention);
  redirects unauthenticated requests to `/login`.
- `src/app/`, `src/components/` — the three tabs (Home, Expenses, Summary),
  the shared add/edit transaction form, and shared UI.

## Manual test checklist

- [ ] Visiting any page while logged out redirects to `/login`.
- [ ] Wrong PIN shows an inline error; correct PIN logs in and redirects to `/`.
- [ ] Add an expense, then an income transaction — both show up on Home and in
      the Expenses log.
- [ ] Edit a transaction (change amount/category/date/note) — changes reflect
      everywhere.
- [ ] Delete a transaction (with confirmation) — it disappears from all tabs.
- [ ] Home dashboard totals, the category donut chart, and the Summary tab's
      month-over-month chart and category breakdown all update correctly.
- [ ] Log out clears the session and returns you to `/login`.
