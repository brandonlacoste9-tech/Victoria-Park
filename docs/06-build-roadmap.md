# RendezVous AI — Build Roadmap

## Phase 0 — Validation (Week 1–2)

- [ ] Landing page (FR/EN) on a Supabase-backed waitlist
- [ ] 15 customer interviews (5 salons, 5 clinics, 5 contractors)
- [ ] 3 signed LOIs from businesses willing to trial once V1 ships

**Exit gate:** 100 waitlist signups OR 5 LOIs, whichever first.

---

## Phase 1 — Concierge MVP (Week 3–6)

- [ ] Operator dashboard (Next.js + Supabase)
- [ ] Twilio number provisioned; call forwarding on no-answer/busy → your phone
- [ ] Manual booking entry + Google Calendar two-way sync
- [ ] SMS templates (Twilio) with merge fields
- [ ] Web embed lead-capture form
- [ ] Stripe checkout + 3 tiers + 14-day trial

**Why concierge first:** Proves the workflow without betting on AI quality. You're the AI.

**Exit gate:** 1 design partner using the dashboard daily for 2 weeks.

---

## Phase 2 — AI Voice Layer (Week 7–10)

- [ ] Voice agent (Retell / Vapi / Bland — pick after FR bake-off in week 6)
- [ ] Bilingual language detection, transfer-to-human fallback
- [ ] Post-call summary → `conversations.transcript`
- [ ] Auto-attribution of recovered revenue (bookings within 48h of missed-call lead)

**Exit gate:** Voice agent handles 80%+ of inbound calls without operator intervention; CSAT ≥ 4/5.

---

## Phase 3 — Retention + Collaboration (Week 11–14)

- [ ] Staff assignment in booking flow
- [ ] Daily recovery summary email + SMS
- [ ] Rebooking nudge campaign (configurable cadence)
- [ ] Basic analytics: recovered revenue, no-show rate, lead→book conversion

**Exit gate:** 5 paying customers, ≥60% weekly active.

---

## Phase 4 — First 10 Customers + Expand (Month 4–6)

- [ ] Outbound sales: 50 cold emails + 30 in-person visits
- [ ] Iterate on top 3 complaints per customer
- [ ] Public booking page builder (V2)
- [ ] Email automation (V2)

**Exit gate:** 10 paying customers, $1.5k MRR, <5% monthly churn.

---

## Phase 5 — Scale (Month 7+)

- [ ] Native mobile app for staff schedule view
- [ ] Zapier + native integrations (Square, QuickBooks, clinic EMRs)
- [ ] Multi-language beyond FR/EN (ES for Montréal)
- [ ] Reseller / white-label program