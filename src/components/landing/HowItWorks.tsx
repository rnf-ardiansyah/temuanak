import { Camera, Download, FileEdit, Phone, QrCode, ScanLine } from "lucide-react";
import { Container } from "./primitives/Container";
import { SectionHeading } from "./primitives/SectionHeading";
import { BentoCard } from "./primitives/BentoCard";
import { QrPlaceholder } from "./primitives/QrPlaceholder";

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Cara Kerja"
          title={<>Sederhana untuk dibuat. <br /> <span className="text-primary">Sangat cepat</span> saat dibutuhkan.</>}
          description="Enam langkah, dari membuat profil hingga orang baik bisa menghubungi Anda."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-6" data-reveal>
          {/* A */}
          <BentoCard className="md:col-span-3">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <FileEdit className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">A</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">Isi Data Anak</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Nama panggilan, umur, ciri khas, kontak orang tua.
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-2 rounded-2xl border border-dashed border-border p-4">
              <div className="h-3 w-1/2 rounded-full bg-secondary" />
              <div className="h-3 w-2/3 rounded-full bg-secondary" />
              <div className="h-3 w-1/3 rounded-full bg-secondary" />
            </div>
          </BentoCard>

          {/* B */}
          <BentoCard className="md:col-span-3">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Camera className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">B</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">Upload Foto</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Foto wajah jelas membantu identifikasi cepat.
                </p>
              </div>
            </div>
            <div className="mt-5 flex h-24 items-center justify-center rounded-2xl bg-surface-soft text-primary">
              <Camera className="h-10 w-10 opacity-60" />
            </div>
          </BentoCard>

          {/* C */}
          <BentoCard tone="primary" className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">C</p>
            <h3 className="mt-1 text-xl font-bold">Generate QR</h3>
            <p className="mt-2 text-sm opacity-90">Otomatis dalam hitungan detik.</p>
            <div className="mt-4 rounded-2xl bg-white p-2">
              <QrPlaceholder size={17} className="p-0" />
            </div>
          </BentoCard>

          {/* D */}
          <BentoCard className="md:col-span-2">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Download className="h-6 w-6" />
            </span>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">D</p>
            <h3 className="mt-1 text-xl font-bold text-foreground">Cetak atau Simpan</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tempel di tas, gantungan kunci, atau kartu identitas anak.
            </p>
          </BentoCard>

          {/* E */}
          <BentoCard className="md:col-span-2">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <ScanLine className="h-6 w-6" />
            </span>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">E</p>
            <h3 className="mt-1 text-xl font-bold text-foreground">Scan QR</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Cukup buka kamera ponsel — tidak perlu install aplikasi apa pun.
            </p>
          </BentoCard>

          {/* F — full width banner */}
          <BentoCard className="md:col-span-6 bg-foreground text-background border-transparent">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-whatsapp text-white">
                  <Phone className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-background/60">F</p>
                  <h3 className="mt-1 text-2xl font-bold">Hubungi Orang Tua</h3>
                  <p className="mt-1 max-w-xl text-sm text-background/70">
                    Tombol WhatsApp & Telepon muncul langsung di halaman publik QR.
                    Satu ketukan, langsung tersambung.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="inline-flex h-11 items-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold text-white">
                  <Phone className="h-4 w-4" /> WhatsApp
                </span>
                <span className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white">
                  <Phone className="h-4 w-4" /> Telepon
                </span>
              </div>
            </div>
          </BentoCard>
        </div>
      </Container>
    </section>
  );
}
