import { ArrowRight, Phone, PlayCircle, QrCode, Sparkles } from "lucide-react";
import { Container } from "./primitives/Container";
import { PhoneMockup } from "./primitives/PhoneMockup";
import { QrPlaceholder } from "./primitives/QrPlaceholder";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-10 pb-20 md:pt-20 md:pb-32">
      {/* soft background blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-surface-soft opacity-70 blur-3xl"
      />

      <Container className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              MVP 2026
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-[68px]">
              Jika Anak Terpisah, <span className="text-primary">Orang Baik</span> Bisa Langsung Menghubungi Anda.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-secondary-foreground md:text-xl">
              TemuAnak membantu orang tua membuat QR Darurat yang dapat dipindai siapa saja
              untuk menghubungi keluarga dengan cepat.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#hero"
                className="inline-flex h-13 items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-[var(--shadow-primary-glow)] transition-all hover:translate-y-[-1px] hover:shadow-[0_24px_60px_-16px_rgba(37,99,235,0.6)] active:scale-[0.98]"
              >
                Buat QR Gratis
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#cara-kerja"
                className="inline-flex h-13 items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-base font-semibold text-foreground shadow-[var(--shadow-card)] transition-all hover:-translate-y-[1px] hover:shadow-[var(--shadow-elevated)]"
              >
                <PlayCircle className="h-5 w-5 text-primary" />
                Lihat Cara Kerja
              </a>
            </div>

            <div className="mt-8 flex items-center gap-5 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["#DCEEFF", "#FDE68A", "#FBCFE8", "#BBF7D0"].map((c, i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-background"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <span>
                <strong className="font-semibold text-foreground">500+ orang tua</strong> sudah membuat QR Darurat
              </span>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-md">
              <PhoneMockup>
                <div className="flex h-full flex-col items-center px-6 pt-10">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    QR Aktif
                  </div>
                  <h3 className="mt-3 text-base font-bold text-foreground">QR Darurat Anak</h3>
                  <p className="text-xs text-muted-foreground">Scan untuk hubungi orang tua</p>

                  <div className="mt-5 w-full rounded-3xl bg-white p-4 shadow-[var(--shadow-card)]">
                    <QrPlaceholder size={21} className="p-0" />
                  </div>

                  <div className="mt-5 w-full rounded-2xl bg-white p-4 shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-3">
                      <div
                        className="grid h-12 w-12 place-items-center rounded-full text-base font-bold text-white"
                        style={{ background: "linear-gradient(135deg,#F472B6,#A78BFA)" }}
                      >
                        AR
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-foreground">Ara, 5 tahun</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          Rambut keriting, kaos kuning
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-whatsapp text-xs font-semibold text-whatsapp-foreground">
                        <Phone className="h-3.5 w-3.5" /> WhatsApp
                      </button>
                      <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        <Phone className="h-3.5 w-3.5" /> Telepon
                      </button>
                    </div>
                  </div>
                </div>
              </PhoneMockup>

              {/* floating cards */}
              <div className="absolute -left-4 top-20 hidden w-56 rounded-2xl border border-border bg-card/90 p-3 shadow-[var(--shadow-elevated)] backdrop-blur md:block animate-fade-in">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-whatsapp/15 text-whatsapp">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">WhatsApp masuk</p>
                    <p className="text-[11px] text-muted-foreground">"Saya menemukan anak Anda"</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-2 bottom-16 hidden w-48 rounded-2xl border border-border bg-card/90 p-3 shadow-[var(--shadow-elevated)] backdrop-blur md:block animate-fade-in">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <QrCode className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">QR dipindai</p>
                    <p className="text-[11px] text-muted-foreground">2 detik yang lalu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
