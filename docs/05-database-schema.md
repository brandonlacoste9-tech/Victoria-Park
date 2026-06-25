# RendezVous AI — Database Schema Outline

**Platform:** Supabase / Postgres  
**Security:** RLS on all `business_id`-scoped tables

---

## Entity model

```
businesses
  ├── users (app operators)
  ├── services
  ├── staff
  ├── customers (end clients)
  ├── appointments
  ├── conversations
  │     └── messages
  ├── leads
  │     └── lead_events
  ├── subscriptions
  └── usage_counters
```

---

## Schema

```sql
-- Tenancy
businesses (
  id uuid pk,
  name text,
  timezone text default 'America/Montreal',
  default_language text check in ('fr','en'),
  phone_number text,
  stripe_customer_id text,
  plan text check in ('starter','pro','premium'),
  trial_ends_at timestamptz,
  created_at timestamptz default now()
)

users (
  id uuid pk references auth.users(id),
  business_id uuid fk businesses,
  role text check in ('owner','manager','staff'),
  full_name text,
  phone text,
  email text,
  preferred_language text,
  created_at timestamptz default now()
)

-- Catalog
services (
  id uuid pk,
  business_id uuid fk,
  name text,
  duration_minutes int,
  price_cents int,
  active boolean default true
)

staff (
  id uuid pk,
  business_id uuid fk,
  user_id uuid fk users null,  -- null if no login
  display_name text,
  services_offered uuid[] fk services,
  working_hours jsonb  -- {mon:[09:00-17:00], ...}
)

-- Customers (end clients of the business, not app users)
customers (
  id uuid pk,
  business_id uuid fk,
  full_name text,
  phone text,
  email text null,
  preferred_language text,
  tags text[],
  created_at timestamptz default now()
)

-- Core transactional
appointments (
  id uuid pk,
  business_id uuid fk,
  customer_id uuid fk customers,
  service_id uuid fk services,
  staff_id uuid fk staff,
  starts_at timestamptz,
  ends_at timestamptz,
  status text check in ('booked','confirmed','cancelled','no_show','completed'),
  source text check in ('phone_ai','web_form','manual','reschedule'),
  notes text,
  created_at timestamptz default now()
)

-- AI + messaging
conversations (
  id uuid pk,
  business_id uuid fk,
  customer_id uuid fk null,  -- may be unknown initially
  channel text check in ('voice','sms','web'),
  started_at timestamptz,
  ended_at timestamptz null,
  outcome text check in ('booked','lead_captured','transferred','dropped','other'),
  transcript text,
  recovered_revenue_cents int null  -- attribution metric
)

messages (
  id bigserial pk,
  conversation_id uuid fk conversations,
  direction text check in ('in','out'),
  body text,
  sent_at timestamptz default now(),
  twilio_sid text null
)

leads (
  id uuid pk,
  business_id uuid fk,
  customer_id uuid fk null,
  source text,  -- 'web_form','missed_call','manual'
  pipeline_stage text check in ('new','contacted','booked','lost'),
  captured_at timestamptz default now(),
  notes text
)

lead_events (
  id bigserial pk,
  lead_id uuid fk leads,
  event_type text,  -- 'sms_sent','email_sent','status_changed','note_added'
  payload jsonb,
  occurred_at timestamptz default now()
)

-- Billing
subscriptions (
  id uuid pk,
  business_id uuid fk unique,
  stripe_subscription_id text,
  status text,  -- 'active','past_due','canceled','trialing'
  current_period_end timestamptz,
  plan text
)

usage_counters (
  business_id uuid fk,
  period_start date,
  bookings_count int default 0,
  sms_count int default 0,
  voice_minutes numeric default 0,
  primary key (business_id, period_start)
)
```

---

## RLS notes

- Every table with `business_id` gets: `auth.jwt() ->> 'business_id' = business_id::text`
- Owner/manager roles: read all business data
- Staff role: scoped via `staff.user_id = auth.uid()`
- Customers/leads: business_id-scoped read only

## Supabase add-ons

| Add-on | Purpose |
|--------|---------|
| `pg_cron` | Daily `usage_counters` rollup |
| Edge Functions | Twilio webhooks (incoming SMS + voice) |
| Storage bucket | Call recordings (with retention policy) |

## Key indexes (recommended)

```sql
CREATE INDEX idx_appointments_business_day ON appointments (business_id, starts_at);
CREATE UNIQUE INDEX idx_customers_phone ON customers (business_id, phone);
CREATE INDEX idx_leads_stage ON leads (business_id, pipeline_stage);
CREATE INDEX idx_conversations_business ON conversations (business_id, started_at DESC);
CREATE INDEX idx_messages_conversation ON messages (conversation_id, sent_at);
```