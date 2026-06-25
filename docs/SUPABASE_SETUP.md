# Supabase Setup — RendezVous AI

## 1. Create project

**Connected project:** `ulbfaxhsbbckotcbmslk` — see [PROJECT_CONNECTED.md](PROJECT_CONNECTED.md)

If starting fresh:

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. **Name:** `rendezvous-ai`
3. **Region:** `East US (North Virginia)` — closest default; note for Law 25 docs
4. **Database password:** save in password manager
5. Wait ~2 minutes for provisioning

## 2. Run migrations

**Option A — SQL Editor (fastest)**

1. Dashboard → **SQL Editor** → **New query**
2. Paste and run `supabase/migrations/001_initial.sql`
3. Paste and run `supabase/migrations/002_grants_triggers.sql`

**Option B — Supabase CLI**

```bash
npm install -g supabase
supabase login
cd AI-Assistant
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Project ref is in Dashboard → **Project Settings** → **General** → Reference ID.

## 3. Auth settings

Dashboard → **Authentication** → **URL Configuration**

| Setting | Value |
|---------|-------|
| Site URL | `http://localhost:3000` (dev) |
| Redirect URLs | `http://localhost:3000/**` |
| | `https://resilient-khapse-ecd31c.netlify.app/**` |

Dashboard → **Authentication** → **Providers** → **Email**

- Enable Email provider
- Confirm email: **ON** (recommended for production)

## 4. Copy API keys

Dashboard → **Project Settings** → **API**

| Key | Env var |
|-----|---------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY` |

**Never expose `service_role` in the browser or `NEXT_PUBLIC_` vars.**

## 5. Local env

```bash
cd web
cp .env.local.example .env.local
```

Fill in the three Supabase values + `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.

Verify:

```bash
npm run check:env
```

## 6. Test waitlist

```bash
npm run dev
```

Submit the waitlist form on `/` → Dashboard → **Table Editor** → `waitlist_signups` should have a row.

## 7. Test signup

Submit `/signup` → check:

- **Authentication** → Users (new user)
- **Table Editor** → `businesses`, `users`, `subscriptions`

## Tables created

| Table | Purpose |
|-------|---------|
| `waitlist_signups` | Landing page waitlist (API insert via service role) |
| `businesses` | Tenant root |
| `users` | App operators linked to `auth.users` |
| `subscriptions` | Trial/billing state |

## Troubleshooting

| Error | Fix |
|-------|-----|
| `permission denied for table` | Re-run `002_grants_triggers.sql` |
| Signup creates auth user but no business | Check `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` |
| Email not sent | Use Supabase built-in email for dev; configure SMTP for production |
| RLS blocks reads | Expected for anon; dashboard routes use authenticated + policies |