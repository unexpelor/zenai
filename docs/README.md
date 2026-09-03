# Dokumentasi ZenAI

ZenAI adalah aplikasi web berbasis Next.js yang membantu pengguna memahami kondisi usaha, memperoleh diagnosis, melihat perspektif pasar, menyusun rencana tindakan, mencatat perkembangan usaha, dan memantau kondisi keuangan sederhana.

## 1. Tujuan Produk

ZenAI dirancang sebagai pendamping pengambilan keputusan usaha berbasis AI. Alur utamanya adalah:

**Ceritakan Usaha → Business Pulse → Diagnosis → Market Insight → Business Autopilot → Business Updates → Evaluasi**

Pendekatan ini menempatkan AI sebagai bagian dari alur kerja keputusan, bukan hanya sebagai chatbot percakapan.

## 2. Fitur Utama

| Modul | Fungsi |
|---|---|
| Ceritakan Usaha | Memasukkan konteks usaha melalui teks dan input media yang didukung aplikasi. |
| Business Pulse | Merangkum kondisi usaha dan prioritas utama. |
| Diagnosis | Menganalisis masalah, kekuatan, peluang, rekomendasi, dan langkah berikutnya. |
| Market Insight | Mengambil informasi pasar eksternal melalui Tavily dan mengolahnya menjadi perspektif yang relevan bagi usaha. |
| Business Autopilot | Mengubah kondisi/tujuan usaha menjadi rencana tindakan 7, 14, atau 30 hari. |
| Business Updates | Mencatat perkembangan atau kondisi terbaru usaha. |
| Laporan Keuangan | Mencatat transaksi dan menampilkan ringkasan kondisi keuangan sederhana. |
| History | Menyimpan/menampilkan riwayat yang tersedia dalam aplikasi. |
| Pengaturan | Mengatur preferensi aplikasi dan tindakan pengelolaan data yang tersedia. |
| Health Check | Memeriksa kondisi layanan utama ketika environment dan autentikasi tersedia. |

## 3. Arsitektur Singkat

```text
Browser
  │
  ├── Next.js / React UI
  │       ├── Business modules
  │       ├── Finance
  │       ├── Settings
  │       └── History
  │
  └── API Routes
          ├── /api/ai
          │      ├── Groq
          │      ├── OpenRouter
          │      └── Gemini
          ├── /api/autopilot
          ├── /api/marketplace
          │      └── Tavily
          └── /api/health

Supabase
  ├── Authentication
  └── zenai_user_state (JSONB + RLS)
```

## 4. AI Router

### Teks

Urutan fallback:

**Groq → OpenRouter → Gemini**

Jika provider pertama gagal, router mencoba provider berikutnya.

### Gambar / Audio

Input gambar dan audio menggunakan Gemini pada implementasi saat ini. Fallback media ke Groq/OpenRouter belum tersedia.

## 5. Data dan Persistensi

State pengguna disimpan pada tabel `public.zenai_user_state` ketika Supabase aktif dan pengguna terautentikasi.

Kolom utama:

- `user_id`: UUID pengguna dari Supabase Auth.
- `state`: JSONB berisi state aplikasi pengguna.
- `updated_at`: waktu pembaruan.

Row Level Security membatasi akses berdasarkan `auth.uid() = user_id`.

## 6. Keamanan

Proteksi yang tersedia pada implementasi saat ini:

- autentikasi server-side pada API yang membutuhkan sesi;
- access token dikirim melalui header Authorization;
- API key provider hanya dibaca dari server environment;
- batas ukuran payload/prompt/media pada route yang relevan;
- rate limiting in-memory per pengguna/IP;
- error response tidak dirancang untuk mengembalikan API key/provider secret;
- security headers dasar melalui `next.config.mjs`;
- Supabase RLS pada state pengguna.

**Catatan:** rate limiting saat ini bersifat per server instance, sehingga belum merupakan distributed rate limit.

## 7. Konfigurasi Environment

Lihat `.env.example` untuk nama environment variable yang digunakan. Jangan menyimpan credential asli di GitHub.

Environment yang digunakan meliputi:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `GROQ_API_KEY`
- `OPENROUTER_API_KEY`
- `GEMINI_API_KEY`
- `TAVILY_API_KEY`
- `ZENAI_ALLOW_UNAUTHENTICATED_API` untuk development-only bypass sesuai aturan di source.

## 8. Instalasi Lokal

```bash
npm install
npm run dev
```

Untuk production build:

```bash
npm run build
npm start
```

## 9. Database

Jalankan isi `supabase_schema.sql` satu kali pada Supabase SQL Editor. Pastikan RLS aktif dan environment Supabase telah dikonfigurasi.

## 10. Batasan yang Diketahui

Dokumentasi ini tidak menyatakan seluruh fitur telah lulus pengujian formal. Sebelum lomba, hasil pengujian aktual perlu dicatat pada `05_TESTING.md`.

Batasan implementasi yang diketahui:

1. input gambar/audio menggunakan Gemini tanpa fallback media;
2. rate limiting masih in-memory per server instance;
3. state utama menggunakan satu JSONB sehingga belum dipisah menjadi tabel domain terstruktur;
4. health check hanya menunjukkan kondisi layanan saat pemeriksaan, bukan jaminan bebas bug;
5. jika Supabase tidak dikonfigurasi, sebagian state hanya bertahan selama sesi browser sesuai implementasi aplikasi.

## 11. Struktur Repository

```text
app/
  api/
    ai/
    autopilot/
    health/
    marketplace/
  globals.css
  layout.js
  page.js
components/
  BusinessGrowthLoop.jsx
lib/
  api-security.js
  supabase/client.js
public/
  zenai-logo.png
  zenai-mark.png
docs/
supabase_schema.sql
next.config.mjs
package.json
README.md
```
