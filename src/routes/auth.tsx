import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk · TemuAnak" },
      { name: "description", content: "Masuk ke TemuAnak dengan kode OTP via Email." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const trimmed = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      toast.error("Email tidak valid");
      return;
    }

    setLoading(true);
    setRateLimited(false);

    try {
      // Use OTP mode (6-digit code) — do NOT pass emailRedirectTo so Supabase
      // sends a 6-digit code, not a magic link that lands back on this route.
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          shouldCreateUser: true,
          // emailRedirectTo is intentionally omitted to force 6-digit OTP mode
        },
      });

      if (error) throw error;

      setSent(true);
      toast.success("Kode OTP dikirim ke " + trimmed);
      navigate({
        to: "/auth/verify",
        search: { type: "email", value: trimmed },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim OTP";
      toast.error(msg);
      if (
        msg.toLowerCase().includes("rate limit") ||
        msg.toLowerCase().includes("too many") ||
        msg.toLowerCase().includes("limit exceeded")
      ) {
        setRateLimited(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        {/* Logo */}
        <Link to="/" className="inline-flex w-fit items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-card)]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">TemuAnak</span>
        </Link>

        {/* Heading */}
        <div className="mt-12">
          <h1 className="text-4xl font-extrabold tracking-tight">Masuk ke TemuAnak</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Tanpa password. Kami kirim kode OTP 6 digit ke email kamu.
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <form onSubmit={handleSend} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Alamat Email
              </label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full rounded-2xl border border-border bg-background py-3.5 pl-11 pr-4 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || sent}
              id="btn-send-otp"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-primary-glow)] disabled:opacity-60"
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

        {/* Rate limit warning */}
        {rateLimited && (
          <div className="mt-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/8 p-4">
            <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
              Batas pengiriman email tercapai
            </p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Supabase membatasi 3 email/jam pada paket gratis. Tunggu beberapa
              menit lalu coba lagi, atau konfigurasikan Custom SMTP di{" "}
              <span className="font-medium">
                Supabase Dashboard → Authentication → Providers → Email → SMTP Settings
              </span>
              .
            </p>
          </div>
        )}

        <p className="mt-auto pt-8 text-center text-xs text-muted-foreground">
          Dengan masuk, kamu menyetujui penggunaan TemuAnak.
        </p>
      </div>
    </div>
  );
}
