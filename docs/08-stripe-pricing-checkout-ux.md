# RendezVous AI — Pricing Page UX + Stripe Checkout Flow

**Version:** 0.1  
**Currency:** CAD  
**Tax:** Stripe Tax for PST/QST (Quebec) — enable when first paying customer onboards

---

## Page structure

```
/pricing
├── Hero strip          "Simple pricing. No setup fees."
├── Billing toggle      Monthly | Annual (save 17%)
├── Plan cards (3)      Starter | Pro ★ | Premium
├── Feature matrix      Collapsible on mobile
├── FAQ (billing)       Trial, cancel, taxes, invoices
├── CTA strip           "Start free trial" → /signup?plan=pro
└── Footer              Loi 25 link, contact
```

**Navigation:** Landing hero CTA → `/signup` (no card). Pricing page CTA → `/signup?plan={tier}`.

---

## Plan card UX

### Layout (desktop: 3 columns; mobile: Pro first, then Starter, Premium)

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    Starter      │  │   Pro ★ Best    │  │    Premium      │
│    $49/mo       │  │   $149/mo       │  │   $349/mo       │
│                 │  │  Most popular   │  │                 │
│ 1 staff         │  │ Up to 5 staff   │  │ Unlimited staff │
│ 100 bookings    │  │ Unlimited       │  │ Unlimited       │
│ 200 SMS         │  │ 1,000 SMS       │  │ 5,000 SMS       │
│ 100 voice min   │  │ 500 voice min   │  │ 2,500 voice min │
│                 │  │                 │  │                 │
│ [Start trial]   │  │ [Start trial]   │  │ [Start trial]   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Pro card emphasis

- `border-primary` + subtle glow
- Badge: **Most popular** / **Le plus populaire**
- Default pre-selected on `/signup` when no `?plan=` param

### Annual toggle behavior

| State | Display |
|-------|---------|
| Monthly | `$49/mo` |
| Annual | `$41/mo` + subtext *"Billed $490/year"* |

Show savings pill: **Save 17%** / **Économisez 17 %**

---

## Copy (bilingual snippets)

### Page title

| EN | FR |
|----|-----|
| Pricing — RendezVous AI | Tarification — RendezVous AI |

### Hero

| EN | FR |
|----|-----|
| Simple pricing for Quebec service businesses. 14-day free trial. Cancel anytime. | Tarification simple pour les entreprises de services au Québec. Essai gratuit de 14 jours. Annulation en tout temps. |

### Plan CTAs

| EN | FR |
|----|-----|
| Start free trial | Commencer l'essai gratuit |
| Talk to us | Nous contacter |

### Trial footnote (below cards)

| EN | FR |
|----|-----|
| No credit card required to start. Add payment anytime during your trial. | Aucune carte de crédit requise pour commencer. Ajoutez un paiement en tout temps pendant l'essai. |

### Billing FAQ

| Question (EN) | Answer (EN) |
|---------------|-------------|
| Do I need a card for the trial? | No. Sign up with email, use Pro features for 14 days. Add a card before day 14 to continue. |
| Can I switch plans? | Yes — upgrade or downgrade anytime from Settings → Billing. Prorated automatically. |
| Are taxes included? | Prices exclude PST/QST. Quebec taxes calculated at checkout via Stripe Tax. |
| What happens when I hit Starter limits? | Overage billed automatically, or upgrade to Pro for unlimited bookings. |
| Can I cancel? | Yes — cancel anytime. Access continues until period end. |

---

## Signup flow (no card — Phase 0/1 default)

```
/pricing → click "Start trial"
    ↓
/signup?plan=pro&lang=fr
    ↓
Step 1: Account        email + password (Supabase Auth magic link OK)
Step 2: Business       name, vertical, city, phone, default_language
Step 3: Confirm        "Your 14-day Pro trial starts now"
    ↓
/onboarding            services, hours, calendar (separate wizard)
    ↓
/dashboard
```

**Database writes on signup:**

```sql
INSERT INTO businesses (name, plan, trial_ends_at, default_language)
  VALUES ($1, 'pro', now() + interval '14 days', $2);

INSERT INTO users (id, business_id, role, full_name, email)
  VALUES (auth.uid(), $business_id, 'owner', $name, $email);

INSERT INTO subscriptions (business_id, status, plan)
  VALUES ($business_id, 'trialing', 'pro');
```

No Stripe customer created yet — defer until card add or day 12 nudge.

---

## Checkout flow (card added)

Two entry points:

1. **Voluntary:** Settings → Billing → "Add payment method"
2. **Nudge:** Day 12 email/SMS → `/billing/checkout?plan=pro`

```
/billing/checkout?plan=pro&interval=month
    ↓
Server Action: createCheckoutSession()
    ↓
Stripe Checkout (hosted)
    ↓
success → /billing/success?session_id={CHECKOUT_SESSION_ID}
cancel  → /billing?canceled=1
```

