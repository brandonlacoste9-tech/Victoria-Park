# Netlify Deploy — RendezVous AI

Repo: [brandonlacoste9-tech/AI-Assistant](https://github.com/brandonlacoste9-tech/AI-Assistant)

## 1. Connect site

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Choose **GitHub** → authorize → select `brandonlacoste9-tech/AI-Assistant`
3. Netlify auto-reads `netlify.toml` at repo root

**Build settings (auto from netlify.toml):**

| Setting | Value |
|---------|-------|
| Base directory | `web` |
| Build command | `npm run build` |
| Publish directory | `.next` (handled by Next.js plugin) |
| Node version | `20` |

4. **Do not deploy yet** — add env vars first (step 2)

## 2. Environment variables

Netlify → **Site configuration** → **Environment variables** → **Add a variable**

Add every row below. Use **Production** scope (and **Deploy previews** if you want preview deploys to work).

### Required (Phase 0)

| Variable | Value | Scopes | Secret? |
|----------|-------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | All | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` (anon key) | All | No |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbG...` (service_role) | All | **Yes** |
| `NEXT_PUBLIC_SITE_URL` | `https://resilient-khapse-ecd31c.netlify.app` | Production | No |

For deploy previews, either set `NEXT_PUBLIC_SITE_URL` per-deploy via Netlify's `URL` substitution or use:

```
NEXT_PUBLIC_SITE_URL=https://$DEPLOY_PRIME_URL
```

(Netlify exposes `DEPLOY_PRIME_URL` at build time in some contexts; safest: set your production URL first, add preview URL to Supabase redirect allowlist.)

### Optional (Phase 1 — billing)

| Variable | Value | Secret? |
|----------|-------|---------|
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` | **Yes** |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | **Yes** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` or `pk_test_...` | No |

### Optional (Phase 2 — comms)

| Variable | Value | Secret? |
|----------|-------|---------|
| `TWILIO_ACCOUNT_SID` | From Twilio console | **Yes** |
| `TWILIO_AUTH_TOKEN` | From Twilio console | **Yes** |
| `TWILIO_MESSAGING_SERVICE_SID` | Messaging service SID | No |

## 3. Deploy

Click **Deploy site** (or push to `main` for auto-deploy).

Build should complete in ~2–3 minutes.

## 4. Post-deploy checklist

- [ ] Visit `https://YOUR-SITE.netlify.app` — landing loads FR
- [ ] Toggle EN/FR — copy switches
- [ ] Submit waitlist → row in Supabase `waitlist_signups`
- [ ] `/pricing` loads plan cards
- [ ] `/signup` creates user + business in Supabase
- [ ] Add Netlify URL to Supabase Auth redirect URLs (see `SUPABASE_SETUP.md`)

## 5. Custom domain (optional)

Netlify → **Domain management** → **Add domain** → e.g. `rendezvousai.ca`

Then update:

- `NEXT_PUBLIC_SITE_URL` → `https://rendezvousai.ca`
- Supabase Auth Site URL + redirect URLs

## 6. Stripe webhook (Phase 1)

When billing is live:

1. Stripe Dashboard → **Webhooks** → Add endpoint
2. URL: `https://YOUR-SITE.netlify.app/api/webhooks/stripe`
3. Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET` in Netlify

## 7. Local Netlify CLI (optional)

```bash
npm install -g netlify-cli
netlify login
cd AI-Assistant
netlify init          # link to existing site
netlify env:import netlify.env.example  # after filling values locally
netlify deploy --build  # preview
netlify deploy --prod   # production
```

## 8. Scheduled crons (reminders + usage)

Netlify runs wrappers in `netlify/functions/` that call your Next.js API routes.

| Function | Schedule (UTC) | API route |
|----------|----------------|-----------|
| `cron-reminders` | `0 13 * * *` (~8h ET) | `/api/cron/reminders` |
| `cron-reminders-2h` | `0 * * * *` (hourly) | `/api/cron/reminders-2h` |
| `cron-usage-rollup` | `0 11 * * *` (~6h ET) | `/api/cron/usage-rollup` |

**Required env:** `CRON_SECRET` (random string). Wrappers send `Authorization: Bearer $CRON_SECRET`.

After deploy, confirm on Netlify → **Functions** that all three show a **Scheduled** badge. Use **Run now** to test.

Local manual trigger:

```bash
cd web
npm run cron:reminders
npm run cron:reminders-2h
npm run cron:usage-rollup
```

**Pilot tip:** Enable Twilio and Vapi billing/usage email alerts in each provider dashboard.

## 9. Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on `SUPABASE` | Env vars missing — add all required vars, redeploy |
| Waitlist 500 | `SUPABASE_SERVICE_ROLE_KEY` wrong or migration not run |
| Auth redirect error | Add Netlify URL to Supabase redirect allowlist |
| Wrong site URL in emails | Update `NEXT_PUBLIC_SITE_URL` and redeploy |
| Edge: `Could not resolve "@opentelemetry/api"` | Phase 0 ships **without** `src/middleware.ts`. API routes use service role. Re-add middleware for `/dashboard` with `npm install @opentelemetry/api` |
| Plugin warns Node 20 vs 22 | `netlify.toml` sets `NODE_VERSION = "22"` |
| Crons never run | Set `CRON_SECRET` in Netlify env; redeploy; check Functions → Scheduled |

## Build log notes

A successful deploy may still show an Edge Functions bundling warning if `middleware.ts` imports `@supabase/ssr`. The marketing site does not need Edge middleware — waitlist and signup use `/api/*` server routes.