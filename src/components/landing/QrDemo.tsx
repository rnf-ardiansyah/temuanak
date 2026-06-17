import { Phone, PowerOff, ShieldCheck } from "lucide-react";
import { Container } from "./primitives/Container";
import { SectionHeading } from "./primitives/SectionHeading";
import { QrPlaceholder } from "./primitives/QrPlaceholder";

export function QrDemo() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Demo QR"
          title={<>Inilah yang Dilihat <span className="text-primary">Orang Baik</span>.</>}
          description="Halaman publik yang sederhana, fokus, dan langsung mengarah ke tombol kontak."
        />

        <div className="mt-14 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12" data-reveal>
          {/* Left: QR */}
          <div className="lg:col-span-5">
            <div className="flex h-full flex-col rounded-3xl border border-border bg-surface-soft p-8 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <span className="h-2 w-2 rounded-full bg-success" /> QR Aktif
              </div>
              <div className="mt-6 rounded-3xl bg-white p-6 shadow-[var(--shadow-card)]">
                <QrPlaceholder size={25} className="p-0" />
              </div>
              <p className="mt-6 text-sm font-medium text-secondary-foreground">
                temuanak.id/q/<span className="text-foreground">ara-2026</span>
              </p>
            </div>
          </div>

          {/* Right: profile preview */}
          <div className="lg:col-span-7">
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
              <div className="flex items-start gap-5">
                <div
                  className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl text-2xl font-extrabold text-white shadow-[var(--shadow-card)]"
                  style={{ background: "linear-gradient(135deg,#F472B6,#A78BFA)" }}
                >
                  AR
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Anak ini butuh bantuan
                  </p>
                  <h3 className="mt-1 text-3xl font-bold text-foreground">Ara</h3>
                  <p className="text-sm text-muted-foreground">5 tahun • Perempuan</p>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-surface-soft p-4">
                  <dt className="text-xs font-semibold text-muted-foreground">Nama Panggilan</dt>
                  <dd className="mt-1 text-base font-bold text-foreground">Ara</dd>
                </div>
                <div className="rounded-2xl bg-surface-soft p-4">
                  <dt className="text-xs font-semibold text-muted-foreground">Umur</dt>
                  <dd className="mt-1 text-base font-bold text-foreground">5 tahun</dd>
                </div>
                <div className="rounded-2xl bg-surface-soft p-4 sm:col-span-2">
                  <dt className="text-xs font-semibold text-muted-foreground">Ciri Khas</dt>
                  <dd className="mt-1 text-base font-bold text-foreground">
                    Rambut keriting, kaos kuning, sepatu pink
                  </dd>
                </div>
              </dl>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold text-whatsapp-foreground shadow-[var(--shadow-card)] transition-transform hover:-translate-y-[1px]">
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </button>
                <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition-transform hover:-translate-y-[1px]">
                  <Phone className="h-4 w-4" />
                  Telepon
                </button>
                <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-danger/30 bg-danger/5 px-5 text-sm font-semibold text-danger transition-colors hover:bg-danger/10">
                  <PowerOff className="h-4 w-4" />
                  Nonaktifkan
                </button>
              </div>

              <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-success" />
                Data hanya menampilkan informasi yang Anda izinkan publik.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
