# TemuAnak — Rencana Pembangunan Aplikasi (5 Sprint)

Landing page sudah ada di `/`. Rencana ini menambahkan aplikasi web (dashboard + QR publik) di atas stack yang sudah terpasang.

## Catatan Penyesuaian Stack

Beberapa item dalam brief perlu disesuaikan dengan stack proyek ini (bukan diabaikan, hanya dipetakan ke setara terbaiknya):

- **Routing**: proyek ini memakai **TanStack Start** (file-based routing di `src/routes/`), bukan React Router. Semua "pages" akan jadi route files.
- **Backend**: pakai **Lovable Cloud** (Supabase terkelola) — perlu diaktifkan via tool di awal Sprint 1. ENV `VITE_SUPABASE_*` otomatis di-inject.
- **Auth OTP**: Supabase mendukung **Email OTP** & **Phone OTP (SMS)** secara native. "WhatsApp OTP" tidak didukung tanpa provider pihak ketiga berbayar (Twilio WhatsApp/MessageBird). **Default: Email OTP + Phone OTP (SMS).** WhatsApp OTP dicatat sebagai upgrade opsional nanti.
- **Deploy**: Lovable hosting (bukan Vercel) — sudah otomatis.
- **State**: pakai **TanStack Query** (sudah terpasang) untuk server state, daripada menambah Zustand. Zustand hanya ditambahkan jika ada UI state global yang benar-benar butuh.

Semua warna, radius 24px, font Inter, dan bahasa Swiss/Apple/Material 3 dari landing page akan diteruskan ke dashboard.

---

## Sprint 1 — Fondasi & Cloud

1. Aktifkan **Lovable Cloud** (membuat Supabase project + inject ENV).
2. Tambahkan rute pathless `_authenticated/route.tsx` (managed gate, redirect ke `/auth`).
3. Layout:
   - `AppShell` (navbar + sidebar) untuk dashboard.
   - Loading skeleton + error boundary per-route.
4. Tema sudah ada di `src/styles.css`; tambahkan token surface dashboard (bento card, sidebar) selaras landing.
5. Tambahkan Sonner toast (sudah ada) ke root.
6. Setup `attachSupabaseAuth` middleware di `src/start.ts`.

**Output**: shell aplikasi siap, route terproteksi, toast & error handling global.

---

## Sprint 2 — Autentikasi OTP

1. Halaman `/auth` (publik): tab **Email** / **Nomor HP**, kirim OTP.
2. Halaman `/auth/verify`: 6-digit OTP input (shadcn `input-otp`), tombol resend dengan cooldown 60 detik.
3. Flow: `signInWithOtp` → `verifyOtp` → akun auto-dibuat → redirect ke `/dashboard`.
4. Tombol logout di sidebar (dengan cache teardown sesuai pedoman).
5. Trigger DB `handle_new_user` membuat row `profiles` otomatis.

**Tabel**: `profiles (id uuid PK → auth.users, full_name, phone, created_at)` + RLS.

**Output**: login passwordless penuh, sesi persisten, redirect otomatis.

---

## Sprint 3 — Manajemen Profil Anak

1. **Tabel `children`** sesuai brief + RLS (user hanya akses miliknya) + index `user_id`.
2. **Storage bucket `child-photos`** (private), RLS owner-only, validasi MIME (jpg/png/webp) ≤ 5 MB.
3. Routes (di bawah `_authenticated/`):
   - `/dashboard` — Bento grid: total anak, QR aktif, QR nonaktif, quick actions.
   - `/children` — daftar (card grid) + empty state ilustrasi.
   - `/children/new` — form (React Hook Form + Zod).
   - `/children/$id` — detail.
   - `/children/$id/edit` — form edit.
4. Field form: foto, nickname, umur, gender, ciri-ciri, kontak darurat, WhatsApp, catatan.
5. Validasi Zod: required, format HP Indonesia (`+62` / `08`), batas panjang.
6. Server functions: `listChildren`, `getChild`, `createChild`, `updateChild`, `deleteChild`, `uploadChildPhoto`.

