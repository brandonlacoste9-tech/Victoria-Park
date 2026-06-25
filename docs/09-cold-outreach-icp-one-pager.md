# RendezVous AI — ICP One-Pager + Cold Outreach Scripts

**Goal:** 15 interviews + 5 LOIs in Phase 0; 50 emails + 30 visits in Phase 4  
**Primary vertical:** Salons & esthetics (Montréal + Québec City)  
**Secondary:** Dental clinics, physio, RBQ contractors

---

## ICP one-pager

### Who we sell to

| Field | Definition |
|-------|------------|
| **Business type** | Independent salon, esthetics studio, barbershop, nail bar |
| **Location** | Greater Montréal, Laval, Québec City, Gatineau |
| **Size** | 1–8 staff, 1 location |
| **Revenue** | $200K–$800K CAD/year |
| **Decision maker** | Owner-operator (often works the floor) |
| **Tech stack** | Google Calendar or paper; maybe Fresha/Booksy; no AI intake |
| **Language** | Bilingual clientele; owner usually speaks FR + EN |

### Pain we solve (ranked)

1. Missed calls during appointments (25–40% of inbound)
2. No-shows without automated reminders
3. Instagram DM / text leads that never get followed up
4. Double-booking across channels
5. Francophone clients who get English-only voicemail

### Qualification checklist (BANT-lite)

| Signal | Qualified? |
|--------|------------|
| ≥3 staff | ✅ Strong |
| Owner still answers the phone | ✅ Strong |
| Uses Google Calendar | ✅ |
| Already pays for Booksy/Fresha | ✅ (layer on top) |
| "We don't miss calls" | ❌ Disqualify |
| Wants payment processing at booking | ⚠️ V2 — note for roadmap |
| Multi-location franchise | ❌ Premium only — defer |

### ROI pitch (30 seconds)

> A missed haircut is $80–150. If you miss 5 calls a week, that's $1,600/month gone. RendezVous AI answers in French and English, books the appointment, and sends SMS reminders. At $149/month, one recovered booking per week pays for it.

### Competitor displacement

| They use | Our line |
|----------|----------|
| Voicemail | "Voicemail doesn't book. We do." |
| Receptionist part-time | "We're 24/7 for $149, not $2,500/month." |
| Booksy/Fresha only | "We recover the calls Booksy never sees." |
| Nothing | "Your competitors in Mile End already automate this." |

---

## Target list building

### Sources (week 1)

| Source | Target count | How |
|--------|--------------|-----|
| Google Maps | 100 salons | "salon de coiffure" + arrondissement |
| Instagram | 50 | `#montrealsalon` `#salonquebec` |
| Fresha/Booksy listings | 30 | Businesses with online booking but no phone AI |
| Personal network | 10 | Warm intros |
| Salon supplier reps | 5 | Partner referrals |

### CRM fields (spreadsheet or Supabase `outreach_prospects`)

```
business_name, contact_name, phone, email, city, vertical,
staff_count, source, status, last_contact, notes, loi_signed
```

**Status values:** `prospect` → `contacted` → `interview_scheduled` → `loi` → `trial` → `paying` → `lost`

---

## Cold email sequences

### Email 1 — Problem hook (day 0)

**Subject (FR):** `{business_name} — vos appels manqués le vendredi?`  
**Subject (EN):** `{business_name} — how many calls did you miss on Friday?`

```
Bonjour {first_name},

Je passe devant beaucoup de salons à {neighbourhood} et une chose revient toujours:
quand c'est plein le samedi, le téléphone sonne dans le vide.

RendezVous AI répond en français et en anglais, prend le rendez-vous,
et envoie les rappels SMS — pendant que vous êtes avec une cliente.

On cherche 10 salons au Québec pour un essai gratuit de 14 jours (tarif fondateur à vie).

15 minutes pour voir si ça fit?

{your_name}
RendezVous AI · rendezvousai.ca
```

**EN version:**

```
Hi {first_name},

I talk to a lot of salon owners in {neighbourhood}, and the same thing keeps coming up:
when you're fully booked on Saturday, the phone rings into the void.

RendezVous AI answers in French and English, books the appointment,
and sends SMS reminders — while you're with a client.

We're looking for 10 Quebec salons for a free 14-day trial (founder pricing locked for life).

Worth 15 minutes to see if it fits?

{your_name}
RendezVous AI · rendezvousai.ca
```

---

### Email 2 — ROI follow-up (day 4, if no reply)

