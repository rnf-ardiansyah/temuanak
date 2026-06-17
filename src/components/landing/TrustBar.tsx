import { Check } from "lucide-react";
import { Container } from "./primitives/Container";

const items = [
  "Tanpa Install Aplikasi",
  "Scan Langsung dari Kamera",
  "QR Aktif Dalam 1 Menit",
  "Digunakan Orang Tua Indonesia",
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-card/60 py-6">
      <Container>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t) => (
            <li key={t} className="flex items-center gap-3 text-sm font-medium text-secondary-foreground">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
