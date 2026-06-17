# TemuAnak — Landing Page Plan

A single-page, conversion-focused SaaS landing in Bahasa Indonesia, built on the existing TanStack Start + Tailwind v4 stack. The spec is already very detailed (colors, typography, sections, copy), so this plan locks in structure, file layout, and a few design decisions — no backend, no auth, no QR generation logic. Pure marketing site.

## Scope

In scope:
- One route: `/` (replace placeholder in `src/routes/index.tsx`)
- Sticky top navigation + 13 content sections + footer
- Design tokens for the TemuAnak palette in `src/styles.css`
- Inter font loaded via `<link>` in `__root.tsx` head
- SEO metadata on the index route (title, description, OG, Twitter)
- Scroll-reveal + hover micro-interactions using CSS/Tailwind animations
- Lucide icons throughout, no external illustration libs
- Fully responsive (mobile-first, 12-col grid, max-w 1440 / container 1280)

Out of scope (not requested):
- Actual auth, OTP, QR generation, WhatsApp deep-link wiring (CTAs are visual only, link to `#` anchors)
- Lovable Cloud / database / payments
- i18n switcher (copy stays Indonesian as written)
- Dark mode (spec defines a single light palette)

## Design system

Add tokens to `src/styles.css` under `@theme inline` + `:root`, all in `oklch` for consistency with the existing file. Map the requested hex values:

- `--background` ← #FAFAF8
- `--surface-soft` ← #DCEEFF (new token, for hero/cards/section backgrounds)
- `--primary` ← #2563EB, `--primary-foreground` ← white
- `--whatsapp` ← #22C55E (new), `--success` ← #22C55E
- `--danger` / `--destructive` ← #EF4444
- `--warning` ← #F59E0B
- `--foreground` ← #111827, `--muted-foreground` ← #6B7280, `--secondary-foreground` ← #4B5563
- `--border` ← #E5E7EB
- `--radius` ← 1.5rem (24px)
- Soft shadow tokens: `--shadow-card`, `--shadow-elevated` (Material 3 / Apple feel)

Typography:
- Load Inter (weights 400/500/600/700/800) via `<link>` in `__root.tsx`
- `--font-sans: "Inter", "SF Pro Display", system-ui, sans-serif`
- Scale via utility classes: hero `text-6xl md:text-7xl font-extrabold tracking-tight`, section `text-4xl md:text-5xl font-bold tracking-tight`, card `text-2xl font-bold`, body `text-lg`, small `text-sm font-medium`
- Line height 150% via `leading-[1.5]` defaults

Layout primitives:
- `Container` wrapper: `mx-auto w-full max-w-[1280px] px-6 lg:px-8`
- Bento grids: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (some sections `lg:grid-cols-4` or `lg:grid-cols-6` with `col-span` variations for rhythm)
- Card base: `rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] p-6 md:p-8`

## File layout

```text
src/
  routes/
    index.tsx                    # head() metadata + composes sections
  components/
    landing/
      Nav.tsx                    # sticky, blurred, CTA on right
      Hero.tsx                   # Section 1
      TrustBar.tsx               # Section 2
      Problem.tsx                # Section 3 (bento)
      Solution.tsx               # Section 4 (3-step timeline)
      HowItWorks.tsx             # Section 5 (bento A–F)
      Features.tsx               # Section 6 (8-card bento)
      QrDemo.tsx                 # Section 7 (QR + profile preview)
      Benefits.tsx               # Section 8 (4 Apple-style cards)
      Personas.tsx               # Section 9 (4 persona cards)
      SocialProof.tsx            # Section 10 (testimonials + stats)
      Pricing.tsx                # Section 11 (Free vs Premium)
      Faq.tsx                    # Section 12 (accordion, shadcn)
      FinalCta.tsx               # Section 13 (#2563EB band)
      Footer.tsx
      primitives/
        Container.tsx
        SectionHeading.tsx
        BentoCard.tsx
        StatBlock.tsx
        PhoneMockup.tsx          # used in Hero
        QrPlaceholder.tsx        # SVG QR-looking grid
  styles.css                     # extended with TemuAnak tokens
  routes/__root.tsx              # add Inter <link>, keep shell intact
```

