-- Dev seed (optional — run via supabase db reset locally)

INSERT INTO waitlist_signups (
  business_name, contact_name, email, city, staff_count, primary_pain, locale, founder_code
) VALUES (
  'Salon Démo Montréal',
  'Marie Tremblay',
  'demo@example.com',
  'Montréal',
  '4-8',
  'missed_calls',
  'fr-CA',
  'RDV-DEMO01'
) ON CONFLICT (founder_code) DO NOTHING;