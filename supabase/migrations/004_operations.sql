-- Sprint 3: onboarding fields + operations tables

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS working_hours jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  price_cents INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  preferred_language TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_phone
  ON customers (business_id, phone) WHERE phone IS NOT NULL;

CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'booked'
    CHECK (status IN ('booked','confirmed','cancelled','no_show','completed')),
  source TEXT NOT NULL DEFAULT 'manual'
    CHECK (source IN ('phone_ai','web_form','manual','reschedule')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appointments_business_day
  ON appointments (business_id, starts_at);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  pipeline_stage TEXT NOT NULL DEFAULT 'new'
    CHECK (pipeline_stage IN ('new','contacted','booked','lost')),
  notes TEXT,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads (business_id, pipeline_stage);

-- RLS helper
CREATE OR REPLACE FUNCTION public.user_business_id()
RETURNS uuid AS $$
  SELECT business_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- services
CREATE POLICY "services_select" ON services FOR SELECT
  USING (business_id = public.user_business_id());
CREATE POLICY "services_insert" ON services FOR INSERT
  WITH CHECK (business_id = public.user_business_id());
CREATE POLICY "services_update" ON services FOR UPDATE
  USING (business_id = public.user_business_id());
CREATE POLICY "services_delete" ON services FOR DELETE
  USING (business_id = public.user_business_id());

-- customers
CREATE POLICY "customers_select" ON customers FOR SELECT
  USING (business_id = public.user_business_id());
CREATE POLICY "customers_insert" ON customers FOR INSERT
  WITH CHECK (business_id = public.user_business_id());
CREATE POLICY "customers_update" ON customers FOR UPDATE
  USING (business_id = public.user_business_id());

-- staff
CREATE POLICY "staff_select" ON staff FOR SELECT
  USING (business_id = public.user_business_id());
CREATE POLICY "staff_insert" ON staff FOR INSERT
  WITH CHECK (business_id = public.user_business_id());

-- appointments
CREATE POLICY "appointments_select" ON appointments FOR SELECT
  USING (business_id = public.user_business_id());
CREATE POLICY "appointments_insert" ON appointments FOR INSERT
  WITH CHECK (business_id = public.user_business_id());
CREATE POLICY "appointments_update" ON appointments FOR UPDATE
  USING (business_id = public.user_business_id());

-- leads
CREATE POLICY "leads_select" ON leads FOR SELECT
  USING (business_id = public.user_business_id());
CREATE POLICY "leads_insert" ON leads FOR INSERT
  WITH CHECK (business_id = public.user_business_id());
CREATE POLICY "leads_update" ON leads FOR UPDATE
  USING (business_id = public.user_business_id());

GRANT UPDATE ON businesses TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON services TO authenticated;
GRANT SELECT, INSERT, UPDATE ON customers TO authenticated;
GRANT SELECT, INSERT ON staff TO authenticated;
GRANT SELECT, INSERT, UPDATE ON appointments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON leads TO authenticated;

GRANT ALL ON services TO service_role;
GRANT ALL ON customers TO service_role;
GRANT ALL ON staff TO service_role;
GRANT ALL ON appointments TO service_role;
GRANT ALL ON leads TO service_role;