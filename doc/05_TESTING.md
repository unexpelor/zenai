# Final Testing Report — ZenAI

Dokumen ini mencatat hasil pengujian final ZenAI untuk kebutuhan submission dan demo. Seluruh skenario T01–T25 telah diuji pada deployment yang digunakan dan bukti screenshot telah tersedia.

| ID | Area | Skenario | Expected Result | Status | Evidence |
|---|---|---|---|---|---|
| T01 | Auth | Register user | User berhasil dibuat | PASS | Screenshot |
| T02 | Auth | Login valid | Masuk ke aplikasi | PASS | Screenshot |
| T03 | Auth | Token invalid | API menolak request | PASS | Screenshot/Log |
| T04 | Capture | Input teks usaha | Konteks usaha diproses | PASS | Screenshot |
| T05 | Capture | Input gambar | Gemini memproses input | PASS | Bukti ada di folder `screenshots/` |
| T06 | Capture | Input audio | Gemini memproses input | PASS | Screenshot |
| T07 | Pulse | Generate Business Pulse | Ringkasan tampil | PASS | Screenshot |
| T08 | Diagnosis | Generate diagnosis | Diagnosis tampil terstruktur | PASS | Screenshot |
| T09 | Market | Market Insight aktif | Hasil/sumber pasar tampil | PASS | Screenshot |
| T10 | Autopilot | Plan 7 hari | Action plan tampil | PASS | Screenshot |
| T11 | Autopilot | Plan 14 hari | Action plan tampil | PASS | Screenshot |
| T12 | Autopilot | Plan 30 hari | Action plan tampil | PASS | Screenshot |
| T13 | Updates | Tambah business update | Update tersimpan/terlihat | PASS | Screenshot |
| T14 | Finance | Tambah transaksi | Ringkasan berubah sesuai input | PASS | Screenshot |
| T15 | Persistence | Refresh setelah login | State tetap sesuai persistence | PASS | Screenshot |
| T16 | RLS | User A akses state User B | Ditolak | PASS | Supabase evidence |
| T17 | Reset | Reset data | Data yang ditargetkan terhapus | PASS | Screenshot |
| T18 | Theme | Light mode | Text/UI terbaca | PASS | Screenshot |
| T19 | Theme | Dark mode | Text/UI terbaca | PASS | Screenshot |
| T20 | Responsive | Desktop Chrome | Layout berfungsi | PASS | Screenshot |
| T21 | Responsive | Android Chrome | Layout berfungsi | PASS | Screenshot |
| T22 | Responsive | iOS Safari | Layout berfungsi | PASS | Screenshot |
| T23 | Failure | Provider AI utama gagal | Fallback berjalan | PASS | Log/Video |
| T24 | Failure | Tavily gagal | Error ditangani dengan jelas | PASS | Screenshot |
| T25 | Health | Live Health Check | Status layanan sesuai kondisi | PASS | Screenshot |

## Ringkasan

T01–T25 adalah acceptance scenarios. Status PASS pada tabel harus didukung bukti eksekusi aktual dari deployment/evidence. Automated regression dijalankan dari source final menggunakan script di `scripts/`.

## Bukti Pengujian

Bukti screenshot testing telah disiapkan dan disimpan bersama paket evidence lomba. Bukti mencakup modul utama, login/persistence, light/dark mode, Market Insight, Autopilot, Finance, Health Check, dan pengujian respons/error.

## Production Validation

Validasi production harus dicatat ulang pada environment submission. Jangan menyatakan `npm ci`, `npm run build`, atau deployment PASS tanpa log/evidence aktual.

## Automated Regression

- P1/P2/locale regression: jalankan `node scripts/p1-static-test.mjs`, `node scripts/p2-static-test.mjs`, dan `node scripts/locale-regression-static-test.mjs` dari root project sebelum submission.

Automated regression digunakan sebagai pemeriksaan tambahan dan tidak menggantikan pengujian T01–T25 pada deployment.
