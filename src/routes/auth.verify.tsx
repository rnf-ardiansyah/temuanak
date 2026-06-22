import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck, Loader2, MailCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";

const search = z.object({
  type: z.enum(["email"]).default("email"),
  value: z.string().min(3),
});

export const Route = createFileRoute("/auth/verify")({
  validateSearch: (s) => search.parse(s),
  head: () => ({ meta: [{ title: "Verifikasi · TemuAnak" }, { name: "robots", content: "noindex" }] }),
  component: VerifyPage,
});

function VerifyPage() {
  const { value: email } = Route.useSearch();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Auto-verify when 6 digits are entered
  useEffect(() => {
    if (code.length !== 6 || loading) return;
    void handleVerify(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function handleVerify(token: string) {
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });
      if (error) throw error;
      toast.success("Berhasil masuk! Selamat datang 🎉");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Kode salah atau sudah kadaluarsa";
      toast.error(msg);
      setCode("");
      setWrongAttempts((n) => n + 1);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      toast.success("Kode OTP baru dikirim");
      setCooldown(60);
      setCode("");
      setWrongAttempts(0);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengirim ulang kode");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        {/* Back */}
        <Link
          to="/auth"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Ganti Email
        </Link>

        {/* Logo */}
        <div className="mt-10 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-card)]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">TemuAnak</span>
        </div>

        {/* Heading */}
        <div className="mt-8">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <MailCheck className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Cek email kamu</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Kami mengirim kode OTP 6 digit ke{" "}
            <span className="font-semibold text-foreground">{email}</span>.
            <br />
            Masukkan kode tersebut di bawah ini.
          </p>
        </div>

        {/* OTP Input */}
        <div className="mt-8 flex flex-col items-center gap-6 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <InputOTP maxLength={6} value={code} onChange={setCode} disabled={loading} autoFocus>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} className="h-14 w-12 text-xl" />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {loading && (
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Memverifikasi…
            </div>
          )}

          {wrongAttempts >= 2 && !loading && (
            <p className="text-center text-xs text-muted-foreground">
              Kode salah beberapa kali? Pastikan kamu memasukkan kode terbaru dari email.
              Kode lama tidak berlaku jika sudah kirim ulang.
            </p>
          )}

          {/* Resend */}
          <button
            onClick={handleResend}
            disabled={cooldown > 0 || loading}
            id="btn-resend-otp"
            className="text-sm font-semibold text-primary transition-opacity disabled:text-muted-foreground"
          >
            {cooldown > 0 ? `Kirim ulang dalam ${cooldown}s` : "Kirim ulang kode"}
          </button>
        </div>

        {/* Tip */}
        <div className="mt-4 rounded-2xl border border-border bg-secondary/50 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            💡 <span className="font-medium">Tidak ada email masuk?</span> Cek folder Spam /
            Promotions, atau tunggu beberapa detik. Kode berlaku selama{" "}
            <span className="font-medium">1 jam</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
