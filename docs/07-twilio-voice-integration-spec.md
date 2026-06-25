# RendezVous AI — Twilio + Voice Provider Integration Spec

**Version:** 0.1  
**Covers:** Phase 1 (concierge) + Phase 2 (AI voice)  
**Quebec flags:** FR/EN bilingual, CASL SMS consent, Law 25 call recording retention

---

## Architecture overview

```
Inbound call (customer)
  → Business Twilio number OR forwarded from existing line
  → Twilio Voice webhook (Edge Function)
  → [Phase 1] Forward to founder phone + log missed call
  → [Phase 2] Connect to voice AI provider (Vapi/Retell/Bland)
       → Tool calls: check_availability, create_appointment, transfer_human
  → Post-call: write conversations + leads + lead_events
  → Trigger SMS follow-up (Twilio Messaging)

Inbound SMS
  → Twilio Messaging webhook
  → Match/create customer by phone
  → Append to messages + lead_events
  → Optional: LLM reply for booking continuation

Outbound SMS (automations)
  → pg_cron / Vercel cron
  → Queue from appointments + leads
  → Twilio Messaging API
  → Status callback → messages.status
```

---

## Phase 1 — Concierge (no AI voice yet)

### 1.1 Number provisioning

| Step | Action |
|------|--------|
| 1 | Buy Quebec local number via Twilio (`+1 514`, `+1 438`, `+1 450`, `+1 418`) |
| 2 | Attach to Messaging Service (A2P 10DLC registration for US; CA long codes simpler) |
| 3 | Store `phone_number` on `businesses` row |
| 4 | Configure voice URL → `https://<project>.supabase.co/functions/v1/twilio-voice` |

**Forwarding pattern (business keeps existing number):**

```
Customer calls salon main line
  → No answer / busy (salon PBX or Twilio Simulring)
  → Forward to RendezVous Twilio number
  → Phase 1: <Dial> founder/design-partner cell
  → Log call_session either way
```

### 1.2 Edge Function: `twilio-voice` (Phase 1)

```typescript
// Pseudocode — Phase 1 concierge
export async function handleVoiceWebhook(req: Request) {
  const params = await parseTwilioForm(req);
  const { CallSid, From, To, CallStatus, DialCallStatus } = params;

  const business = await getBusinessByTwilioNumber(To);

  if (CallStatus === 'ringing' || CallStatus === 'in-progress') {
    // Log inbound attempt
    await upsertConversation({
      business_id: business.id,
      channel: 'voice',
      twilio_call_sid: CallSid,
      from_number: From,
    });

    // Bilingual greeting (static TwiML v1; AI greeting in Phase 2)
    return twiml(`
      <Response>
        <Say language="fr-CA">Bonjour, vous avez joint ${business.name}.
          Hello, you've reached ${business.name}.
          Please hold.</Say>
        <Dial timeout="25" action="/functions/v1/twilio-voice-status">
          <Number>${business.forward_to_number}</Number>
        </Dial>
        <Say language="fr-CA">Nous sommes occupés. Nous vous enverrons un texto sous peu.</Say>
        <Hangup/>
      </Response>
    `);
  }

  // Dial completed, no answer
  if (DialCallStatus === 'no-answer' || DialCallStatus === 'busy') {
    await markConversationOutcome(CallSid, 'dropped');
    await createLeadFromMissedCall(business, From);
    await queueSms(business, From, 'missed_call_recovery');  // within 5 min
    return twiml('<Response><Hangup/></Response>');
  }
}
```

### 1.3 Edge Function: `twilio-sms-inbound`

| Event | Action |
|-------|--------|
| Inbound SMS | Normalize phone → `customers` upsert |
| STOP/ARRET | Set `sms_opt_out = true` on customer |
| Booking reply | Parse intent (phase 1: keyword match; phase 2: LLM) |
| Log | Insert `messages` + `lead_events` |

### 1.4 SMS templates (merge fields)

| Template key | Trigger | FR example |
|--------------|---------|------------|
| `booking_confirmed` | Appointment created | `Bonjour {{name}}, votre rendez-vous {{service}} est confirmé le {{date}} à {{time}}. Répondez ANNULER pour annuler.` |
| `reminder_24h` | Cron, T-24h | `Rappel: demain {{time}} — {{service}} chez {{business}}. Répondez OUI pour confirmer.` |
| `reminder_2h` | Cron, T-2h | `On vous attend dans 2h — {{time}}.` |
| `missed_call_recovery` | No-answer | `Bonjour! On a manqué votre appel chez {{business}}. Répondez ou réservez: {{booking_link}}` |
| `no_show_followup` | Status → no_show | `On a remarqué que vous n'avez pas pu venir. Voulez-vous replanifier? {{booking_link}}` |
| `trial_day_12` | Stripe trial | `Votre essai RendezVous AI se termine dans 2 jours.` |

