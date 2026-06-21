import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Users, ArrowRight, QrCode } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { listChildren } from "@/lib/children.functions";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const childrenQuery = (fn: () => Promise<unknown>) =>
  queryOptions({ queryKey: ["children"], queryFn: () => fn() });

export const Route = createFileRoute("/_authenticated/children/")({
  head: () => ({ meta: [{ title: "Profil Anak · TemuAnak" }] }),
  component: ChildrenList,
});

function ChildrenList() {
  const fetcher = useServerFn(listChildren);
  const { data } = useSuspenseQuery(childrenQuery(fetcher));
  const children = data as Awaited<ReturnType<typeof listChildren>>;

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Profil Anak</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Daftar Anak</h1>
        </div>
        <Link
          to="/children/new"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)]"
        >
          <Plus className="h-4 w-4" /> Tambah Profil
        </Link>
      </div>

      {children.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-[var(--shadow-card)]">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-surface-soft text-primary">
            <Users className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-xl font-bold">Belum ada profil anak.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Buat profil pertama untuk mulai membuat QR Darurat.</p>
          <Link
            to="/children/new"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Buat Profil Anak
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {children.map((c) => (
            <ChildCard key={c.id} child={c} />
          ))}
        </div>
      )}
    </AppShell>
  );
}

function ChildCard({ child }: { child: Awaited<ReturnType<typeof listChildren>>[number] }) {
  const qr = child.qr_codes?.[0];
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!child.photo_url) return;
    let cancelled = false;
    supabase.storage
      .from("child-photos")
      .createSignedUrl(child.photo_url, 60 * 60)
      .then(({ data }) => {
        if (!cancelled && data?.signedUrl) setPhotoUrl(data.signedUrl);
      });
    return () => {
      cancelled = true;
    };
  }, [child.photo_url]);

  return (
    <Link
      to="/children/$id"
      params={{ id: child.id }}
      className="group flex flex-col rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
    >
      <div className="flex items-center gap-4">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={child.nickname}
            className="h-14 w-14 rounded-2xl object-cover"
          />
        ) : (
          <div
            className="grid h-14 w-14 place-items-center rounded-2xl text-base font-bold text-white"
            style={{ background: "linear-gradient(135deg,#60A5FA,#A78BFA)" }}
          >
            {child.nickname.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold">{child.nickname}</p>
          <p className="text-xs text-muted-foreground">
            {child.age ? `${child.age} tahun` : "Umur belum diisi"}
          </p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <QrCode className="h-4 w-4 text-muted-foreground" />
          <span className={qr?.active ? "font-semibold text-success" : "font-semibold text-danger"}>
            {qr?.active ? "QR Aktif" : "QR Nonaktif"}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Detail <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
