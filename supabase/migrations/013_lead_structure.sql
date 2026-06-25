-- Add metadata JSONB column to leads table for structured diagnostic data

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
