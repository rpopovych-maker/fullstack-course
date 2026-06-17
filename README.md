# Fullstack Course

A learning monorepo focused on **backend development** in Node.js. The repo is structured as a fullstack app (Vue frontend + Fastify backend) so the API has a real client to talk to, but the goal is to learn server-side patterns: Fastify, Drizzle, Zod, Postgres, Stripe webhooks, Supabase auth, etc.

- `apps/server` — Fastify + TypeScript + Drizzle + Postgres. This is the **focus**.
- `apps/app` — Vue 3 + Vite client. Exists so the API has a consumer; not the focus.

## Stack

| Layer        | Tech                                                                 |
| ------------ | -------------------------------------------------------------------- |
| Backend      | Node.js 22, Fastify 5, TypeScript, Drizzle ORM, Zod, Swagger         |
| Database     | PostgreSQL 17 (via Docker)                                           |
| Auth         | Supabase (JWT verified server-side)                                  |
| Payments     | Stripe (Checkout + webhooks, raw-body signature verification)        |
| Email        | Resend                                                               |
| Frontend     | Vue 3, Pinia, Element Plus, Tailwind, Vite                           |
| Tooling      | pnpm workspaces, ESLint, drizzle-kit                                 |

## Repo layout

```
.
├── apps/
│   ├── server/      # Fastify API (the learning target)
│   └── app/         # Vue 3 client
├── pnpm-workspace.yaml
└── package.json
```

## Prerequisites

