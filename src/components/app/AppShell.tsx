import type { ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Home, Users, LogOut, Plus, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/children", label: "Profil Anak", icon: Users },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const qc = useQueryClient();

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Berhasil keluar");
    router.navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-card)]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">TemuAnak</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const active = pathname === n.to || pathname.startsWith(n.to + "/");
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    active
                      ? "bg-surface-soft text-primary"
                      : "text-secondary-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/children/new"
              className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-primary-glow)] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Tambah
            </Link>
            <button
              onClick={handleSignOut}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Keluar"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="border-t border-border/80 md:hidden">
          <div className="mx-auto flex max-w-[1280px] gap-1 px-3 py-2">
            {nav.map((n) => {
              const active = pathname === n.to || pathname.startsWith(n.to + "/");
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold",
                    active
                      ? "bg-surface-soft text-primary"
                      : "text-secondary-foreground",
                  )}
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] px-4 py-8 lg:px-8 lg:py-12">{children}</main>
    </div>
  );
}
