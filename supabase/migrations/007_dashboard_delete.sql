-- Allow business owners to delete dashboard items

CREATE POLICY "appointments_delete" ON appointments FOR DELETE
  USING (business_id = public.user_business_id());

CREATE POLICY "leads_delete" ON leads FOR DELETE
  USING (business_id = public.user_business_id());

CREATE POLICY "conversations_delete" ON conversations FOR DELETE
  USING (business_id = public.user_business_id());

GRANT DELETE ON appointments TO authenticated;
GRANT DELETE ON leads TO authenticated;
GRANT DELETE ON conversations TO authenticated;