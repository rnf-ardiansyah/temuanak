import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "./primitives/Container";
import { SectionHeading } from "./primitives/SectionHeading";

const faqs = [
  {
    q: "Apakah perlu install aplikasi?",
    a: "Tidak. TemuAnak adalah PWA berbasis web. Orang yang menemukan anak cukup membuka kamera ponsel dan memindai QR — tidak ada aplikasi yang perlu diunduh.",
  },
  {
    q: "Apakah QR bisa dinonaktifkan?",
    a: "Bisa, kapan saja. Anda bisa mematikan QR dari dashboard. Saat dinonaktifkan, halaman publik QR tidak akan menampilkan kontak.",
  },
  {
    q: "Bagaimana jika QR fisik hilang?",
    a: "Cukup nonaktifkan QR lama, lalu buat dan cetak QR baru. Profil anak tidak perlu diisi ulang.",
  },
  {
    q: "Apakah data aman?",
    a: "Anda yang menentukan informasi apa yang ditampilkan publik. Data sensitif disimpan terenkripsi dan tidak pernah dibagikan ke pihak ketiga.",
  },
  {
    q: "Apakah bisa untuk lebih dari satu anak?",
    a: "Versi gratis mendukung 1 profil. Paket Premium memungkinkan multi-anak tanpa batas — cocok untuk keluarga, sekolah, dan daycare.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-24 md:py-32">
      <Container className="max-w-3xl">
        <SectionHeading
          align="center"
          eyebrow="FAQ"
          title="Pertanyaan yang Sering Diajukan"
          description="Belum menemukan jawabannya? Hubungi kami kapan saja."
        />

        <div
          className="mt-12 rounded-3xl border border-border bg-card p-2 shadow-[var(--shadow-card)] md:p-4"
          data-reveal
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-border last:border-b-0"
              >
                <AccordionTrigger className="px-4 py-5 text-left text-base font-semibold text-foreground hover:no-underline md:text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-5 text-base leading-relaxed text-secondary-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}
