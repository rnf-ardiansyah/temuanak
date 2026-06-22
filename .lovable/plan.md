## Masalah

Error `Unsupported phone provider` muncul karena **provider SMS belum dikonfigurasi** di backend auth. Supabase tidak mengirim SMS sendiri — butuh provider pihak ketiga (Twilio, MessageBird, Vonage, dll) yang berbayar dan harus diatur manual di dashboard Auth. Sampai itu dikonfigurasi, semua percobaan OTP via nomor HP akan gagal dengan error tersebut, berapapun benarnya nomornya.

Ini sudah dicatat di `.lovable/plan.md` sebagai keterbatasan, tapi UI masih menampilkan tab "Nomor HP" sehingga user tetap bisa mencoba dan kena error.

## Pilihan Perbaikan

Karena SMS provider tidak bisa diaktifkan dari sisi Lovable (butuh akun Twilio/dll milik kamu sendiri), ada 2 jalan:

### Opsi A — Sembunyikan login HP (rekomendasi, langsung jalan)

- Hapus tab "Nomor HP" di `src/routes/auth.tsx`, sisakan **Email OTP** saja.
- Sederhanakan layout jadi satu input email (tanpa tabs).
- Tambah opsi login **Google** (sekali klik, tanpa OTP) supaya tetap ada alternatif cepat selain email.
- Halaman `/auth/verify` tetap dipakai untuk Email OTP — hapus cabang `phone` di kode.
- Update `.lovable/plan.md`: SMS OTP ditunda sampai provider dikonfigurasi.

Hasil: tidak ada lagi error "Unsupported phone provider", user punya 2 cara masuk (Email OTP + Google).

### Opsi B — Pertahankan tab HP tapi disable + tampilkan pesan

- Tab "Nomor HP" tetap terlihat tapi dinonaktifkan dengan badge "Segera hadir".
- Tidak perlu setup provider, tapi UX kurang bersih.

### Opsi C — Aktifkan SMS beneran (perlu aksi kamu)

- Kamu harus daftar Twilio (atau provider lain), dapatkan Account SID + Auth Token + nomor pengirim, lalu masukkan ke pengaturan Auth → Phone Provider di dashboard backend.
- Setelah itu kode HP yang sudah ada akan langsung jalan tanpa perubahan.
- Biaya SMS per pesan ditanggung di akun Twilio kamu.

## Rekomendasi

**Jalankan Opsi A sekarang** (perbaikan langsung, tidak ada error lagi, ditambah Google sign-in sebagai pengganti yang lebih cepat dari SMS). Kalau nanti kamu sudah punya akun Twilio, kita aktifkan lagi tab HP dengan Opsi C.

## Perubahan File (kalau Opsi A disetujui)

- `src/routes/auth.tsx` — hapus tabs, sisakan form email + tombol "Lanjut dengan Google".
- `src/routes/auth.verify.tsx` — hapus cabang `phone`, search param jadi `{ email: string }`.
- `src/lib/format.ts` — `normalizePhone`/`phoneRegex` tetap dipakai untuk form anak, tidak dihapus.
- `.lovable/plan.md` — catat keputusan.
- Backend: aktifkan Google provider via tool integrasi (sekali klik).

Pilih opsi mana?
