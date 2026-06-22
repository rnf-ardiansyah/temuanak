import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Users, QrCode, ShieldOff, Plus, ArrowRight, Eye } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { listChildren } from "@/lib/children.functions";

const childrenQuery = (fn: () => Promise<unknown>) =>
  queryOptions({
    queryKey: ["children"],
    queryFn: fn as () => Promise<Awaited<ReturnType<typeof listChildren>>>,
  });

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · TemuAnak" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const fetcher = useServerFn(listChildren);
  const { data } = useSuspenseQuery(childrenQuery(fetcher));
  const children = data as Awaited<ReturnType<typeof listChildren>>;
  const total = children.length;
  const activeQr = children.filter((c) => c.qr_codes?.[0]?.active).length;
  const inactiveQr = total - activeQr;
  const totalViews = children.reduce(
    (acc, c) => acc + (c.qr_codes?.[0]?.view_count ?? 0),
    0,
  );

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Dashboard</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Halo 👋</h1>
          <p className="mt-2 max-w-xl text-base text-muted-foreground">
            Ringkasan profil anak dan QR Darurat kamu.
          </p>
        </div>
        <Link
          to="/children/new"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-primary-glow)]"
        >
          <Plus className="h-4 w-4" /> Tambah Profil Anak
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Users className="h-5 w-5" />} label="Total Anak" value={total} tone="primary" />
        <Stat icon={<QrCode className="h-5 w-5" />} label="QR Aktif" value={activeQr} tone="success" />
        <Stat icon={<ShieldOff className="h-5 w-5" />} label="QR Nonaktif" value={inactiveQr} tone="muted" />
        <Stat icon={<Eye className="h-5 w-5" />} label="Total Scan" value={totalViews} tone="soft" />
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Profil Anak Terbaru</h2>
            <Link to="/children" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {total === 0 ? (
            <EmptyChildren />
          ) : (
            <ul className="mt-5 divide-y divide-border">
              {children.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link
                    to="/children/$id"
                    params={{ id: c.id }}
                    className="flex items-center gap-4 py-3 transition-colors hover:bg-secondary/40 rounded-2xl px-2 -mx-2"
                  >
                    <Avatar nickname={c.nickname} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{c.nickname}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.age ? `${c.age} tahun` : "Umur belum diisi"} ·{" "}
                        {c.qr_codes?.[0]?.active ? (
                          <span className="text-success">QR Aktif</span>
                        ) : (
                          <span className="text-danger">QR Nonaktif</span>
                        )}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-3xl border border-transparent bg-surface-soft p-7 shadow-[var(--shadow-card)]">
          <h2 className="text-lg font-bold text-foreground">Aksi Cepat</h2>
          <p className="mt-2 text-sm text-secondary-foreground">
            Buat profil anak lalu cetak QR-nya untuk dijepit ke tas atau baju saat ke tempat ramai.
          </p>
          <Link
            to="/children/new"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background"
          >
            <Plus className="h-4 w-4" /> Buat Profil Anak
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "primary" | "success" | "muted" | "soft";
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary text-primary-foreground"
      : tone === "success"
        ? "bg-success/15 text-success"
        : tone === "muted"
          ? "bg-secondary text-muted-foreground"
          : "bg-surface-soft text-primary";
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${toneClass}`}>
        {icon}
      </div>
      <p className="mt-4 text-3xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Avatar({ nickname }: { nickname: string }) {
  const initials = nickname
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="grid h-11 w-11 place-items-center rounded-2xl text-sm font-bold text-white"
      style={{ background: "linear-gradient(135deg,#60A5FA,#A78BFA)" }}
    >
      {initials}
    </div>
  );
}

function EmptyChildren() {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-border bg-background/50 p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-surface-soft text-primary">
        <Users className="h-6 w-6" />
      </div>
      <p className="mt-4 font-semibold">Belum ada profil anak.</p>
      <p className="mt-1 text-sm text-muted-foreground">Mulai dengan membuat profil pertama.</p>
      <Link
        to="/children/new"
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
      >
        <Plus className="h-4 w-4" /> Buat Profil Anak
      </Link>
    </div>
  );
}
