-- Add industry field to businesses table to customize AI persona

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS industry TEXT;
