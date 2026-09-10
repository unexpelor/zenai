# ZenAI Live Health Check

## Tujuan
Live Health Check digunakan saat demo untuk memverifikasi kondisi layanan utama ZenAI pada saat pemeriksaan dilakukan.

## Pemeriksaan
- Supabase Database: melakukan query terautentikasi terhadap state user.
- Groq: memverifikasi endpoint model provider merespons.
- OpenRouter: memverifikasi endpoint model provider merespons.
- Gemini: memverifikasi endpoint model provider merespons.
- Tavily: memverifikasi ketersediaan konfigurasi API key; tidak melakukan pencarian berbayar.
- Live AI Smoke Test: menjalankan request AI kecil melalui `/api/ai` untuk membuktikan jalur AI benar-benar dapat menghasilkan respons.

## Interpretasi status
- OPERATIONAL: pemeriksaan live berhasil.
- CONFIGURED: konfigurasi tersedia tetapi pemeriksaan konektivitas tidak dijalankan untuk layanan tersebut.
- DOWN: pemeriksaan gagal atau konfigurasi wajib tidak tersedia.

## Catatan
Health Check bukan jaminan aplikasi bebas bug. Ia adalah bukti kondisi layanan pada waktu pemeriksaan. Untuk membuktikan reliability secara menyeluruh, hasilnya harus dilengkapi test case, regression test, security test, dan compatibility test.
