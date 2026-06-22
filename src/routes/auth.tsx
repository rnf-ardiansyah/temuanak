import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Phone, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { normalizePhone, phoneRegex } from "@/lib/format";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk · TemuAnak" },
      { name: "description", content: "Masuk ke TemuAnak dengan OTP via Email atau SMS." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState<"rate_limit" | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorType(null);
    try {
      if (tab === "email") {
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          toast.error("Email tidak valid");
          return;
        }
        const { error } = await supabase.auth.signInWithOtp({
          email: value.trim(),
          options: { shouldCreateUser: true, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      } else {
        if (!phoneRegex.test(value.replace(/\s/g, ""))) {
          toast.error("Nomor HP tidak valid (contoh: 08123456789)");
          return;
        }
        const phone = normalizePhone(value);
        const { error } = await supabase.auth.signInWithOtp({
          phone,
          options: { shouldCreateUser: true },
        });
        if (error) throw error;
      }
      toast.success("Kode OTP dikirim");
      navigate({
        to: "/auth/verify",
        search: { type: tab, value: tab === "phone" ? normalizePhone(value) : value.trim() },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim OTP";
      toast.error(msg);
      if (
        msg.toLowerCase().includes("rate limit") ||
        msg.toLowerCase().includes("too many requests") ||
        msg.toLowerCase().includes("limit exceeded")
      ) {
        setErrorType("rate_limit");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    if (loading) return;
    setLoading(true);
    setErrorType(null);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      toast.success("Berhasil masuk sebagai Tamu");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal masuk sebagai Tamu";
      toast.error(msg);
      if (msg.includes("not enabled")) {
        toast.info("Silakan aktifkan 'Anonymous sign-ins' di Supabase Dashboard (Authentication > Providers > Anonymous)");
      }
    } finally {
      setLoading(false);
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
            Tanpa password. Kami akan kirim kode OTP ke email atau HP kamu.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-card p-2 shadow-[var(--shadow-card)]">
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-secondary p-1">
            <button
              onClick={() => setTab("email")}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                tab === "email" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Mail className="h-4 w-4" /> Email
            </button>
            <button
              onClick={() => setTab("phone")}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                tab === "phone" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Phone className="h-4 w-4" /> Nomor HP
            </button>
          </div>

          <form onSubmit={handleSend} className="px-3 pb-3 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {tab === "email" ? "Email" : "Nomor WhatsApp"}
            </label>
            <input
              type={tab === "email" ? "email" : "tel"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={tab === "email" ? "nama@email.com" : "08123456789"}
              className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
              required
            />
            <button
              type="submit"
              disabled={loading || !value}
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

            <div className="relative my-4 flex items-center justify-center">
              <hr className="w-full border-border" />
              <span className="absolute bg-card px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                atau
              </span>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-transparent px-6 text-base font-semibold text-foreground transition-all hover:bg-secondary disabled:opacity-60"
            >
              Masuk sebagai Tamu (Demo)
            </button>
          </form>
        </div>

        {errorType === "rate_limit" && (
          <div className="mt-6 rounded-2xl border border-yellow-500/25 bg-yellow-500/5 p-5 text-sm text-yellow-700 dark:text-yellow-400">
            <h3 className="font-bold text-base mb-1">Limit Pengiriman Email/SMS Tercapai</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Supabase membatasi pengiriman email/SMS OTP default (maksimal 3 email per jam) pada tier gratis.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-xs font-semibold">Cara Mengatasi di Supabase Dashboard:</p>
              <ol className="list-decimal list-inside text-xs text-muted-foreground space-y-1">
                <li>Buka project Anda di <b>Supabase Dashboard</b>.</li>
                <li>Pilih menu <b>Authentication &gt; Providers &gt; Email</b>.</li>
                <li>Aktifkan dan konfigurasi <b>SMTP Settings</b> menggunakan provider eksternal (seperti Resend, SendGrid, atau Mailgun).</li>
              </ol>
              <p className="text-xs font-semibold mt-1">Solusi Cepat untuk Uji Coba (Testing):</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                <li>Gunakan tombol <b>Masuk sebagai Tamu (Demo)</b> di atas untuk langsung mencoba aplikasi secara instan tanpa perlu OTP.</li>
                <li>Atau daftarkan <b>Test OTPs</b> di menu Email Supabase untuk email Anda (contoh kode: 123456) agar tidak memicu pengiriman email asli.</li>
              </ul>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Dengan masuk, kamu menyetujui penggunaan TemuAnak.
        </p>
      </div>
    </div>
  );
}
