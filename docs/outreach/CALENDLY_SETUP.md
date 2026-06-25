# Calendly setup — demo bookings

Replace mailto demo links with a real 15-minute booking page.

## Steps (5 min)

1. Create free account at [calendly.com](https://calendly.com)
2. **Event type:** « Démo RendezVous AI » — 15 min, Google Meet or phone
3. Copy event link (e.g. `https://calendly.com/yourname/demo-15min`)
4. Add to local env:

```bash
# web/.env.local
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/yourname/demo-15min
```

5. Push to Netlify:

```powershell
cd C:\Users\north\Documents\rendezvous-ai\AI-Assistant
node scripts/push-netlify-env-cli.mjs
# or: npx netlify env:set NEXT_PUBLIC_CALENDLY_URL "https://..." --context production --force
```

6. Redeploy — header « Réserver une démo » and hero secondary CTA open Calendly in a new tab.

## Suggested availability

- Tue–Thu 10h–16h EST (salon owners often free mid-morning)
- Buffer 15 min between calls
- Confirmation email FR with link to waitlist

## Outreach

Update `cold-emails-ready.md` demo line:

```
Réserver une démo : https://calendly.com/yourname/demo-15min
```