import { Star } from "lucide-react";
import { Container } from "./primitives/Container";
import { SectionHeading } from "./primitives/SectionHeading";

const stats = [
  { value: "500+", label: "Orang Tua Terdaftar" },
  { value: "1.000+", label: "QR Telah Dibuat" },
  { value: "80%+", label: "QR Berhasil Dipindai" },
];

const testimonials = [
  {
    name: "Rina S.",
    role: "Ibu dari Ara, 5 thn",
    quote:
      "Pas ke mall pertama kali pakai QR, saya jauh lebih tenang. Anak saya bawa kalung kecil dengan QR-nya.",
    color: "linear-gradient(135deg,#F472B6,#A78BFA)",
  },
  {
    name: "Bu Maya",
    role: "Guru TK",
    quote:
      "Kami cetak QR untuk setiap murid sebelum fieldtrip. Setup-nya cepat dan aman.",
    color: "linear-gradient(135deg,#BAE6FD,#2563EB)",
  },
  {
    name: "Dimas P.",
    role: "Ayah, sering travelling",
    quote:
      "Gak ribet. Cukup buka HP, scan, langsung muncul tombol WhatsApp ke nomor saya.",
    color: "linear-gradient(135deg,#FDE68A,#F59E0B)",
  },
];

export function SocialProof() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Dipercaya"
          title={<>Sudah Membantu <span className="text-primary">Ratusan Keluarga</span> Indonesia.</>}
        />

        <div
          className="mt-12 grid grid-cols-1 gap-5 rounded-3xl border border-border bg-surface-soft p-8 sm:grid-cols-3"
          data-reveal
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <p className="text-5xl font-extrabold tracking-tight text-foreground md:text-6xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm font-medium text-secondary-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3" data-reveal>
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
            >
              <div>
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <blockquote className="mt-4 text-base leading-relaxed text-foreground">
                  "{t.quote}"
                </blockquote>
              </div>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white"
                  style={{ background: t.color }}
                >
                  {t.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
