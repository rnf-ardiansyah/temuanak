import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";

const search = z.object({
  type: z.enum(["email", "phone"]).default("email"),
  value: z.string().min(3),
});

export const Route = createFileRoute("/auth/verify")({
  validateSearch: (s) => search.parse(s),
  head: () => ({ meta: [{ title: "Verifikasi · TemuAnak" }, { name: "robots", content: "noindex" }] }),
  component: VerifyPage,
});

function VerifyPage() {
  const { type, value } = Route.useSearch();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (code.length !== 6 || loading) return;
    void handleVerify(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function handleVerify(token: string) {
    setLoading(true);
    try {
      const { error } =
        type === "email"
          ? await supabase.auth.verifyOtp({ email: value, token, type: "email" })
          : await supabase.auth.verifyOtp({ phone: value, token, type: "sms" });
      if (error) throw error;
      toast.success("Berhasil masuk");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Kode salah";
      toast.error(msg);
      setCode("");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    try {
      const { error } =
        type === "email"
          ? await supabase.auth.signInWithOtp({ email: value })
          : await supabase.auth.signInWithOtp({ phone: value });
      if (error) throw error;
      toast.success("OTP baru dikirim");
      setCooldown(60);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengirim ulang");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <Link to="/auth" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
        <div className="mt-10 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-card)]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">TemuAnak</span>
        </div>

        <h1 className="mt-8 text-4xl font-extrabold tracking-tight">Masukkan kode OTP</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Kami mengirim 6 digit kode ke{" "}
          <span className="font-semibold text-foreground">{value}</span>.
        </p>

        <div className="mt-10 flex flex-col items-center gap-6 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <InputOTP maxLength={6} value={code} onChange={setCode} disabled={loading}>
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

          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className="text-sm font-semibold text-primary disabled:text-muted-foreground"
          >
            {cooldown > 0 ? `Kirim ulang dalam ${cooldown}s` : "Kirim ulang kode"}
          </button>
        </div>
      </div>
    </div>
  );
}
