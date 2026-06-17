import { QrCode, ScanLine, UserPlus2 } from "lucide-react";
import { Container } from "./primitives/Container";
import { SectionHeading } from "./primitives/SectionHeading";

const steps = [
  {
    icon: UserPlus2,
    step: "01",
    title: "Buat Profil Anak",
    desc: "Tambahkan foto, nama panggilan, umur, dan ciri khas anak. Cukup 1 menit.",
  },
  {
    icon: QrCode,
    step: "02",
    title: "Generate QR",
    desc: "QR Darurat unik dibuat otomatis. Cetak, tempel di tas, atau simpan di ponsel.",
  },
  {
    icon: ScanLine,
    step: "03",
    title: "Scan & Hubungi Orang Tua",
    desc: "Siapa pun yang menemukan anak bisa langsung menghubungi via WhatsApp atau telepon.",
  },
];

export function Solution() {
  return (
    <section id="solusi" className="bg-surface-soft py-24 md:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Solusinya"
          title={<>TemuAnak Menyederhanakan <br className="hidden md:block" /> Situasi Darurat.</>}
          description="Tiga langkah sederhana yang menyiapkan jalur kontak cepat sebelum darurat terjadi."
        />

        <div className="relative mt-16 grid grid-cols-1 gap-6 md:grid-cols-3" data-reveal>
          {/* connecting line */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-12 hidden h-px md:block"
            style={{
              background:
                "repeating-linear-gradient(to right,#2563EB 0 8px,transparent 8px 16px)",
            }}
          />

          {steps.map((s) => (
            <div
              key={s.step}
              className="relative rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-primary-glow)]">
                <s.icon className="h-7 w-7" />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Langkah {s.step}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-foreground">{s.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-secondary-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