- **Node.js** ≥ 22
- **pnpm** 10 (`corepack enable` if you don't have it)
- **Docker** — only if you want to run Postgres locally. **Skip if you're using your Supabase project's hosted Postgres** (set `DATABASE_URL` to the Supabase connection string and you're done).
- **Stripe CLI** — needed for local webhook forwarding. Install: https://stripe.com/docs/stripe-cli
- A **Supabase** project (URL + secret key for the server, URL + publishable key for the client). The same project can also provide your Postgres database — see step 3.
- A **Resend** API key (for transactional email)
- A **Stripe** account in test mode (secret key + a recurring price for the "Pro" plan)

## Setup

### 1. Install dependencies

```sh
pnpm install
```

### 2. Configure env files

**`apps/server/.env`** — see `src/types/EnvSchema.ts` for the source of truth. Required keys:

```
NODE_ENV=local
PORT=3000
HOST=0.0.0.0

# Postgres
PGHOST=localhost
PGPORT=5432
PGUSERNAME=postgres
PGPASSWORD=postgres
PGDATABASE=fullstack_course
DATABASE_URL=postgres://postgres:postgres@localhost:5432/fullstack_course

# Swagger basic auth (admin/<password>)
SWAGGER_USER=admin
SWAGGER_PWD=supersecure123

# Supabase
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SECRET_KEY=<service-role-or-secret-key>

# Client URL — used to build Stripe success/cancel URLs
CLIENT_APP_URL=http://localhost:5173

# Email
RESEND_API_KEY=<resend-key>
SENDER_EMAIL=noreply@example.com

# Invite link signature
SIGNATURE_SECRET=<random-string>

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...   # printed by `stripe listen`, see step 5
```

**`apps/app/.env`** — copy from `apps/app/.env.example`:

```
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
```

### 3. Provision Postgres

Pick **one** of:

**Option A — use Supabase's hosted Postgres** (simplest)

In your Supabase project: *Project Settings → Database → Connection string*. Use the **Transaction pooler** URL (port 6543) for app traffic. Paste it into `DATABASE_URL`. No Docker needed — skip to step 4.

**Option B — run Postgres locally in Docker**

From `apps/server/`:

```sh
pnpm local:env       # docker compose -f docker-compose.local.yml up
```

`DATABASE_URL` should then point at `localhost` using the `PG*` values you set in `.env`.

### 4. Run migrations

```sh
cd apps/server
pnpm db:migration:run
```

### 5. Start the Stripe webhook forwarder

In a dedicated terminal, from `apps/server/`:

```sh
pnpm stripe:listen
```

This authenticates the Stripe CLI with the `STRIPE_SECRET_KEY` from your `.env` (no `stripe login` needed) and opens a tunnel that forwards webhook events from Stripe → `http://localhost:3000/api/stripe/webhook`.

On startup it prints a line like:

```
> Ready! Your webhook signing secret is whsec_abc123...
```

Copy that value into `STRIPE_WEBHOOK_SECRET` in `apps/server/.env` and restart the server. Without it, the server will reject all webhook deliveries with `Invalid Stripe webhook signature`.

Keep the `stripe listen` process running for the entire dev session.

### 6. Start the backend

From `apps/server/`:

```sh
pnpm local
```

### 7. Start the frontend

From `apps/app/`:

```sh
pnpm dev
```

## Local URLs

| Service                   | URL                                                |
| ------------------------- | -------------------------------------------------- |
| Frontend                  | http://localhost:5173                              |
| Backend API               | http://localhost:3000/api                          |
| Swagger UI                | http://localhost:3000/api/documentation            |
| Health check              | http://localhost:3000/health                       |
| Drizzle Studio (DB GUI)   | run `pnpm db:migration:studio` in `apps/server/`   |

Swagger is basic-auth gated with `SWAGGER_USER` / `SWAGGER_PWD`.

## What the Stripe subscription is for

The app has a single paid plan — **Pro** — billed monthly via Stripe (cancel anytime). It gates the following member-only features:

- Read member-only posts in full
- Comment on member-only threads
- Support ongoing development

Non-subscribers can still browse the site and read public posts; the subscription only unlocks the member tier. Subscription state is held in our own Postgres `subscriptions` table and kept in sync with Stripe via webhooks — see the flow below.

## Frontend ↔ Backend ↔ Stripe flow

The Pro-subscription checkout uses Stripe-hosted Checkout. The backend creates the session and verifies the resulting webhooks; Stripe holds the card form.

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│ Frontend │                │ Backend  │                │  Stripe  │
│  (Vue)   │                │ (Fastify)│                │          │
└────┬─────┘                └─────┬────┘                └─────┬────┘
     │                            │                           │
     │  1. POST /api/subscriptions│                           │
     │     /checkout              │                           │
     │     (Supabase JWT)         │                           │
     ├───────────────────────────►│                           │
     │                            │  2. checkout.sessions     │
     │                            │     .create               │
     │                            ├──────────────────────────►│
     │                            │                           │
     │                            │  3. { url, sessionId }    │
     │                            │◄──────────────────────────┤
     │  4. { checkoutUrl }        │                           │
     │◄───────────────────────────┤                           │
     │                            │                           │
     │  5. window.location =      │                           │
     │     checkoutUrl            │                           │
     ├──────────────────────────────────────────────────────► │
     │                            │                           │
     │           [user pays on Stripe-hosted page]            │
     │                            │                           │
     │  6. redirect to            │                           │
     │     /success?session_id=…  │                           │
     │◄───────────────────────────────────────────────────────┤
     │                            │                           │
     │                            │  7. POST /api/stripe/     │
     │                            │     webhook               │
     │                            │     (raw body +           │
     │                            │      stripe-signature)    │
     │                            │◄──────────────────────────┤
     │                            │                           │
     │                            │  8. verify signature,     │
     │                            │     upsert subscription   │
     │                            │     in Postgres           │
     │                            │                           │
     │                            │  9. 204 No Content        │
     │                            ├──────────────────────────►│
     │                            │                           │
     │ 10. GET /api/subscriptions │                           │
     │     /me                    │                           │
     ├───────────────────────────►│                           │
     │                            │                           │
     │ 11. { status, … }          │                           │
     │◄───────────────────────────┤                           │
```

**Key points the diagram encodes:**

- The frontend **never talks to Stripe directly with secret keys**. It only calls our backend and follows the redirect URL Stripe returns.
- The webhook (step 7) is what actually changes the subscription state in our DB — *not* the success redirect (step 6). The redirect can be missed, replayed, or spoofed; the webhook is the source of truth.
- The Stripe CLI (`stripe listen`) is what makes step 7 reach `localhost` during development.
- Webhook verification uses the **raw request body** + the `stripe-signature` header. Fastify is configured with `fastify-raw-body` and the webhook route opts in via `config: { rawBody: true }`. Don't JSON-parse before verifying — the signature won't match.