**Subject (FR):** `1 600 $/mois en appels manqués?`  
**Subject (EN):** `$1,600/month in missed calls?`

```
{first_name},

Quick math: 5 appels manqués/semaine × 80 $ = 1 600 $/mois.

RendezVous AI coûte 149 $/mois. Un seul rendez-vous récupéré par semaine paie l'abonnement.

Voici une démo de 2 minutes: {demo_link}

Si c'est pas pour vous, pas de souci — je vous laisse tranquille.

{your_name}
```

---

### Email 3 — Breakup (day 10)

**Subject (FR):** `Dernier message — liste d'attente salon`  
**Subject (EN):** `Last note — salon waitlist closing`

```
{first_name},

On ferme la liste d'attente fondateur cette semaine (10 places, -30 % à vie).

Si jamais les appels manqués deviennent un problème, voici le lien:
{waitlist_link}

Bonne continuation avec {business_name}!

{your_name}
```

---

## In-person / walk-in script

### Opening (30 sec)

**FR:**
> "Bonjour! Je m'appelle {name}. Je développe un outil pour les salons ici à Montréal — un réceptionniste IA qui répond quand vous êtes en coupe. Vous, c'est quoi votre plus gros casse-tête avec le téléphone?"

**EN:**
> "Hi! I'm {name}. I'm building an AI receptionist for salons in Montreal — it answers when you're mid-appointment. What's your biggest headache with the phone?"

### Discovery questions

1. "Combien d'appels vous manquez par jour, une estimation?" / "How many calls do you think you miss per day?"
2. "C'est quoi votre processus pour les rappels?" / "How do you handle reminders?"
3. "Vos clientes sont bilingues?" / "Are your clients bilingual?"
4. "Vous utilisez quoi pour l'agenda — papier, Google, Booksy?" / "What do you use for scheduling?"
5. "Si on récupérait 3 rendez-vous par semaine, ça vaudrait combien pour vous?" / "If we recovered 3 bookings a week, what would that be worth?"

### Close — LOI ask

**FR:**
> "On cherche 3 salons pilotes pour les 6 prochaines semaines — essai gratuit, et je configure tout moi-même. En échange, on a besoin de vos commentaires honnêtes. Ça vous intéresse? Je peux vous laisser mon numéro."

**LOI = verbal + email confirmation:**

```
Objet: Accord pilote RendezVous AI — {business_name}

Merci pour la conversation aujourd'hui!

Comme convenu:
- Essai gratuit de 14 jours (forfait Pro)
- Configuration gratuite par notre équipe
- Tarif fondateur -30 % à vie si vous continuez après l'essai
- En échange: 30 min de rétroaction à la fin de la 2e semaine

Pour confirmer, répondez "CONFIRMÉ" à ce courriel.

{your_name}
```

---

## Cold call script (phone)

### Gatekeeper / owner

**FR:**
> "Bonjour, c'est {name} de RendezVous AI. Je cherche {owner_name} — c'est pour un projet local qui aide les salons à ne plus manquer d'appels. Elle/il est disponible 2 minutes?"

### Voicemail

**FR (30 sec):**
> "Bonjour, c'est {name}, RendezVous AI. On aide les salons au Québec à répondre aux appels manqués avec un réceptionniste IA bilingue. Essai gratuit 14 jours. Mon numéro: {phone}. rendezvousai.ca. Merci!"

---

## Interview guide (15 customer discovery calls)

**Duration:** 20–25 min  
**Incentive:** Founder pricing code + priority onboarding

### Structure

| Segment | Time | Questions |
|---------|------|-----------|
| Context | 3 min | Business name, staff, neighbourhood, booking tools |
| Pain | 8 min | Missed calls, no-shows, bilingual, follow-up, worst day last week |
| Current solutions | 5 min | What tried, what failed, monthly spend on tools |
| Reaction | 5 min | Show 2-min demo or describe flow; gauge willingness to pay |
| Close | 2 min | LOI ask or waitlist signup |

### Key questions

1. "Racontez-moi la dernière fois que vous avez perdu un client à cause d'un appel manqué."
2. "Combien de no-shows par semaine?"
3. "Vos rappels, c'est manuel ou automatique?"
4. "À 149 $/mois, qu'est-ce qui vous ferait dire oui? Qu'est-ce qui vous ferait dire non?"
5. "Qui d'autre décide avec vous?"

### Scoring (post-call)