### Stripe Checkout session config

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  customer: stripeCustomerId,           // create on first checkout
  customer_email: !stripeCustomerId ? email : undefined,
  line_items: [{ price: priceId, quantity: 1 }],
  subscription_data: {
    trial_period_days: remainingTrialDays,  // 0 if trial expired
    metadata: { business_id, plan: 'pro' },
  },
  automatic_tax: { enabled: true },       // PST/QST
  billing_address_collection: 'required',
  customer_update: { address: 'auto' },
  tax_id_collection: { enabled: true },     // NEQ / GST-HST numbers
  locale: lang === 'fr' ? 'fr-CA' : 'en',
  success_url: `${APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${APP_URL}/billing?canceled=1`,
  metadata: { business_id, plan, interval },
  allow_promotion_codes: true,              // founder codes
});
```

**Trial rule:** If `trial_ends_at > now()`, pass `trial_period_days` = days remaining. Stripe won't charge until trial ends.

**Post-trial signup:** If trial expired and no card, `trial_period_days: 0` — immediate charge.

---

## Stripe Dashboard setup

### Product

```
Product name: RendezVous AI Subscription
Statement descriptor: RENDEZVOUS AI
```

### Prices (create in Stripe Dashboard or CLI)

| Price ID (env var) | Amount | Interval | Tier |
|--------------------|--------|----------|------|
| `STRIPE_PRICE_STARTER_MONTHLY` | $49.00 CAD | month | starter |
| `STRIPE_PRICE_STARTER_ANNUAL` | $490.00 CAD | year | starter |
| `STRIPE_PRICE_PRO_MONTHLY` | $149.00 CAD | month | pro |
| `STRIPE_PRICE_PRO_ANNUAL` | $1,490.00 CAD | year | pro |
| `STRIPE_PRICE_PREMIUM_MONTHLY` | $349.00 CAD | month | premium |
| `STRIPE_PRICE_PREMIUM_ANNUAL` | $3,490.00 CAD | year | premium |

### Coupons

| Coupon | Discount | Use |
|--------|----------|-----|
| `FOUNDER30` | 30% forever | First 10 LOI signers |
| `ANNUAL17` | — | Use annual price instead |

### Customer portal

Enable Stripe Customer Portal:

- Cancel subscription
- Update payment method
- View invoices (with PST/QST line items)
- Switch plan (Starter ↔ Pro ↔ Premium)

Portal return URL: `/settings/billing`

---

## Webhook handler

**Route:** `POST /api/webhooks/stripe`  
**Pattern:** Port from Cyberhound `stripe-webhook/route.ts` — raw body + signature verify.

### Events to handle

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Link `stripe_customer_id` to `businesses`; upsert `subscriptions` |
| `customer.subscription.created` | `subscriptions.status = 'trialing' \| 'active'` |
| `customer.subscription.updated` | Sync `plan`, `current_period_end`; handle upgrade/downgrade |
| `customer.subscription.deleted` | `status = 'canceled'`; `businesses.plan` → read-only grace 7 days |
| `invoice.payment_succeeded` | Log payment; reset monthly `usage_counters` on new period |
| `invoice.payment_failed` | `status = 'past_due'`; email owner; dashboard banner |
| `customer.subscription.trial_will_end` | 3-day warning email (Stripe native, day 11) |

### Handler pseudocode

```typescript
case 'checkout.session.completed': {
  const session = event.data.object as Stripe.Checkout.Session;
  const businessId = session.metadata?.business_id;
  const plan = session.metadata?.plan ?? 'pro';

  await db.from('businesses').update({
    stripe_customer_id: session.customer as string,
    plan,
  }).eq('id', businessId);

  await db.from('subscriptions').upsert({
    business_id: businessId,
    stripe_subscription_id: session.subscription as string,
    status: 'trialing',
    plan,
  });
  break;
}

case 'customer.subscription.updated': {
  const sub = event.data.object as Stripe.Subscription;
  const businessId = sub.metadata.business_id;
  const priceId = sub.items.data[0].price.id;
  const plan = priceIdToPlan(priceId);

  await db.from('subscriptions').update({
    status: sub.status,
    plan,
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
  }).eq('stripe_subscription_id', sub.id);

  await db.from('businesses').update({ plan }).eq('id', businessId);
  break;
}

case 'customer.subscription.deleted': {
  const sub = event.data.object as Stripe.Subscription;
  await db.from('subscriptions').update({ status: 'canceled' }).eq('stripe_subscription_id', sub.id);
  // Soft-lock: AI voice off, dashboard read-only after 7 days
  break;
}
```

---

## Billing settings page (`/settings/billing`)

### States

| State | UI |
|-------|-----|
| Trialing, no card | Amber banner: *"X days left in trial. Add payment to keep your data."* + [Add card] |
| Trialing, card on file | Green: *"Trial ends {date}. You'll be charged {amount} + tax."* |
| Active | Plan name, next invoice date, [Manage billing] → Stripe Portal |
| Past due | Red banner + [Update payment] |
| Canceled | Gray: *"Subscription ends {date}"* + [Resubscribe] |

### Usage meter (Starter only)

```
Bookings   ████████░░  82 / 100
SMS        ██████░░░░  124 / 200
Voice      ███░░░░░░░  34 / 100 min

