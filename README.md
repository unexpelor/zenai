# ZenAI

**ZenAI — Pahami. Putuskan. Tumbuh.**

ZenAI adalah aplikasi web berbasis Next.js yang membantu pengguna memahami kondisi usaha melalui AI, diagnosis usaha, market insight, strategi dan tindakan, business updates, serta pencatatan keuangan sederhana.

## Konsep

ZenAI dirancang sebagai pendamping pengambilan keputusan usaha. Alur utamanya:

**Ceritakan Usaha → Business Pulse → Diagnosis → Market Insight → Business Autopilot → Business Updates → Evaluasi**

## Fitur Utama

- **Ceritakan Usaha** — memasukkan konteks usaha melalui input yang didukung aplikasi.
- **Business Pulse** — ringkasan kondisi dan prioritas usaha.
- **Diagnosis** — analisis masalah, kekuatan, peluang, rekomendasi, dan langkah berikutnya.
- **Market Insight** — pencarian informasi pasar eksternal melalui Tavily dan analisis AI.
- **Business Autopilot** — pembuatan strategi/action plan 7, 14, atau 30 hari.
- **Business Updates** — pencatatan perkembangan terbaru usaha.
- **Laporan Keuangan** — pencatatan transaksi dan ringkasan kondisi keuangan sederhana.
- **History & Settings** — pengelolaan riwayat dan preferensi yang tersedia.
- **Health Check** — pemeriksaan layanan utama untuk kebutuhan diagnostik/demo.

## Teknologi

- Next.js 15
- React 19
- Supabase
- Gemini
- Groq
- OpenRouter
- Tavily

## AI Router

### Text

**Groq → OpenRouter → Gemini**

Jika provider pertama gagal, router mencoba provider berikutnya.

### Image / Audio

Gemini digunakan untuk input gambar dan audio pada implementasi saat ini.

## Quick Start

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm start
```

## Environment

Salin `.env.example` menjadi `.env.local`, lalu isi credential yang diperlukan.

Jangan pernah commit `.env`, `.env.local`, atau API key ke repository.

Environment utama:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `GROQ_API_KEY`
- `OPENROUTER_API_KEY`
- `GEMINI_API_KEY`
- `TAVILY_API_KEY`
- `ZENAI_ALLOW_UNAUTHENTICATED_API` (development-only bypass)

## Supabase

Jalankan `supabase_schema.sql` pada Supabase SQL Editor. Persistence menggunakan tabel `public.zenai_user_state` dengan Row Level Security berdasarkan `auth.uid() = user_id`.

## Security Baseline

- server-side API authentication pada environment production;
- bearer token Supabase diverifikasi pada server;
- provider API keys hanya dibaca server-side;
- batas ukuran payload/prompt/media;
- rate limiting in-memory per user/IP;
- security headers dasar;
- RLS pada `zenai_user_state`.

## Dokumentasi & Bantuan

Dokumentasi ZenAI dibuat untuk pengguna, pengembang, penguji, dan kebutuhan demonstrasi. Selain user manual dan dokumentasi teknis, tersedia FAQ/troubleshooting, referensi fitur, panduan demo, indeks dokumentasi, dan release-readiness checklist.


Dokumentasi lengkap tersedia di folder `docs/`:

- `docs/README.md` — peta dokumentasi
- `docs/01_USER_MANUAL.md` — panduan pengguna
- `docs/02_ARCHITECTURE.md` — arsitektur sistem
- `docs/03_FLOWCHART.md` — flowchart aplikasi
- `docs/04_SECURITY.md` — keamanan & privasi
- `docs/05_TESTING.md` — test plan & evidence
- `docs/06_DEPLOYMENT.md` — deployment checklist
- `docs/07_COMPETITION_DOCUMENTATION_CHECKLIST.md` — checklist dokumentasi lomba
- `docs/08_FAQ_TROUBLESHOOTING.md` — FAQ dan troubleshooting
- `docs/09_DEMO_GUIDE.md` — panduan demo
- `docs/10_FEATURE_REFERENCE.md` — referensi fitur
- `docs/11_DOCUMENTATION_INDEX.md` — indeks dokumentasi
- `docs/12_RELEASE_READINESS.md` — checklist kesiapan rilis/submission

## Catatan Implementasi

Health Check menunjukkan kondisi layanan pada saat pemeriksaan dan bukan jaminan bebas bug. Hasil health check harus dilengkapi test case, regression test, security test, dan compatibility test.

Rate limiting saat ini bersifat in-memory per server instance. State utama menggunakan JSONB untuk kebutuhan MVP. Input gambar/audio menggunakan Gemini tanpa fallback media ke Groq/OpenRouter.
