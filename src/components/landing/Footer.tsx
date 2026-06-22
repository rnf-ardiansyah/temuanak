import { Instagram, ShieldCheck, Twitter, Youtube } from "lucide-react";
import { Container } from "./primitives/Container";

const groups = [
  {
    title: "Produk",
    links: ["Fitur", "Cara Kerja", "Harga", "Demo QR"],
  },
  {
    title: "Bantuan",
    links: ["Panduan", "FAQ", "Status", "Hubungi Kami"],
  },
  {
    title: "Perusahaan",
    links: ["Tentang", "Blog", "Karir", "Press"],
  },
  {
    title: "Legal",
    links: ["Privasi", "Syarat Layanan", "Keamanan Data", "Cookie"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-20 pb-10">
      <Container>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <a href="#hero" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight text-foreground">TemuAnak</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              QR Darurat untuk membantu anak kembali ke orang tuanya. Dibuat untuk keluarga Indonesia.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-secondary-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="text-sm font-bold text-foreground">{g.title}</h4>
              <ul className="mt-4 space-y-3">
                {g.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-secondary-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 md:flex-row md:items-center">
          <p className="text-sm text-muted-foreground">© 2026 TemuAnak. Semua hak dilindungi.</p>
          <p className="text-xs text-muted-foreground">
            Dibuat dengan ❤️ untuk orang tua Indonesia.
          </p>
        </div>
      </Container>
    </footer>
  );
}
