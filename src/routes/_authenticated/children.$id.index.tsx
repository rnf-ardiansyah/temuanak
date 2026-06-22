import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import {
  ArrowLeft,
  Download,
  Link2,
  Power,
  RefreshCcw,
  Share2,
  Trash2,
  Pencil,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { deleteChild, getChild } from "@/lib/children.functions";
import { regenerateQr, toggleQr } from "@/lib/qr.functions";
import { publicQrUrl, telLink, waLink } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

const childQuery = (id: string, fn: (args: { data: { id: string } }) => Promise<unknown>) =>
  queryOptions({
    queryKey: ["child", id],
    queryFn: () => fn({ data: { id } }),
  });

export const Route = createFileRoute("/_authenticated/children/$id/")({
  head: () => ({ meta: [{ title: "Detail Anak · TemuAnak" }] }),
  component: ChildDetail,
});

function ChildDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const get = useServerFn(getChild);
  const del = useServerFn(deleteChild);
  const toggle = useServerFn(toggleQr);
  const regen = useServerFn(regenerateQr);

  const { data } = useSuspenseQuery(childQuery(id, get));
  const child = data as Awaited<ReturnType<typeof getChild>>;
  const qr = child.qr_codes?.[0];
  const url = qr ? publicQrUrl(qr.token) : "";
  const canvasRef = useRef<HTMLDivElement>(null);
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

  async function handleDownload() {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `temuanak-${child.nickname}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    toast.success("Link disalin");
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `QR ${child.nickname}`, url });
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopy();
    }
  }

  async function handleToggle() {
    if (!qr) return;
    try {
      await toggle({ data: { qrId: qr.id, active: !qr.active } });
      await qc.invalidateQueries({ queryKey: ["child", id] });
      await qc.invalidateQueries({ queryKey: ["children"] });
      toast.success(qr.active ? "QR dinonaktifkan" : "QR diaktifkan");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal");
    }
  }

  async function handleRegen() {
    if (!qr) return;
    if (!confirm("Regenerasi QR akan menonaktifkan token lama. Lanjutkan?")) return;
    try {
      await regen({ data: { qrId: qr.id } });
      await qc.invalidateQueries({ queryKey: ["child", id] });
      toast.success("Token QR baru dibuat");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal");
    }
  }

  async function handleDelete() {
    if (!confirm(`Hapus profil ${child.nickname}? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await del({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["children"] });
      toast.success("Profil dihapus");
      navigate({ to: "/children" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus");
    }
  }

  return (
    <AppShell>
      <Link to="/children" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Profile card */}
        <div className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-card)] lg:col-span-3">
          <div className="flex items-start gap-5">
            {photoUrl ? (
              <img src={photoUrl} alt={child.nickname} className="h-20 w-20 rounded-2xl object-cover" />
            ) : (
              <div
                className="grid h-20 w-20 place-items-center rounded-2xl text-2xl font-bold text-white"
                style={{ background: "linear-gradient(135deg,#60A5FA,#A78BFA)" }}
              >
                {child.nickname.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-extrabold tracking-tight">{child.nickname}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {child.age ? `${child.age} tahun` : "Umur belum diisi"}
                {child.gender ? ` · ${child.gender === "L" ? "Laki-laki" : child.gender === "P" ? "Perempuan" : "Lainnya"}` : ""}
              </p>
            </div>
            <Link
              to="/children/$id/edit"
              params={{ id }}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-semibold"
            >
              <Pencil className="h-4 w-4" /> Edit
            </Link>
          </div>

          <dl className="mt-7 grid gap-5 sm:grid-cols-2">
            <Field label="Ciri-ciri">{child.description || "—"}</Field>
            <Field label="Catatan">{child.notes || "—"}</Field>
            <Field label="Kontak Darurat">{child.emergency_contact}</Field>
            <Field label="WhatsApp">{child.whatsapp || "—"}</Field>
          </dl>

          <div className="mt-7 flex flex-wrap gap-2">
            <a
              href={waLink(child.whatsapp || child.emergency_contact, `Halo, saya orang tua ${child.nickname}.`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold text-whatsapp-foreground"
            >
              Test WhatsApp
            </a>
            <a
              href={telLink(child.emergency_contact)}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Test Telepon
            </a>
            <button
              onClick={handleDelete}
              className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-full border border-danger/30 bg-danger/5 px-4 text-sm font-semibold text-danger"
            >
              <Trash2 className="h-4 w-4" /> Hapus
            </button>
          </div>
        </div>

        {/* QR card */}
        <div className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">QR Darurat</h2>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                qr?.active ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${qr?.active ? "bg-success" : "bg-danger"}`} />
              {qr?.active ? "Aktif" : "Nonaktif"}
            </span>
          </div>

          {qr ? (
            <>
              <div className="mt-5 flex flex-col items-center gap-3 rounded-2xl bg-white p-5 shadow-inner">
                <div ref={canvasRef} className="hidden">
                  <QRCodeCanvas value={url} size={512} includeMargin level="H" />
                </div>
                <QRCodeSVG value={url} size={196} level="H" />
                <p className="break-all text-center text-[11px] font-mono text-muted-foreground">
                  {url}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" /> {qr.view_count} kali discan
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownload}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border bg-card text-sm font-semibold"
                >
                  <Share2 className="h-4 w-4" /> Bagikan
                </button>
                <button
                  onClick={handleCopy}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border bg-card text-sm font-semibold"
                >
                  <Link2 className="h-4 w-4" /> Salin Link
                </button>
                <button
                  onClick={handleToggle}
                  className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-full border text-sm font-semibold ${
                    qr.active
                      ? "border-danger/30 bg-danger/5 text-danger"
                      : "border-success/30 bg-success/5 text-success"
                  }`}
                >
                  <Power className="h-4 w-4" /> {qr.active ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <button
                  onClick={handleRegen}
                  className="col-span-2 inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border bg-card text-sm font-semibold"
                >
                  <RefreshCcw className="h-4 w-4" /> Regenerasi QR
                </button>
              </div>
            </>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">QR belum tersedia.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-foreground">{children}</dd>
    </div>
  );
}
