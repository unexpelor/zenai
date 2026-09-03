# FAQ & Troubleshooting ZenAI

Dokumen ini menjadi panduan bantuan ketika pengguna atau pengembang mengalami kendala saat menjalankan ZenAI.

## A. Masalah Penggunaan

### 1. AI tidak memberikan hasil
**Kemungkinan penyebab:** layanan AI eksternal tidak tersedia, konfigurasi API belum lengkap, request terlalu besar, atau terjadi timeout.

**Langkah penanganan:**
1. Periksa kembali input dan coba dengan konteks yang lebih ringkas.
2. Gunakan Health Check untuk melihat status layanan.
3. Jika masalah hanya terjadi pada satu provider, sistem text AI memiliki urutan fallback Groq → OpenRouter → Gemini.
4. Jika semua provider gagal, ulangi setelah layanan tersedia.

### 2. Market Insight tidak muncul
**Kemungkinan penyebab:** layanan pencarian eksternal Tavily tidak tersedia atau kredensial belum dikonfigurasi.

**Langkah penanganan:**
1. Periksa konfigurasi `TAVILY_API_KEY`.
2. Jalankan Health Check.
3. Pastikan konteks usaha cukup jelas agar query yang dihasilkan relevan.
4. Jangan menganggap hasil pencarian sebagai fakta final tanpa memeriksa sumber yang ditampilkan.

### 3. Data pengguna tidak kembali setelah membuka aplikasi
Persistence bergantung pada konfigurasi Supabase dan status autentikasi. Periksa login, koneksi Supabase, dan konfigurasi environment.

### 4. Upload gambar/audio gagal
Periksa ukuran file dan format yang didukung browser/aplikasi. Implementasi API memiliki batas payload media; jika file terlalu besar, kecilkan ukuran file lalu coba kembali.

### 5. Aplikasi terlihat berbeda pada perangkat tertentu
Pastikan browser menggunakan versi yang relatif baru. Uji layout pada desktop dan perangkat mobile. Catat perangkat, browser, ukuran layar, serta langkah yang menyebabkan masalah.

## B. Masalah Pengembangan

### Environment belum terbaca
Pastikan file `.env.local` tersedia dan nama variable sesuai `.env.example`. API key provider harus berada di server dan tidak ditulis ke client-side code.

### Supabase tidak menyimpan state
Periksa:
- URL dan publishable key Supabase;
- schema `supabase_schema.sql` sudah diterapkan;
- autentikasi berhasil;
- policy RLS menggunakan user yang sedang login.

### Build gagal
Jalankan secara berurutan:

```bash
npm install
npm run build
npm start
```

Jika gagal, simpan pesan error lengkap, versi Node.js/npm, sistem operasi, dan langkah reproduksi untuk laporan bug.

## C. Format Laporan Bug

Gunakan format berikut agar masalah mudah ditelusuri:

- **Judul:**
- **Perangkat/browser:**
- **Tanggal & waktu:**
- **Kondisi awal:**
- **Langkah reproduksi:**
- **Hasil yang diharapkan:**
- **Hasil aktual:**
- **Pesan error:**
- **Screenshot/video:**
- **Frekuensi kejadian:** sekali / kadang / selalu

## D. Prinsip Penanganan

Jangan memasukkan API key, token autentikasi, password, atau data pribadi ke dalam laporan bug, screenshot, atau repository.
