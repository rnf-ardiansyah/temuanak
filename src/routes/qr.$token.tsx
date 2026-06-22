import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Phone, MessageCircle, ShieldAlert, ShieldOff, ShieldCheck } from "lucide-react";
import { getPublicQr, recordQrView } from "@/lib/qr.functions";
import { telLink, waLink } from "@/lib/format";

export const Route = createFileRoute("/qr/$token")({
  loader: async ({ params }) => {
    const data = await getPublicQr({ data: { token: params.token } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.nickname} · QR Darurat Temu Anak` : "QR · Temu Anak" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content: "Halaman QR Darurat Temu Anak — bantu hubungi orang tua.",
      },
    ],
  }),
  notFoundComponent: () => <NotFound />,
  errorComponent: () => <NotFound />,
  component: PublicQrPage,
});

function PublicQrPage() {
  const { token } = Route.useParams();
  const data = Route.useLoaderData() as Awaited<ReturnType<typeof getPublicQr>>;

  useEffect(() => {
    if (!data?.active) return;
    const ua = (navigator.userAgent || "").slice(0, 64);
    void recordQrView({ data: { token, uaHash: ua } }).catch(() => {});
  }, [token, data?.active]);

  if (!data) return <NotFound />;

  if (!data.active) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-10 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-danger/10 text-danger">
            <ShieldOff className="h-9 w-9" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-danger">
            QR ini sudah dinonaktifkan.
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Pemilik telah menonaktifkan QR ini. Mohon cari bantuan lewat petugas terdekat.
          </p>
          <span className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" /> Temu Anak
          </span>
        </div>
      </div>
    );
  }

  const wa = data.whatsapp || data.emergency_contact;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-6 py-8">
        <header className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          <ShieldCheck className="h-4 w-4" /> Temu Anak
        </header>

        <div className="mt-6 rounded-3xl border border-danger/30 bg-danger/5 p-4 text-center">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-danger">
            <ShieldAlert className="h-4 w-4" /> Anak ini sedang terpisah dari orang tuanya.
          </div>
          <p className="mt-1 text-xs text-danger/80">
            Mohon segera hubungi kontak darurat di bawah ini.
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-[28px] border border-border bg-card shadow-[var(--shadow-elevated)]">
          <div className="bg-surface-soft p-6 text-center">
            {data.photo_url ? (
              <img
                src={data.photo_url}
                alt={data.nickname}
                className="mx-auto h-32 w-32 rounded-3xl border-4 border-white object-cover shadow-[var(--shadow-card)]"
              />
            ) : (
              <div
                className="mx-auto grid h-32 w-32 place-items-center rounded-3xl border-4 border-white text-4xl font-bold text-white shadow-[var(--shadow-card)]"
                style={{ background: "linear-gradient(135deg,#60A5FA,#A78BFA)" }}
              >
                {data.nickname.slice(0, 2).toUpperCase()}
              </div>
            )}
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight">{data.nickname}</h1>
            <p className="mt-1 text-sm text-secondary-foreground">
              {data.age ? `${data.age} tahun` : ""}
              {data.gender ? ` · ${data.gender === "L" ? "Laki-laki" : data.gender === "P" ? "Perempuan" : ""}` : ""}
            </p>
          </div>

          <div className="space-y-4 px-6 py-6">
            {data.description && (
              <Block label="Ciri-ciri">{data.description}</Block>
            )}
            {data.notes && <Block label="Catatan Penting">{data.notes}</Block>}
          </div>

          <div className="grid gap-2 border-t border-border bg-background p-5">
            <a
              href={waLink(wa, `Halo, saya menemukan ${data.nickname}.`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-whatsapp text-base font-bold text-whatsapp-foreground shadow-[var(--shadow-card)]"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp Orang Tua
            </a>
            <a
              href={telLink(data.emergency_contact)}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-base font-bold text-primary-foreground shadow-[var(--shadow-card)]"
            >
              <Phone className="h-5 w-5" /> Telepon Sekarang
            </a>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Terima kasih sudah membantu. Identitas Anda tidak direkam.
        </p>
      </div>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-10 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-danger/10 text-danger">
          <ShieldOff className="h-9 w-9" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">QR tidak ditemukan</h1>
        <p className="mt-3 text-base text-muted-foreground">
          QR ini mungkin sudah dinonaktifkan atau token tidak valid.
        </p>
      </div>
    </div>
  );
}
