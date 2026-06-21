
DROP POLICY IF EXISTS "qr public active read" ON public.qr_codes;
REVOKE SELECT ON public.qr_codes FROM anon;

DROP POLICY IF EXISTS "child-photos public read via active qr" ON storage.objects;
CREATE POLICY "child-photos public read via active qr" ON storage.objects FOR SELECT TO anon
  USING (
    bucket_id = 'child-photos'
    AND EXISTS (
      SELECT 1 FROM public.children c
      JOIN public.qr_codes q ON q.child_id = c.id
      WHERE q.active = true
        AND c.photo_url = name
    )
  );
