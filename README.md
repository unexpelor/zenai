# ZenAI

ZenAI adalah aplikasi web berbasis Next.js yang membantu pengguna memahami kondisi usaha melalui AI, diagnosis usaha, market insight, strategi dan tindakan, serta pencatatan keuangan.

## Fitur Utama

- Ceritakan Usaha — input teks, gambar, dan voice note/audio.
- Business Pulse — ringkasan kondisi dan prioritas usaha.
- Diagnosis — analisis masalah, kekuatan, peluang, rekomendasi, dan langkah berikutnya.
- Market Insight — pencarian informasi pasar eksternal melalui Tavily dan analisis terstruktur oleh AI.
- Business Autopilot — pembuatan strategi dan action plan 7, 14, atau 30 hari.
- Laporan Keuangan — pencatatan transaksi dan ringkasan kondisi keuangan.
- Business Updates — pencatatan perkembangan/kondisi terbaru usaha.
- Supabase Auth & Cloud Persistence — autentikasi dan penyimpanan state pengguna ketika Supabase dikonfigurasi.

## AI Router

### Text

Groq → OpenRouter → Gemini

Jika provider pertama gagal, router mencoba provider berikutnya.

### Image / Audio

Gemini

Input gambar dan audio saat ini menggunakan Gemini. Tidak ada fallback media ke Groq/OpenRouter pada implementasi terbaru.

## Teknologi

- Next.js
- React
- Supabase
- Gemini
- Groq
- OpenRouter
- Tavily

## Konfigurasi

Salin `.env.example` menjadi `.env.local`, lalu isi credential yang diperlukan.

**Jangan pernah commit `.env`, `.env.local`, atau API key ke repository.**

Minimal satu provider AI teks diperlukan untuk fitur AI teks. Gemini diperlukan untuk input gambar/audio. Tavily diperlukan untuk Market Insight.

## Supabase

Client menggunakan:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Database schema tersedia pada `supabase_schema.sql`.

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan oleh Next.js pada terminal.

## Build Production

```bash
npm run build
npm start
```

## Catatan Keamanan

API key provider AI dan Tavily harus disimpan sebagai environment variable server-side. Repository ini tidak menyertakan credential asli.

Sebelum deployment production, lakukan audit authentication/authorization pada route API, rate limiting, validasi payload media, dan pengujian keamanan.


## Security baseline

API AI, Autopilot, dan Market Insight memerlukan sesi Supabase yang valid pada environment production. Client mengirim access token pada header `Authorization: Bearer ...`, lalu server memverifikasinya melalui Supabase Auth.

Proteksi yang sudah diterapkan:
- server-side API authentication
- rate limiting per pengguna + IP (in-memory per server instance)
- batas ukuran prompt, gambar, audio, dan payload bisnis
- API key provider hanya dibaca dari server environment variables
- error response tidak mengembalikan detail provider/API key ke client
- security headers dasar melalui `next.config.mjs`
- Supabase Row Level Security pada `zenai_user_state`

### Development-only bypass

Jika benar-benar diperlukan untuk pengembangan lokal tanpa Supabase, `ZENAI_ALLOW_UNAUTHENTICATED_API=true` dapat digunakan hanya ketika `NODE_ENV` bukan production. Jangan aktifkan opsi ini pada deployment production.

## Production checklist

- [ ] Isi seluruh API key melalui platform deployment secret/environment variables, bukan melalui GitHub.
- [ ] Pastikan `ZENAI_ALLOW_UNAUTHENTICATED_API` tidak aktif di production.
- [ ] Jalankan SQL pada `supabase_schema.sql` dan pastikan RLS aktif.
- [ ] Uji login, API authentication, rate limit, dan logout.
- [ ] Uji Android Chrome, iOS Safari, dan desktop browser.
- [ ] Jika secret pernah terlanjur masuk Git history, revoke/rotate secret tersebut; `.gitignore` tidak menghapus secret dari history.


## Data Keuangan dan Privasi
- Transaksi keuangan tidak disimpan ke `localStorage`.
- Saat Supabase aktif dan pengguna login, transaksi disimpan sebagai bagian dari `zenai_user_state` milik user tersebut.
- Row Level Security (RLS) membatasi akses record berdasarkan `auth.uid() = user_id`.
- Jika Supabase tidak dikonfigurasi, data keuangan hanya berada di memory selama sesi browser dan tidak dipersistenkan.
- Data lama yang pernah tersimpan pada key `zenai_finance_transactions` di browser tidak otomatis diimpor.