**CASL:** Appointment-related SMS = implied consent when customer initiated contact. Marketing SMS off in v1.

---

## Phase 2 — AI voice layer

### 2.1 Provider bake-off (week 6)

Run identical 10-call script set with 2 native FR + 2 native EN evaluators.

| Criteria | Weight | How to measure |
|----------|--------|----------------|
| FR naturalness | 30% | 1–5 Likert per call |
| EN naturalness | 15% | 1–5 Likert |
| Booking completion rate | 25% | 10 scripted scenarios |
| Latency (time to first response) | 10% | <1.5s target |
| Cost per minute (all-in) | 10% | Provider + LLM + TTS |
| Tool-calling reliability | 10% | create_appointment success rate |

**Test script scenarios (FR):**

1. Book haircut, tomorrow afternoon
2. Reschedule existing appointment
3. Cancel appointment
4. Ask price/duration, then book
5. Speak only French — no English fallback requested
6. Angry caller — escalate to human
7. Outside business hours
8. Double-booking conflict — offer alternative
9. Unknown service request
10. Wrong number / general inquiry

**Cost benchmark (June 2026 estimates):**

| Provider | Platform $/min | Notes |
|----------|----------------|-------|
| Vapi | ~$0.05–0.08 | Flexible LLM swap; strong tool calling |
| Retell | ~$0.07–0.12 | Low-latency; good telephony UX |
| Bland | ~$0.09–0.15 | Enterprise lean; verify FR voice quality |

**Decision rule:** Pick cheapest provider scoring **≥4.0 avg** on FR naturalness. If none qualify, delay Phase 2 2 weeks and tune prompts/voices.

### 2.2 Recommended integration pattern (provider-agnostic)

```
Twilio inbound call
  → Edge Function validates signature
  → Returns TwiML <Connect> or SIP dial to provider
  OR
  → Provider owns Twilio number (port later)

Provider session events (webhook)
  → call_started | call_ended | transcript | tool_call
  → Edge Function writes conversations + executes tools
```

### 2.3 AI system prompt (skeleton)

```
You are the receptionist for {{business_name}}, a {{vertical}} in {{city}}, Quebec.
Languages: French (Canadian) and English. Detect caller language in first 2 exchanges;
respond in that language unless they switch.

Goals (in order):
1. Book, reschedule, or cancel an appointment
2. Capture lead info if booking not possible
3. Transfer to human if caller asks or sentiment is angry

Rules:
- Never invent availability — always call check_availability tool
- Confirm name + phone before booking
- Quote times in America/Montreal timezone
- If unsure, offer SMS follow-up link

Services: {{services_json}}
Staff: {{staff_json}}
Hours: {{hours_json}}
```

### 2.4 Tool definitions

#### `check_availability`

```json
{
  "name": "check_availability",
  "parameters": {
    "service_id": "uuid",
    "staff_id": "uuid | null",
    "preferred_date": "YYYY-MM-DD",
    "preferred_time": "HH:MM | null"
  },
  "returns": {
    "slots": [{ "starts_at": "ISO8601", "staff_id": "uuid", "staff_name": "string" }]
  }
}
```

**Implementation:** Query `appointments` for conflicts + `staff.working_hours` + Google Calendar busy times.

#### `create_appointment`

```json
{
  "name": "create_appointment",
  "parameters": {
    "customer_phone": "string",
    "customer_name": "string",
    "service_id": "uuid",
    "staff_id": "uuid",
    "starts_at": "ISO8601",
    "locale": "fr | en"
  },
  "returns": {
    "appointment_id": "uuid",
    "confirmation_sent": true
  }
}
```

**Side effects:**
1. Upsert `customers`
2. Insert `appointments` (status: `confirmed`)
3. Create Google Calendar event
4. Send `booking_confirmed` SMS
5. Update `leads.pipeline_stage` → `booked`
6. Increment `usage_counters.bookings_count`
7. Set `conversations.recovered_revenue_cents` if source was missed call

#### `transfer_to_human`

```json
{
  "name": "transfer_to_human",
  "parameters": { "reason": "string" }
}
```

**Implementation:** Twilio `<Dial>` to `business.forward_to_number`; log outcome `transferred`.

#### `capture_lead`

```json
{
  "name": "capture_lead",
  "parameters": {
    "phone": "string",
    "name": "string | null",
    "intent": "string",
    "locale": "fr | en"
  }
}
```

---

## Webhook inventory

