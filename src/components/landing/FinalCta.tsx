import { ArrowRight } from "lucide-react";
import { Container } from "./primitives/Container";

export function FinalCta() {
  return (
    <section className="px-4 py-12 md:px-6 md:py-16">
      <Container className="max-w-[1280px] px-0">
        <div className="relative overflow-hidden rounded-[40px] bg-primary px-8 py-20 text-center text-primary-foreground shadow-[var(--shadow-primary-glow)] md:px-16 md:py-28">
          {/* decorative grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          />

          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
              Persiapkan Sebelum Situasi Darurat Terjadi.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-primary-foreground/80 md:text-xl">
              Buat QR Darurat Anak dalam kurang dari satu menit. Gratis, tanpa kartu kredit.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#hero"
                className="inline-flex h-13 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-primary shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-[1px] active:scale-[0.98]"
              >
                Buat QR Gratis Sekarang
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#cara-kerja"
                className="inline-flex h-13 items-center rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                Pelajari Selengkapnya
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
