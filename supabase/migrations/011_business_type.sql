-- Business vertical for onboarding presets and marketing

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS business_type TEXT NOT NULL DEFAULT 'salon'
    CHECK (business_type IN ('salon', 'trade', 'office'));