| Endpoint | Source | Auth | Writes |
|----------|--------|------|--------|
| `/functions/v1/twilio-voice` | Twilio Voice | Request signature | `conversations` |
| `/functions/v1/twilio-voice-status` | Twilio Dial status | Signature | `conversations.outcome` |
| `/functions/v1/twilio-sms-inbound` | Twilio Messaging | Signature | `messages`, `customers`, `leads` |
| `/functions/v1/twilio-sms-status` | Twilio status callback | Signature | `messages` delivery state |
| `/functions/v1/voice-ai-events` | Vapi/Retell/Bland | Provider secret | `conversations.transcript`, tools |
| `/functions/v1/stripe-webhook` | Stripe | Stripe signature | `subscriptions`, `businesses.plan` |

**Twilio signature validation (required on all Twilio routes):**

```typescript
import { validateRequest } from 'twilio';

const valid = validateRequest(
  TWILIO_AUTH_TOKEN,
  req.headers.get('X-Twilio-Signature'),
  url,
  params
);
if (!valid) return new Response('Forbidden', { status: 403 });
```

---

## Recovered revenue attribution

| Condition | Attribution |
|-----------|-------------|
| `conversations.outcome = 'dropped'` (missed) AND appointment within 48h | `recovered_revenue_cents = service.price_cents` |
| `leads.source = 'missed_call'` AND stage → `booked` | Same |
| Web form lead | Not counted as "recovered call" (separate metric) |

**Dashboard query:**

```sql
SELECT
  COUNT(*) FILTER (WHERE outcome = 'booked') AS bookings_from_ai,
  SUM(recovered_revenue_cents) / 100.0 AS recovered_cad
FROM conversations
WHERE business_id = $1
  AND started_at >= CURRENT_DATE
  AND channel = 'voice';
```

---

## Usage metering

Increment on each billable event:

| Event | Counter | Plan limit (Starter) |
|-------|---------|----------------------|
| Appointment created | `bookings_count` | 100/mo |
| Outbound SMS | `sms_count` | 200/mo |
| Call ended | `voice_minutes += duration/60` | 100 min/mo |

**Enforcement (Edge Function middleware):**

```typescript
async function assertWithinLimits(businessId: string, resource: 'booking' | 'sms' | 'voice') {
  const usage = await getUsageCounter(businessId, currentPeriod());
  const plan = await getPlan(businessId);
  if (exceeds(usage, plan, resource)) {
    if (plan === 'starter') throw new UsageLimitError(resource); // allow overage billing
    throw new UpgradeRequiredError(resource);
  }
}
```

---

## Call recording & Law 25

| Requirement | Implementation |
|-------------|----------------|
| Consent | Bilingual prompt: *"This call may be recorded for quality purposes."* |
| Retention | 90-day default; configurable per business |
| Storage | Twilio recording → Supabase Storage bucket `call-recordings/{business_id}/` |
| Access | Owner/manager only via signed URL |
| Deletion | Honor customer erasure request within 30 days |
| Hosting | Supabase project in `ca-central-1` when available; document subprocessor list |

---

## Environment variables

```bash
# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_MESSAGING_SERVICE_SID=

# Voice AI (one active)
VAPI_API_KEY=
VAPI_WEBHOOK_SECRET=
# RETELL_API_KEY=
# BLAND_API_KEY=

# App
SUPABASE_SERVICE_ROLE_KEY=
PUBLIC_BOOKING_BASE_URL=https://app.rendezvous.ai

# Stripe (see doc 08)
STRIPE_WEBHOOK_SECRET=
```

---

## Phase 1 → Phase 2 migration checklist

- [ ] Replace static `<Say>` greeting with provider-connected stream
- [ ] Move `forward_to_number` from default path to `transfer_to_human` tool only
- [ ] Enable recording + transcript pipeline
- [ ] Turn on usage metering for voice minutes
- [ ] Run 10-call bake-off with design partner listening live
- [ ] Keep SMS fallback for 100% of missed calls (belt and suspenders)

---

## Failure modes

| Failure | Fallback |
|---------|----------|
| Voice AI down | TwiML forward to human + SMS |
| Tool call timeout | "Let me text you a booking link" |
| Google Calendar unreachable | Offer manual callback lead capture |
| SMS delivery failed | Dashboard alert to owner |
| FR detection wrong | Caller says "English please" → switch in prompt |

---

## Implementation order

1. `twilio-sms-inbound` + `twilio-sms-status` (day 1)
2. Outbound SMS sender + templates (day 2)
3. `twilio-voice` concierge forward (day 3)
4. Missed-call → lead → SMS loop (day 4)
5. Cron reminders (day 5)
6. Voice provider POC with 3 test calls (week 6)
7. Full AI voice cutover for 1 design partner (week 7)