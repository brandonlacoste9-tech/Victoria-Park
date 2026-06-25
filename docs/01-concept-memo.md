# RendezVous AI — App Concept Memo

**Working name:** RendezVous AI  
**One-liner:** Never miss a booking, lead, or follow-up again — in French or English.

---

## Problem

Quebec service businesses (salons, dental clinics, physios, RBQ contractors, garages, esthetic clinics) miss **25–40% of inbound calls** during work hours. Each missed call is a lost **$80–$400** job. Most still rely on voicemail + a paper agenda + manual SMS follow-ups.

Existing tools (Calendly, Square Appointments, Booksy) are English-first, US-centric, and weak on follow-up automation.

---

## Solution

A bilingual AI receptionist + follow-up agent that:

- Answers missed calls and web leads
- Books into the business's existing calendar
- Runs SMS confirmations, reminders, and rebooking nudges automatically
- Surfaces recovered revenue in an operator dashboard

---

## Wedge

- Quebec-first bilingual product
- PST/QST-aware invoicing
- French-language voice quality that doesn't sound like a 2018 IVR
- Pricing in CAD for local SMB budgets

---

## Why now

- Voice LLMs hit usable quality in late 2024; cost dropped ~70% by 2026
- SMS deliverability and Twilio/Stripe rails are stable
- Quebec SMBs remain under-tooled relative to Ontario

---

## Business model

- SaaS subscription: **$49–$349 CAD/mo**
- 14-day trial, usage overage on Starter
- Target: **10 paying customers in Month 4** → **100 by Month 9**

---

## Defensibility

- Quebec-specific training data
- Bilingual voice persona library
- Integrations with Quebec-relevant tools (Square for retail, local clinic EMRs)
- Operational data flywheel from recovered-revenue attribution

---

## ICP (v1 focus)

| Vertical | Why first |
|----------|-----------|
| Salons & esthetics | High call volume, manual scheduling, bilingual clientele |
| Dental / physio clinics | High slot value, no-show pain |
| RBQ contractors | Missed calls on job sites |

**Anti-ICP v1:** Multi-location franchises, enterprise health systems.

---

## Open decisions

1. **Voice provider** — bake-off Vapi vs Retell vs Bland on FR quality + cost (week 6)
2. **Domain** — confirm `rendezvous.ai` availability; have 2 backups ready
3. **Founder availability** — Phase 1 concierge requires ~2 hrs/day customer-facing for 6 weeks
4. **Law 25** — self-attest vs compliance consultant ($2–4k one-time) before first paying customer