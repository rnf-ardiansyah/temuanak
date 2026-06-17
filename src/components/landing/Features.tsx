import {
  Download,
  KeyRound,
  MessageCircle,
  Phone,
  PowerOff,
  QrCode,
  Smartphone,
  UserCircle,
} from "lucide-react";
import { Container } from "./primitives/Container";
import { SectionHeading } from "./primitives/SectionHeading";
import { BentoCard } from "./primitives/BentoCard";
import type { ComponentType } from "react";

type Feature = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  benefit: string;
  span?: string;
};

const features: Feature[] = [
  {
    icon: QrCode,
    title: "QR Otomatis",
    desc: "Sistem membuat QR unik untuk tiap anak dengan halaman publik aman.",
    benefit: "Siap dipakai dalam <1 menit",
    span: "md:col-span-2",
  },
  {
    icon: KeyRound,
    title: "Login OTP",
    desc: "Masuk cukup pakai nomor HP. Tidak perlu hafal password.",
    benefit: "Aman & sederhana",
  },
  {
    icon: UserCircle,
    title: "Profil Anak",
    desc: "Foto, nama, umur, ciri khas, alergi, kontak orang tua.",
    benefit: "Identifikasi cepat",
  },
  {
    icon: Download,
    title: "Download PNG",
    desc: "Simpan QR resolusi tinggi untuk dicetak atau dilaminating.",
    benefit: "Siap cetak",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Instan",
    desc: "Tombol chat ke nomor orang tua langsung dari halaman QR.",
    benefit: "Respon paling cepat",
  },
  {
    icon: Phone,
    title: "Telepon Langsung",
    desc: "Satu ketukan untuk menelepon nomor darurat yang Anda tentukan.",
    benefit: "Tanpa salin nomor",
  },
  {
    icon: PowerOff,
    title: "Aktif / Nonaktif QR",
    desc: "Matikan QR kapan saja jika hilang atau tidak diperlukan.",
    benefit: "Kontrol penuh",
  },
  {
    icon: Smartphone,
    title: "PWA Mobile Friendly",
    desc: "Berjalan mulus di Android & iOS tanpa install aplikasi.",
    benefit: "Web-based",
  },
];

export function Features() {
  return (
    <section id="fitur" className="bg-surface-soft py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Fitur"
          title={<>Semua yang Dibutuhkan, <br /> Tidak Lebih.</>}
          description="Setiap fitur dirancang fokus untuk satu hal: menghubungkan kembali anak dengan keluarga sesegera mungkin."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3" data-reveal>
          {features.map((f) => (
            <BentoCard key={f.title} className={f.span}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {f.benefit}
              </p>
            </BentoCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