**Output**: CRUD lengkap dengan upload foto & validasi.

---

## Sprint 4 — Sistem QR

1. **Tabel `qr_codes`** (id, child_id FK, token unique, active bool, created_at, view_count) + RLS owner.
2. Auto-generate token (12 char hex via `gen_random_bytes`) saat child dibuat (trigger DB).
3. Route `/children/$id` menampilkan QR (`qrcode.react`) + aksi:
   - **Download PNG** (canvas → blob).
   - **Copy URL**.
   - **Share** (Web Share API + fallback).
   - **Aktifkan / Nonaktifkan**.
   - **Regenerate** (token baru, invalidate yang lama).
4. URL publik: `https://<host>/qr/<token>`.

**Output**: manajemen QR lengkap dari dashboard.

---

## Sprint 5 — Halaman QR Publik + PWA + Analytics

1. **Route publik `/qr/$token`** (top-level, SSR on, tanpa auth):
   - Server fn `getPublicQr` pakai server publishable client + RLS `TO anon` SELECT join children (kolom aman saja: nickname, age, gender, description, photo_url, emergency_contact, whatsapp, active).
   - Tampilkan foto, nickname, umur, ciri-ciri, warning merah.
   - Tombol WhatsApp (hijau, `wa.me/<phone>?text=...`) & Call (biru, `tel:`).
   - Jika `active = false`: tampilan merah "QR ini sudah dinonaktifkan."
   - `head()` meta: noindex, title dinamis.
2. **Analytics ringan**: tabel `qr_views (qr_id, viewed_at, user_agent_hash)`, increment via server fn saat halaman dimuat. Counter ditampilkan di dashboard owner.
3. **PWA** (sesuai skill PWA, mode offline penuh karena diminta brief):
   - `vite-plugin-pwa` dengan registrasi terjaga (skip di preview Lovable).
   - Manifest: nama, icon (192/512), theme color `#2563EB`, background `#FAFAF8`, display standalone.
   - Service worker `NetworkFirst` untuk HTML, `CacheFirst` untuk asset hashed; `/~oauth` dikecualikan.
   - Shortcut: "Buat Profil Anak", "QR Saya".
4. SEO/perf check: meta tags, lazy load, Lighthouse audit.

**Output**: MVP siap produksi, terinstall di HP, halaman QR publik aman.

---

## Skema SQL (ringkas, akan dibuat lewat migrasi resmi)

```text
profiles(id uuid PK→auth.users, full_name, phone, created_at)
children(id uuid PK, user_id uuid FK→auth.users, nickname, age int,
         gender, description, photo_url, emergency_contact, whatsapp,
         active bool default true, created_at)
qr_codes(id uuid PK, child_id uuid FK→children, token text unique,
         active bool default true, created_at)
qr_views(id uuid PK, qr_id uuid FK→qr_codes, viewed_at, ua_hash)
```

RLS: semua tabel ON. Policy owner via `auth.uid() = user_id` (children) atau join. `qr_codes` + `children` punya policy publik terbatas `TO anon` SELECT hanya jika `qr_codes.active = true` dan hanya kolom yang dipakai halaman publik (lewat view `public_qr_view`).

---

## Pertanyaan Sebelum Mulai

1. **OTP**: setuju default **Email OTP + Phone (SMS) OTP**? WhatsApp OTP butuh akun Twilio berbayar — bisa ditambahkan nanti.
2. **Sprint pertama** saja dulu lalu review, atau kerjakan **Sprint 1 → 5 berurutan** tanpa jeda (sesuai instruksi brief)?
3. **Analytics**: tabel sederhana di Supabase cukup, atau ingin integrasi PostHog/Plausible?

Jawab 3 pertanyaan di atas → saya lanjut ke build mode mulai Sprint 1.

