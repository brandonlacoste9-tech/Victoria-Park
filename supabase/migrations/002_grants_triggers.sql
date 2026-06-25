-- Grants, triggers, and RLS hardening (Phase 0/1)

-- updated_at helper
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Expose tables to Data API (RLS still applies)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT ON businesses TO authenticated;
GRANT SELECT ON users TO authenticated;
GRANT SELECT ON subscriptions TO authenticated;

-- Service role used by API routes (bypasses RLS)
GRANT ALL ON waitlist_signups TO service_role;
GRANT ALL ON businesses TO service_role;
GRANT ALL ON users TO service_role;
GRANT ALL ON subscriptions TO service_role;

-- Authenticated users can read their profile row
CREATE POLICY "users_update_self" ON users
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Owners can update their business settings
CREATE POLICY "owners_update_business" ON businesses
  FOR UPDATE USING (
    id IN (
      SELECT business_id FROM users
      WHERE id = auth.uid() AND role IN ('owner', 'manager')
    )
  );