
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.generate_qr_token()
RETURNS TEXT LANGUAGE sql VOLATILE SET search_path = public, extensions AS $$
  SELECT encode(extensions.gen_random_bytes(8), 'hex')
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_child() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_qr_token() FROM PUBLIC, anon, authenticated;

-- Storage policies on child-photos: owner-only by folder prefix = user id
CREATE POLICY "child-photos owner read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'child-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "child-photos owner insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'child-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "child-photos owner update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'child-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "child-photos owner delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'child-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read of child-photos via signed URL is the default, but for the
-- public QR scan page we need direct read access. Photos referenced by an
-- active QR code should be publicly readable.
CREATE POLICY "child-photos public read via active qr" ON storage.objects FOR SELECT TO anon
  USING (
    bucket_id = 'child-photos'
    AND EXISTS (
      SELECT 1 FROM public.children c
      JOIN public.qr_codes q ON q.child_id = c.id
      WHERE q.active = true
        AND c.photo_url LIKE '%' || name
    )
  );
