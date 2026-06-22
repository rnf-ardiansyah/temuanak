-- Remove anon public read policy on child-photos (filenames are guessable; use signed URLs instead)
DROP POLICY IF EXISTS "child-photos public read via active qr" ON storage.objects;

-- Lock down SECURITY DEFINER helpers that should never be called directly via the API
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_child() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.generate_qr_token() FROM anon, authenticated, public;

-- get_public_qr and record_qr_view MUST remain callable by anon — they power the public
-- QR scan flow at /qr/$token and validate the token themselves.
GRANT EXECUTE ON FUNCTION public.get_public_qr(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_qr_view(text, text) TO anon, authenticated;