Reuse existing shadcn `accordion` for FAQ and `button` for CTAs (restyled via className, not new variants, to keep scope tight).

## Section-by-section notes

1. **Hero** — Two-column at `lg`, single column on mobile. Left: badge "MVP 2026", H1 headline, subheadline, two CTAs (primary `#2563EB`, secondary outline). Right: `PhoneMockup` containing `QrPlaceholder` and a child profile card; two floating cards (WhatsApp pill, "QR Aktif" pill) absolutely positioned with soft shadows and subtle glass effect (`backdrop-blur` + translucent white).
2. **Trust bar** — 4-col grid on `md+`, stacked on mobile, check icons in primary color, thin top/bottom border.
3. **Problem** — Bento: one large card (col-span-2) + three smaller. Includes two stat-style blocks ("Menit pertama = paling kritis", etc.) for rhythm.
4. **Solution** — 3 numbered cards on a horizontal timeline with connecting dotted line on `lg+`.
5. **How It Works** — 6-card bento using a 6-col grid: A (span 3), B (span 3), C (span 2), D (span 2), E (span 2), F (span 6 short banner). Lucide line icons.
6. **Features** — 8-card bento, asymmetric: one feature card spans 2 cols as the "hero feature" (QR Otomatis). Each card: icon chip, title, description, benefit line in muted color.
7. **QR Demo** — Two-column. Left: large QR placeholder in a rounded card. Right: profile preview with avatar placeholder, name, age, "ciri khas", and three buttons (WhatsApp green, Call blue, Disable red).
8. **Benefits** — 4 Apple-style cards in a 2×2 grid on `md`, 4-col on `lg`, generous padding, large icons.
9. **Personas** — 4 persona cards with gradient placeholder image (CSS gradient, no external assets), role title, one-liner.
10. **Social Proof** — Stat strip (3 big numbers) + 3 testimonial cards with avatar initials, 5-star row.
11. **Pricing** — 2 cards side by side, Premium card elevated (`shadow-elevated`, ring in primary, "Populer" badge).
12. **FAQ** — shadcn `Accordion` with 5 items, single-open.
13. **Final CTA** — Full-bleed band, background `#2563EB`, white text, two CTAs (white primary, ghost secondary).

**Nav** — Sticky, `backdrop-blur`, logo wordmark "TemuAnak" with small shield/QR mark, anchor links (Fitur, Cara Kerja, Harga, FAQ), primary CTA "Buat QR Gratis". Mobile: hamburger → sheet (use existing `sheet` component).

**Footer** — 4 columns (Produk, Perusahaan, Bantuan, Kontak) + bottom row with © 2026 TemuAnak and social icons.

## Interactions

- Scroll reveal via a tiny CSS-only approach: `animate-fade-in` (already defined in the prompt's animation utilities) applied with `IntersectionObserver` in a small `useReveal` hook, or simpler — add `animate-fade-in` with `motion-safe:` and rely on initial paint. Plan: implement a 20-line `useReveal` hook that toggles a `data-revealed` attribute, with CSS transitioning `opacity` and `translate-y`. Keeps bundle lean, no Framer Motion dependency.
- Hover: cards lift with `hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] transition`.
- Buttons: `transition active:scale-[0.98]`, focus rings using `--ring`.

## Technical notes

- `src/routes/index.tsx`: replace placeholder body with `<Nav /> <main>…all sections…</main> <Footer />`. Update `head()` with TemuAnak title (`TemuAnak — QR Darurat untuk Anak`), Indonesian meta description under 160 chars, OG/Twitter tags.
- All imports must resolve before save: create each component file in the same change set.
- No new npm dependencies; Lucide and shadcn primitives are already in the project.
- Accessibility: semantic landmarks (`header`, `main`, `section` with `aria-labelledby`, `footer`), single `<h1>` in Hero, all interactive elements keyboard-reachable, color contrast verified against `#FAFAF8` and `#DCEEFF` backgrounds.
- SEO: descriptive alt text on every decorative-but-meaningful element; purely decorative SVGs get `aria-hidden`.

## Deliverable

A polished, responsive single-page landing at `/` with the full 13-section structure, ready to publish. No backend wiring; CTAs are visual placeholders pointing to `#hero` / `#` anchors that can be wired up later.