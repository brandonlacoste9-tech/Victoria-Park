-- Fix public.user_business_id() to run safely as the invoker (not SECURITY DEFINER)
-- and add LIMIT 1 for safety.
CREATE OR REPLACE FUNCTION public.user_business_id()
RETURNS uuid AS $$
  SELECT business_id FROM public.users WHERE id = auth.uid() LIMIT 1
$$ LANGUAGE sql STABLE SET search_path = public;

-- Drop the old policy that lacked WITH CHECK
DROP POLICY IF EXISTS "owners_update_business" ON businesses;

-- Recreate with both USING (for the row selection) and WITH CHECK (to validate the new row state)
CREATE POLICY "owners_update_business" ON businesses
  FOR UPDATE USING (
    id IN (
      SELECT business_id FROM users
      WHERE id = auth.uid() AND role IN ('owner', 'manager')
    )
  )
  WITH CHECK (
    id IN (
      SELECT business_id FROM users
      WHERE id = auth.uid() AND role IN ('owner', 'manager')
    )
  );