Estimated overage this period: $12.40 CAD
[Upgrade to Pro — unlimited bookings]
```

---

## Trial lifecycle emails

| Day | Channel | Template key | Content |
|-----|---------|--------------|---------|
| 0 | Email | `trial_welcome` | Setup checklist + booking link |
| 3 | Email | `trial_value` | "You have X leads captured" (if any) |
| 7 | Email | `trial_midpoint` | Feature highlight: SMS reminders |
| 12 | Email + SMS | `trial_ending` | Add card CTA → `/billing/checkout` |
| 14 | Email | `trial_expired` | Data retained 30 days; export offer |
| 14+ | — | — | Dashboard read-only; voice/SMS paused |

---

## API routes (Next.js)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/billing/checkout` | POST | Create Checkout session |
| `/api/billing/portal` | POST | Create Customer Portal session |
| `/api/webhooks/stripe` | POST | Stripe events |
| `/api/billing/usage` | GET | Current period usage vs limits |

### `POST /api/billing/checkout`

```typescript
// Request
{ plan: 'starter' | 'pro' | 'premium', interval: 'month' | 'year', lang: 'fr' | 'en' }

// Response
{ url: string }  // redirect to Stripe Checkout
```

### Auth guard

All billing routes require authenticated `owner` or `manager` role. Staff cannot access.

---

## Environment variables

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_STARTER_ANNUAL=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...
STRIPE_PRICE_PREMIUM_MONTHLY=price_...
STRIPE_PRICE_PREMIUM_ANNUAL=price_...
```

---

## Quebec tax setup (Stripe Tax)

1. Enable Stripe Tax in Dashboard
2. Register business address (Quebec)
3. Set `automatic_tax: { enabled: true }` on Checkout + subscriptions
4. Invoices show PST (9.975%) + QST (9.975%) line items for QC customers
5. Collect NEQ via `tax_id_collection` for B2B salon owners who request invoices

**Customer-facing note on pricing page:**

> Prices shown exclude applicable taxes. Quebec PST/QST calculated at checkout.

> Les prix affichés n'incluent pas les taxes applicables. TPS/TVQ calculées à la caisse.

---

## Starter overage billing (phase 1.5)

Use Stripe metered billing OR internal invoice at period end:

**Option A (simpler v1):** Track overage in `usage_counters`; on `invoice.payment_succeeded`, append invoice item via API if overage > 0.

**Option B (scale):** Stripe Billing Meters for `sms_count`, `bookings_count`, `voice_minutes`.

```typescript
// End-of-period overage (Option A)
if (plan === 'starter' && usage.bookings_count > 100) {
  const extra = usage.bookings_count - 100;
  await stripe.invoiceItems.create({
    customer: stripeCustomerId,
    amount: extra * 50,  // $0.50 = 50 cents
    currency: 'cad',
    description: `Extra bookings (${extra})`,
  });
}
```

---

## Implementation checklist

### Week 1 (with landing)

- [ ] Create Stripe products + 6 prices (test mode)
- [ ] Build `/pricing` page with toggle + 3 cards
- [ ] Build `/signup` flow (no Stripe yet)
- [ ] Set `trial_ends_at` on business create

### Week 3 (with concierge MVP)

- [ ] `POST /api/billing/checkout`
- [ ] Stripe webhook → `subscriptions` sync
- [ ] `/settings/billing` page + portal link
- [ ] Enable Stripe Tax (test mode with QC address)
- [ ] Day 12 trial nudge (Resend email + Twilio SMS)

### Before first live customer

- [ ] Switch to live mode keys
- [ ] Register webhook endpoint on live Stripe
- [ ] Test full flow: signup → trial → checkout → invoice with PST/QST
- [ ] FOUNDER30 coupon tested

---

## Component tree (React)

```
app/
├── (marketing)/
│   └── pricing/
│       └── page.tsx              # PricingPage
├── (auth)/
│   └── signup/
│       └── page.tsx              # SignupWizard
├── (dashboard)/
│   └── settings/
│       └── billing/
│           └── page.tsx          # BillingSettings
└── api/
    ├── billing/
    │   ├── checkout/route.ts
    │   └── portal/route.ts
    └── webhooks/
        └── stripe/route.ts

components/billing/
├── PlanCard.tsx
├── BillingToggle.tsx
├── FeatureMatrix.tsx
├── UsageMeter.tsx
├── TrialBanner.tsx
└── PricingFAQ.tsx
```

---

## Success metrics

| Metric | Target |
|--------|--------|
| Pricing → signup click-through | >8% |
| Signup completion | >60% |
| Trial → paid (day 30) | >25% |
| Card added before day 14 | >40% of trials |
| Checkout abandonment | <20% |