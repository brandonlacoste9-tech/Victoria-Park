-- Allow anonymous waitlist signups via Data API (insert-only, no read/update/delete)
DROP POLICY IF EXISTS "deny_public_waitlist" ON waitlist_signups;

CREATE POLICY "allow_anon_waitlist_insert" ON waitlist_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "deny_anon_waitlist_select" ON waitlist_signups
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "deny_anon_waitlist_update" ON waitlist_signups
  FOR UPDATE
  TO anon, authenticated
  USING (false);

CREATE POLICY "deny_anon_waitlist_delete" ON waitlist_signups
  FOR DELETE
  TO anon, authenticated
  USING (false);