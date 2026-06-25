# RendezVous AI — MVP Feature Spec (V1)

## In scope

| # | Feature | Acceptance criteria |
|---|---------|---------------------|
| 1 | Bilingual AI voice agent | Answers inbound calls in FR or EN; detects language within 3s; books or routes to voicemail |
| 2 | Web lead capture form | Embeddable widget; drops lead into pipeline; triggers SMS within 60s |
| 3 | Calendar sync | Google Calendar + iCal feed; two-way sync; conflict detection |
| 4 | Booking flow | Customer picks service → staff → slot → confirmation SMS; supports reschedule + cancel |
| 5 | SMS automation | Confirmation, 24h reminder, 2h reminder, no-show follow-up, rebooking nudge — all editable templates |
| 6 | Lead pipeline | New → Contacted → Booked → Lost; manual + auto transitions |
| 7 | Operator dashboard | Daily view: bookings today, missed calls recovered, no-shows, revenue recovered |
| 8 | Stripe billing | Three tiers, 14-day trial, usage cap with overage |

## Explicitly out of scope (V1)

- Native mobile app (web-responsive only)
- Multi-location for Starter tier
- Payment processing at booking time
- Email automation (SMS only)
- Custom voice cloning
- Public booking page builder (v1 uses a single shared page template)

## V2 candidates (post-10 customers)

- Public booking pages
- Payment at booking
- Email drip
- Staff mobile app
- Native iOS/Android
- Zapier/native integrations