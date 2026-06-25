-- Custom AI greeting and instructions per business

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS voice_greeting TEXT,
  ADD COLUMN IF NOT EXISTS voice_instructions TEXT;