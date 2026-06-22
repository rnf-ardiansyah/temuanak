import { Building2, Heart, Palmtree, School } from "lucide-react";
import { Container } from "./primitives/Container";
import { SectionHeading } from "./primitives/SectionHeading";

const personas = [
  {
    icon: Heart,
    role: "Orang Tua",
    desc: "Untuk mall, taman bermain, dan liburan keluarga.",
    gradient: "linear-gradient(135deg,#FBCFE8,#A78BFA)",
  },
  {
    icon: School,
    role: "Sekolah",
    desc: "Identitas darurat siswa saat fieldtrip atau acara sekolah.",
    gradient: "linear-gradient(135deg,#BAE6FD,#2563EB)",
  },
  {
    icon: Building2,
    role: "Daycare",
    desc: "Profil cepat anak titip untuk setiap pengasuh dan staff.",
    gradient: "linear-gradient(135deg,#FDE68A,#F59E0B)",
  },
  {
    icon: Palmtree,
    role: "Tempat Wisata",
    desc: "Solusi child-safety untuk taman bermain dan destinasi keluarga.",
    gradient: "linear-gradient(135deg,#BBF7D0,#22C55E)",
  },
];

export function Personas() {
  return (
    <section className="bg-surface-soft py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Untuk Siapa"
          title={<>Dipakai di Tempat yang <br className="hidden md:block" /> Paling Membutuhkannya.</>}
          description="Temu Anak bisa dipakai siapa saja yang bertanggung jawab atas anak — di rumah, sekolah, atau tempat umum."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {personas.map((p) => (
            <div
              key={p.role}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
            >
              <div
                className="relative h-40 w-full"
                style={{ background: p.gradient }}
              >
                <span className="absolute bottom-4 left-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/90 text-foreground backdrop-blur">
                  <p.icon className="h-6 w-6" />
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground">{p.role}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
