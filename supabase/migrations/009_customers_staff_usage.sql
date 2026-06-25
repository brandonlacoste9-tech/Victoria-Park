-- Batch C: customers delete, staff update/delete, usage_counters

CREATE POLICY "customers_delete" ON customers FOR DELETE
  USING (business_id = public.user_business_id());

CREATE POLICY "staff_update" ON staff FOR UPDATE
  USING (business_id = public.user_business_id());

CREATE POLICY "staff_delete" ON staff FOR DELETE
  USING (business_id = public.user_business_id());

GRANT DELETE ON customers TO authenticated;
GRANT UPDATE, DELETE ON staff TO authenticated;

CREATE TABLE IF NOT EXISTS usage_counters (
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  bookings_count INT NOT NULL DEFAULT 0,
  sms_count INT NOT NULL DEFAULT 0,
  voice_minutes NUMERIC NOT NULL DEFAULT 0,
  PRIMARY KEY (business_id, period_start)
);

ALTER TABLE usage_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usage_counters_select" ON usage_counters FOR SELECT
  USING (business_id = public.user_business_id());

GRANT SELECT ON usage_counters TO authenticated;
GRANT ALL ON usage_counters TO service_role;