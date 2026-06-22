## Kondisi Saat Ini

Backend auth bawaan (Supabase Auth) hanya bisa kirim SMS OTP kalau **provider SMS pihak ketiga** sudah dipasang di pengaturan Auth. Itu sebabnya muncul `Unsupported phone provider` — bukan bug kode, tapi memang belum ada yang mengirim SMS-nya. Tidak ada cara untuk "mengaktifkan SMS OTP tanpa provider" — kalau dipaksa, error pasti muncul.

Ada 2 cara realistis. Salah satunya harus dipilih, karena keduanya butuh aksi/keputusan kamu.

---

## Opsi 1 — SMS OTP via Twilio (jalur "native", paling rapi)

Pakai pengaturan Phone Provider bawaan Supabase Auth + akun Twilio kamu. Setelah disetel sekali, tab "Nomor HP" + OTP 6 digit langsung jalan tanpa ubah kode aplikasi.

**Yang kamu perlu siapkan (sekali saja):**
1. Daftar/Login ke [twilio.com](https://www.twilio.com).
2. Beli 1 nomor pengirim (Twilio phone number) — atau aktifkan Messaging Service.
3. Catat 3 nilai dari Twilio Console:
   - `Account SID`
   - `Auth Token`
   - `Messaging Service SID` **atau** nomor pengirim (E.164, mis. `+1415xxxxxxx`)
4. Aktifkan **SMS Pumping Protection** + atur **SMS Geo Permissions** ke Indonesia saja (cegah fraud).

**Yang aku kerjakan setelah kamu kirim 3 nilai itu:**
- Aktifkan provider Phone (Twilio) di backend auth.
- Kembalikan tab "Nomor HP" di `src/routes/auth.tsx` (dua tab: Email / HP).
- Tambah cabang `phone` di `src/routes/auth.verify.tsx` (search param jadi `{ type, value }` lagi).
- Trigger `handle_new_user` sudah mengisi `profiles.phone` dari `auth.users.phone`, jadi tidak ada perubahan DB.
- Tes kirim OTP ke nomor kamu sendiri.

**Biaya:** ditanggung saldo Twilio kamu. SMS Indonesia ± USD 0.04–0.08 per pesan.

---

## Opsi 2 — OTP WhatsApp via Twilio (kirim via WA, bukan SMS)

Lebih murah, lebih sesuai konteks Indonesia, tapi butuh **WhatsApp Business** terverifikasi di Twilio (proses 1–3 hari). Karena Supabase Auth tidak punya "WhatsApp provider" native, alurnya custom:

- Server function `requestWaOtp` → generate 6 digit kode, simpan di tabel `phone_otps` (hash + expires_at), kirim via Twilio WhatsApp API (sudah ada connector Twilio di Lovable).
- Server function `verifyWaOtp` → cocokkan kode → buat session lewat Supabase Auth Admin (`signInWithOtp` magic, atau `signInAnonymously` + link, atau bikin user manual). Ini lebih kompleks dari Opsi 1.

Aku tidak rekomendasi ini sebagai langkah pertama — lebih banyak moving parts dan risiko bug.

---

## Rekomendasi

**Jalankan Opsi 1.** Paling cepat, paling stabil, tidak ada workaround.

## Langkah dari Kamu Sekarang

Balas dengan salah satu:

- **"Lanjut Opsi 1"** — kamu setuju siapkan Twilio. Aku akan kirim instruksi langkah-demi-langkah cara dapat `Account SID` + `Auth Token` + nomor pengirim di Twilio Console. Setelah kamu paste ke chat, aku simpan sebagai secret + konfigurasi provider + kembalikan UI tab HP.
- **"Lanjut Opsi 2"** — kita masuk jalur WhatsApp custom (lebih lama).
- **"Pakai provider lain"** — sebut nama provider (MessageBird, Vonage, dll), aku adaptasi.

Tanpa salah satu dari ketiganya, "aktifkan tanpa error sedikitpun" secara teknis tidak mungkin — provider SMS wajib ada.
