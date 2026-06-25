-- Per-business Vapi voice agent

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS vapi_assistant_id TEXT,
  ADD COLUMN IF NOT EXISTS forward_to_number TEXT;

CREATE INDEX IF NOT EXISTS idx_businesses_vapi_assistant
  ON businesses (vapi_assistant_id) WHERE vapi_assistant_id IS NOT NULL;