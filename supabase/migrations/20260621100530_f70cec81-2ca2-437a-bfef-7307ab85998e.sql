
-- ============= profiles =============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles self select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles self insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone)
  VALUES (NEW.id, NEW.email, NEW.phone)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============= children =============
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  description TEXT,
  photo_url TEXT,
  emergency_contact TEXT NOT NULL,
  whatsapp TEXT,
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_children_user ON public.children(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.children TO authenticated;
GRANT ALL ON public.children TO service_role;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
CREATE POLICY "children owner all" ON public.children FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_children_updated_at BEFORE UPDATE ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============= qr_codes =============
CREATE TABLE public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_qr_codes_child ON public.qr_codes(child_id);
CREATE INDEX idx_qr_codes_token ON public.qr_codes(token);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.qr_codes TO authenticated;
GRANT SELECT ON public.qr_codes TO anon;
GRANT ALL ON public.qr_codes TO service_role;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qr owner all" ON public.qr_codes FOR ALL TO authenticated
  USING (auth.uid() = (SELECT user_id FROM public.children WHERE id = child_id))
  WITH CHECK (auth.uid() = (SELECT user_id FROM public.children WHERE id = child_id));
-- Public can SELECT a qr_code only if active (for public QR page)
CREATE POLICY "qr public active read" ON public.qr_codes FOR SELECT TO anon USING (active = true);

-- For the public page we also need a narrow read on children via the QR token.
-- We expose a SECURITY DEFINER function instead of opening children to anon.
CREATE OR REPLACE FUNCTION public.get_public_qr(_token TEXT)
RETURNS TABLE (
  qr_id UUID,
  active BOOLEAN,
  nickname TEXT,
  age INTEGER,
  gender TEXT,
  description TEXT,
  photo_url TEXT,
  emergency_contact TEXT,
  whatsapp TEXT,
  notes TEXT
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT q.id, q.active, c.nickname, c.age, c.gender, c.description, c.photo_url,
         c.emergency_contact, c.whatsapp, c.notes
  FROM public.qr_codes q
  JOIN public.children c ON c.id = q.child_id
  WHERE q.token = _token
$$;
GRANT EXECUTE ON FUNCTION public.get_public_qr(TEXT) TO anon, authenticated;

-- Token generator
CREATE OR REPLACE FUNCTION public.generate_qr_token()
RETURNS TEXT LANGUAGE sql VOLATILE AS $$
  SELECT encode(gen_random_bytes(8), 'hex')
$$;

-- Auto-create qr_code on child insert
CREATE OR REPLACE FUNCTION public.handle_new_child()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.qr_codes (child_id, token)
  VALUES (NEW.id, public.generate_qr_token());
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_children_create_qr AFTER INSERT ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_child();

-- ============= qr_views =============
CREATE TABLE public.qr_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_id UUID NOT NULL REFERENCES public.qr_codes(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ua_hash TEXT
);
CREATE INDEX idx_qr_views_qr ON public.qr_views(qr_id);
GRANT SELECT ON public.qr_views TO authenticated;
GRANT ALL ON public.qr_views TO service_role;
ALTER TABLE public.qr_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qr_views owner read" ON public.qr_views FOR SELECT TO authenticated
  USING (auth.uid() = (
    SELECT c.user_id FROM public.qr_codes q
    JOIN public.children c ON c.id = q.child_id
    WHERE q.id = qr_id
  ));

-- Increment view count via security definer function (callable by anon)
CREATE OR REPLACE FUNCTION public.record_qr_view(_token TEXT, _ua_hash TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _qr_id UUID;
BEGIN
  SELECT id INTO _qr_id FROM public.qr_codes WHERE token = _token AND active = true;
  IF _qr_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.qr_views (qr_id, ua_hash) VALUES (_qr_id, _ua_hash);
  UPDATE public.qr_codes SET view_count = view_count + 1 WHERE id = _qr_id;
END; $$;
GRANT EXECUTE ON FUNCTION public.record_qr_view(TEXT, TEXT) TO anon, authenticated;
