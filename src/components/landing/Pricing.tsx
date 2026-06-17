import { Check, Sparkles } from "lucide-react";
import { Container } from "./primitives/Container";
import { SectionHeading } from "./primitives/SectionHeading";
import { cn } from "@/lib/utils";

type Plan = {
  name: string;
  price: string;
  period?: string;
  desc: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "Rp0",
    desc: "Cocok untuk satu anak. Selamanya gratis.",
    features: ["1 Profil Anak", "QR Tanpa Batas Scan", "Download PNG", "WhatsApp & Telepon CTA"],
    cta: "Mulai Gratis",
  },
  {
    name: "Premium",
    price: "Rp15.000",
    period: "/bulan",
    desc: "Untuk keluarga, sekolah, dan daycare.",
    features: [
      "Multi Anak (tanpa batas)",
      "Riwayat & Statistik QR",
      "Backup Data Otomatis",
      "Tema Premium QR",
      "Prioritas Dukungan",
    ],
    cta: "Coba Premium",
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <section id="harga" className="bg-surface-soft py-24 md:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Harga"
          title={<>Mulai Gratis. <span className="text-primary">Upgrade Saat Butuh.</span></>}
          description="Transparan. Tidak ada biaya tersembunyi. Bisa berhenti kapan saja."
        />

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2" data-reveal>
          {plans.map((p) => (
            <div
              key={p.name}
              className={cn(
                "relative flex flex-col rounded-3xl border p-8 transition-all md:p-10",
                p.highlighted
                  ? "border-primary bg-foreground text-background shadow-[var(--shadow-elevated)] md:-translate-y-2"
                  : "border-border bg-card text-foreground shadow-[var(--shadow-card)] hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]",
              )}
            >
              {p.highlighted && (
                <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-card)]">
                  <Sparkles className="h-3.5 w-3.5" /> Populer
                </span>
              )}
              <h3
                className={cn(
                  "text-xl font-bold",
                  p.highlighted ? "text-background" : "text-foreground",
                )}
              >
                {p.name}
              </h3>
              <p
                className={cn(
                  "mt-2 text-sm",
                  p.highlighted ? "text-background/70" : "text-muted-foreground",
                )}
              >
                {p.desc}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tight">{p.price}</span>
                {p.period && (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      p.highlighted ? "text-background/60" : "text-muted-foreground",
                    )}
                  >
                    {p.period}
                  </span>
                )}
              </div>
              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <span
                      className={cn(
                        "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                        p.highlighted ? "bg-primary/30 text-primary-foreground" : "bg-primary/10 text-primary",
                      )}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className={p.highlighted ? "text-background/90" : "text-secondary-foreground"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="#hero"
                className={cn(
                  "mt-10 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-all active:scale-[0.98]",
                  p.highlighted
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-primary-glow)] hover:-translate-y-[1px]"
                    : "border border-border bg-card text-foreground hover:bg-secondary",
                )}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
