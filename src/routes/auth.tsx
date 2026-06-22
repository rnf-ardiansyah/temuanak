import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Phone, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { normalizePhone, phoneRegex } from "@/lib/format";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk · Temu Anak" },
      { name: "description", content: "Masuk ke Temu Anak dengan OTP via Email atau SMS." },
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
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
          <span className="text-lg font-bold tracking-tight">Temu Anak</span>
        </Link>

        <div className="mt-12">
          <h1 className="text-4xl font-extrabold tracking-tight">Masuk ke Temu Anak</h1>
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
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Dengan masuk, kamu menyetujui penggunaan Temu Anak.
        </p>
      </div>
    </div>
  );
}
