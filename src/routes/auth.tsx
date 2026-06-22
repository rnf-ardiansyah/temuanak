import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk · TemuAnak" },
      { name: "description", content: "Masuk ke TemuAnak dengan OTP email atau akun Google." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Email tidak valid");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true, emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      toast.success("Kode OTP dikirim ke email");
      navigate({ to: "/auth/verify", search: { email: email.trim() } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengirim OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Gagal masuk dengan Google");
        setGoogleLoading(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal masuk dengan Google");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <Link to="/" className="inline-flex w-fit items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-card)]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">TemuAnak</span>
        </Link>

        <div className="mt-12">
          <h1 className="text-4xl font-extrabold tracking-tight">Masuk ke TemuAnak</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Tanpa password. Pilih lewat email atau akun Google.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-card px-6 text-base font-semibold text-foreground transition-all hover:bg-secondary disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <GoogleIcon /> Lanjut dengan Google
              </>
            )}
          </button>

          <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> atau <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSend}>
            <label className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Mail className="h-3.5 w-3.5" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
              required
            />
            <button
              type="submit"
              disabled={loading || googleLoading || !email}
              className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-primary-glow)] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Kirim Kode OTP <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Dengan masuk, kamu menyetujui penggunaan TemuAnak.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95L3.97 7.28C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}
