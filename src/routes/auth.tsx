import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, ShieldCheck, ArrowRight, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { signUpAdmin } from "@/lib/auth.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk · TemuAnak" },
      { name: "description", content: "Masuk ke TemuAnak dengan Email & Password." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      toast.error("Email tidak valid");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal terdiri dari 6 karakter");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    setSignupSuccessNote(false);

    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: password,
        });

        if (error) throw error;

        toast.success("Berhasil masuk!");
        navigate({ to: "/dashboard", replace: true });
      } else {
        // Use the admin service role to register and auto-confirm user,
        // avoiding rate limit email limits entirely.
        await signUpAdmin({
          data: {
            email: trimmedEmail,
            password: password,
          },
        });

        // Immediately sign the user in with password
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: password,
        });

        if (loginError) throw loginError;

        toast.success("Pendaftaran berhasil & langsung masuk!");
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(msg);
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
          <h1 className="text-4xl font-extrabold tracking-tight">
            {mode === "signin" ? "Masuk ke TemuAnak" : "Buat Akun Baru"}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            {mode === "signin"
              ? "Gunakan email dan kata sandi kamu untuk masuk ke dashboard."
              : "Daftar sekarang untuk mulai mengamankan anak Anda."}
          </p>
        </div>

        {/* Form Container */}
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          {/* Mode Switcher */}
          <div className="mb-6 flex rounded-2xl bg-secondary p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setSignupSuccessNote(false);
              }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                mode === "signin"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setSignupSuccessNote(false);
              }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                mode === "signup"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Input */}
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

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Kata Sandi
              </label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full rounded-2xl border border-border bg-background py-3.5 pl-11 pr-11 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input (only on signup) */}
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full rounded-2xl border border-border bg-background py-3.5 pl-11 pr-11 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-primary-glow)] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {mode === "signin" ? "Masuk" : "Daftar Akun"} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>



        <p className="mt-auto pt-8 text-center text-xs text-muted-foreground">
          Dengan masuk, kamu menyetujui penggunaan TemuAnak.
        </p>
      </div>
    </div>
  );
}
