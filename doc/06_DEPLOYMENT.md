# Deployment & Production Checklist

## 1. Install

```bash
npm install
```

## 2. Environment

Isi environment variables pada platform deployment. Jangan commit credential.

## 3. Database

Jalankan `supabase_schema.sql` pada Supabase SQL Editor dan pastikan RLS aktif.

## 4. Build

```bash
npm run build
```

Build harus selesai tanpa error.

## 5. Start

```bash
npm start
```

## 6. Smoke Test Setelah Deploy

- [ ] Landing/application dapat dibuka.
- [ ] Login berhasil.
- [ ] Business state dapat dimuat.
- [ ] Ceritakan Usaha berjalan.
- [ ] Diagnosis berjalan.
- [ ] Market Insight berjalan.
- [ ] Autopilot berjalan.
- [ ] Finance berjalan.
- [ ] Logout berjalan.
- [ ] Health Check dapat diperiksa.
- [ ] Tidak ada API key yang tampil pada client.
- [ ] Light mode terbaca.
- [ ] Dark mode terbaca.

## 7. Demo Reliability

Karena aplikasi menggunakan layanan eksternal, siapkan akun demo, environment yang sudah diuji, koneksi internet cadangan, dan video/screenshot fallback sebagai bukti pendukung. Video tidak menggantikan demo interaktif, tetapi berguna ketika terjadi gangguan eksternal.
