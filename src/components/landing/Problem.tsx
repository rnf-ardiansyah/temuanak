import { AlertTriangle, Clock, HelpCircle, Users } from "lucide-react";
import { Container } from "./primitives/Container";
import { SectionHeading } from "./primitives/SectionHeading";
import { BentoCard } from "./primitives/BentoCard";

export function Problem() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Masalahnya"
          title={<>Beberapa Menit Bisa Terasa <span className="text-primary">Sangat Lama.</span></>}
          description="Saat anak terpisah di tempat ramai, orang yang menemukannya sering bingung harus menghubungi siapa. Detik-detik pertama sangat menentukan."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3" data-reveal>
          <BentoCard className="md:col-span-2 md:row-span-2 flex flex-col justify-between bg-surface-soft border-transparent">
            <div>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-danger/15 text-danger">
                <AlertTriangle className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-2xl font-bold leading-tight text-foreground md:text-3xl">
                Anak hilang di keramaian — paling sering di mall, taman bermain, dan tempat wisata.
              </h3>
              <p className="mt-3 max-w-md text-base text-secondary-foreground">
                Anak usia 2–8 tahun mudah teralihkan. Dalam hitungan detik, mereka bisa terpisah
                jauh dari orang tua di kerumunan.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur">
                <p className="text-3xl font-extrabold text-foreground">15 menit</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  Rata-rata waktu kritis pencarian
                </p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur">
                <p className="text-3xl font-extrabold text-foreground">7 dari 10</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  Anak tidak hafal nomor orang tua
                </p>
              </div>
            </div>
          </BentoCard>

          <BentoCard>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-warning/15 text-warning">
              <HelpCircle className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-xl font-bold text-foreground">
              Yang menemukan tidak tahu kontak orang tua
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Anak yang masih kecil sering tidak bisa menyebut nama atau nomor telepon dengan jelas.
            </p>
          </BentoCard>

          <BentoCard>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-danger/15 text-danger">
              <Users className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-xl font-bold text-foreground">
              Panik dan kebingungan
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Orang tua panik, orang baik bingung — koordinasi menjadi lambat saat justru harus cepat.
            </p>
          </BentoCard>

          <BentoCard className="md:col-span-3">
            <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Clock className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Proses menemukan keluarga jadi jauh lebih lama
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tanpa jalur kontak cepat, satpam dan security mall butuh waktu lama untuk
                    mempertemukan kembali.
                  </p>
                </div>
              </div>
              <a
                href="#solusi"
                className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:-translate-y-[1px]"
              >
                Lihat solusinya →
              </a>
            </div>
          </BentoCard>
        </div>
      </Container>
    </section>
  );
}
