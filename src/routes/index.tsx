import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { Problem } from "@/components/landing/Problem";
import { Solution } from "@/components/landing/Solution";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { QrDemo } from "@/components/landing/QrDemo";
import { Benefits } from "@/components/landing/Benefits";
import { Personas } from "@/components/landing/Personas";
import { SocialProof } from "@/components/landing/SocialProof";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { useReveal } from "@/hooks/use-reveal";

const TITLE = "TemuAnak — QR Darurat untuk Membantu Anak Kembali ke Orang Tuanya";
const DESCRIPTION =
  "Buat QR Darurat untuk anak Anda dalam 1 menit. Saat anak terpisah di tempat ramai, siapa pun bisa scan QR dan langsung menghubungi orang tua via WhatsApp.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <Problem />
        <Solution />
        <HowItWorks />
        <Features />
        <QrDemo />
        <Benefits />
        <Personas />
        <SocialProof />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