| Score | Signal |
|-------|--------|
| 🔥 Hot | Missed calls daily + wants LOI + uses Google Calendar |
| 🟡 Warm | Pain acknowledged, wants to "think about it" |
| 🔵 Cold | No pain, happy with current setup |

**Target mix:** 5 salons, 5 clinics, 5 contractors → at least 3 🔥 per vertical.

---

## LOI template (1-page)

```
LETTRE D'INTENTION — PILOTE RENDEZVOUS AI

Date: ___________
Entreprise: ___________
Contact: ___________
Adresse: ___________

{Business_name} exprime son intérêt à participer au programme pilote
RendezVous AI pour une période de 14 jours à compter de la date d'activation.

Conditions:
1. Essai gratuit — forfait Pro, sans carte de crédit requise
2. Configuration initiale assurée par RendezVous AI (≈30 min)
3. Tarif fondateur: 30 % de rabais à vie sur tout forfait payant
4. En contrepartie: participation à un appel de rétroaction (30 min)
   et autorisation d'utiliser le nom de l'entreprise comme référence
   (sous réserve d'approbation)

RendezVous AI s'engage à:
- Protéger les renseignements personnels conformément à la Loi 25
- Fournir un support par courriel pendant les heures d'affaires (EST)
- Ne pas facturer sans consentement explicite à la fin de l'essai

Signature: _________________________  Date: _________
Nom: _________________________
Titre: _________________________
```

---

## Outreach cadence (Phase 0 — 2 weeks)

| Day | Activity | Volume |
|-----|----------|--------|
| Mon | Build target list (Maps + IG) | 100 prospects |
| Tue | Email 1 batch | 30 emails |
| Wed | Walk-in visits (Mile End / Plateau / QC) | 10 visits |
| Thu | Follow-up calls to email openers | 10 calls |
| Fri | Email 1 batch 2 | 30 emails |
| Mon W2 | Interviews | 5 calls |
| Tue W2 | Email 2 to non-responders | 30 emails |
| Wed W2 | Walk-in visits (Laval / South Shore) | 10 visits |
| Thu W2 | LOI push to 🔥 prospects | 5 conversations |
| Fri W2 | Email 3 breakup | 30 emails |

**Exit gate:** 100 waitlist signups OR 5 LOIs.

---

## Tracking dashboard (simple)

| Metric | W1 target | W2 target |
|--------|-----------|-----------|
| Emails sent | 60 | 60 |
| Open rate | >40% | >40% |
| Replies | 6 | 6 |
| Interviews booked | 5 | 10 |
| LOIs signed | 1 | 3–5 |
| Walk-in conversations | 10 | 10 |

---

## Objection handling

| Objection (FR) | Response |
|----------------|----------|
| "C'est trop cher" | "À 149 $, un seul rendez-vous récupéré par semaine couvre le coût. Combien vaut une coupe chez vous?" |
| "Mes clientes veulent un humain" | "L'IA transfère immédiatement si la cliente le demande. La plupart veulent juste réserver vite." |
| "J'ai déjà Booksy" | "Parfait — on s'ajoute par-dessus. Booksy ne décroche pas quand vous êtes en service." |
| "L'IA en français, c'est pas bon" | "Appelez notre ligne démo: {demo_number}. Jugez par vous-même." |
| "Pas le temps de configurer" | "On configure tout pour vous en 30 minutes. Vous n'avez qu'à nous donner vos services et horaires." |
| "Mes données" | "Hébergées au Canada, conformes à la Loi 25. On peut vous envoyer notre résumé de confidentialité." |

---

## Partner outreach (salon suppliers)

**Target:** Distributors, esthetics product reps, salon furniture sellers

**FR email:**
> "Bonjour, je développe RendezVous AI — un réceptionniste IA bilingue pour salons au Québec. Est-ce que vous auriez 3 clients qui se plaignent souvent des appels manqués? Je leur offre un essai fondateur et une commission de parrainage si ça vous intéresse."

**Referral offer (post-V1):** $50 CAD credit per converted salon.

---

## Files to create in repo (optional)

```
docs/outreach/
├── prospect-list-template.csv
├── loi-template.pdf (from markdown above)
└── interview-notes-template.md
```

---

## Next actions (this week)

1. [ ] Build prospect list: 50 salons Montréal + 25 Québec City
2. [ ] Send Email 1 to first 30
3. [ ] Walk 10 salons in one neighbourhood (same day)
4. [ ] Book 5 discovery interviews
5. [ ] Get 1 LOI signed before landing page ships