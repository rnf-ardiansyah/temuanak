import { Lock, MousePointerClick, Smartphone, Zap } from "lucide-react";
import { Container } from "./primitives/Container";
import { SectionHeading } from "./primitives/SectionHeading";

const benefits = [
  { icon: Smartphone, title: "Tanpa Aplikasi", desc: "Cukup kamera ponsel. Siapa pun bisa scan, kapan pun." },
  { icon: MousePointerClick, title: "Mudah Digunakan", desc: "Setup dalam 1 menit. Antarmuka dirancang untuk semua orang tua." },
  { icon: Lock, title: "Aman", desc: "Anda kontrol data apa yang tampil. QR bisa dinonaktifkan kapan saja." },
  { icon: Zap, title: "Cepat Diakses", desc: "Halaman publik ringan, terbuka instan bahkan di jaringan lemah." },
];

export function Benefits() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Keunggulan"
          title={<>Dirancang untuk Situasi yang <span className="text-primary">Membutuhkan Kecepatan.</span></>}
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <b.icon className="h-7 w-7" />
              </span>
              <h3 className="mt-6 text-xl font-bold text-foreground">{b.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
