import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Memproses Login · TemuAnak" }, { name: "robots", content: "noindex" }] }),
  component: CallbackPage,
});

function CallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse the hash fragment from the URL (e.g. #access_token=...&type=signup)
    const hash = window.location.hash.slice(1); // remove leading '#'
    if (!hash) {
      // No hash – try to detect an existing session (user refreshed)
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          navigate({ to: "/dashboard", replace: true });
        } else {
          navigate({ to: "/auth", replace: true });
        }
      });
      return;
    }

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const errorParam = params.get("error");
    const errorDescription = params.get("error_description");

    if (errorParam) {
      setError(errorDescription ?? errorParam);
      return;
    }

    if (!accessToken || !refreshToken) {
      setError("Token tidak valid. Silakan coba login ulang.");
      return;
    }

    // Exchange the tokens to establish a proper session
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error: sessionError }) => {
        if (sessionError) {
          setError(sessionError.message);
        } else {
          navigate({ to: "/dashboard", replace: true });
        }
      });
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <XCircle className="h-12 w-12 text-destructive" />
          <h1 className="text-xl font-bold tracking-tight">Login Gagal</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
          <a
            href="/auth"
            className="mt-2 inline-flex h-10 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
          >
            Coba Lagi
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-card)]">
        <ShieldCheck className="h-6 w-6" />
      </span>
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <p className="text-sm font-medium text-muted-foreground">Memproses login…</p>
    </div>
  );
}
