# JustBookMe — Salon Pilot Playbook

One-page guide for onboarding the first Montreal salon pilot on https://justbookme.ca

## Before the salon signs up (founder — 15 min)

1. **Netlify env** — confirm these are set:
   - `CRON_SECRET` (random 32+ chars) — enables reminder + usage crons
   - `TWILIO_*`, `VAPI_*`, `SUPABASE_*`, `STRIPE_*` as needed
   - Leave `USAGE_ENFORCE` unset (or `false`) during pilot

2. **Run smoke test**
   ```bash
   cd web && npm run pilot:smoke
   ```
   All checks must pass. Health should show `"cron_secret": true` after step 1.

3. **Netlify Functions** → confirm 3 scheduled functions with **Scheduled** badge:
   - `cron-reminders` (daily)
   - `cron-reminders-2h` (hourly)
   - `cron-usage-rollup` (daily)

4. **Twilio + Vapi** — turn on billing/usage email alerts in each dashboard.

5. **Supabase** — migrations 007–011 applied (see `supabase/migrations/`).

## Salon onboarding (30 min with owner)

| Step | Where | What |
|------|-------|------|
| 1 | `/signup` | Create account — pick **Salon** business type, FR or EN |
| 2 | Onboarding wizard | Confirm services, hours, city |
| 3 | Settings → Voice | Customize greeting + instructions → **Sync voice agent** |
| 4 | Today dashboard | Complete checklist (5 items) |
| 5 | Test call | Call Twilio line — book a test appointment in FR and EN |
| 6 | Public book | Open `/book/{slug}` on phone — book a slot |
| 7 | Dashboard | Confirm booking appears under Rendez-vous |

**Plan for pilot:** Keep on **trial** or comp **pro** — not starter (limits are tight for a busy salon).

## What to demo to the owner

- AI answers in French or English (detects from first sentence)
- Books into their real services and hours
- Sends SMS confirmation after booking
- Dashboard shows today's calls, bookings, leads
- They can edit bookings and send reminder SMS manually

## Success metrics (first 2 weeks)

| Metric | Target |
|--------|--------|
| Voice calls handled | ≥5/week |
| AI bookings (voice or SMS) | ≥1/week |
| Owner completes checklist | 5/5 |
| No unexplained SMS/voice bill spike | <$50 marginal |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Voice not answering | Settings → Sync voice agent; check Vapi status |
| Wrong language | Caller should speak first sentence in desired language |
| Booking fails | Check services + hours in Settings; verify slot not taken |
| SMS not sent | Twilio env on Netlify; check Settings → Billing usage meters |
| Reminders not firing | Set `CRON_SECRET`; verify scheduled functions in Netlify |

## After pilot (week 3+)

- Gather 3 quotes from owner (what worked, what confused them)
- Enable `USAGE_ENFORCE=true` only when moving to paid starter plans
- Offer Pro upgrade if >100 voice min/month

## Contacts

- Product: info@justbookme.ca
- Production: https://justbookme.ca
- Repo: `brandonlacoste9-tech/AI-Assistant`