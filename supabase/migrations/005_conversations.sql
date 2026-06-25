-- Voice/SMS conversation logging (Phase 2 observability)

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  channel TEXT NOT NULL DEFAULT 'voice'
    CHECK (channel IN ('voice', 'sms', 'web')),
  external_call_id TEXT,
  from_number TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_seconds INT,
  outcome TEXT NOT NULL DEFAULT 'other'
    CHECK (outcome IN ('booked', 'lead_captured', 'transferred', 'dropped', 'other')),
  transcript TEXT,
  summary TEXT,
  recovered_revenue_cents INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_external_call
  ON conversations (business_id, external_call_id)
  WHERE external_call_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_conversations_business_day
  ON conversations (business_id, started_at DESC);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conversations_select" ON conversations FOR SELECT
  USING (business_id = public.user_business_id());

CREATE POLICY "conversations_insert" ON conversations FOR INSERT
  WITH CHECK (business_id = public.user_business_id());

CREATE POLICY "conversations_update" ON conversations FOR UPDATE
  USING (business_id = public.user_business_id());

GRANT SELECT, INSERT, UPDATE ON conversations TO authenticated;
GRANT ALL ON conversations TO service_role;

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();