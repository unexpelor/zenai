# Test Plan & Evidence

Dokumen ini disiapkan sebagai bukti proses pengujian. **Status PASS/FAIL untuk T01–T25 hanya boleh diisi berdasarkan pengujian nyata.** P1 menambahkan automated source checks untuk regression, sedangkan pengujian live/browser tetap membutuhkan deployment dengan environment/API aktif.

| ID | Area | Skenario | Expected Result | Status | Evidence |
|---|---|---|---|---|---|
| T01 | Auth | Register user | User berhasil dibuat | TODO | Screenshot/video |
| T02 | Auth | Login valid | Masuk ke aplikasi | TODO | Screenshot/video |
| T03 | Auth | Token invalid | API menolak request | TODO | Log/screenshot |
| T04 | Capture | Input teks usaha | Konteks usaha diproses | TODO | Screenshot |
| T05 | Capture | Input gambar | Gemini memproses input | TODO | Screenshot |
| T06 | Capture | Input audio | Gemini memproses input | TODO | Screenshot |
| T07 | Pulse | Generate Business Pulse | Ringkasan tampil | TODO | Screenshot |
| T08 | Diagnosis | Generate diagnosis | Diagnosis tampil terstruktur | TODO | Screenshot |
| T09 | Market | Market Insight aktif | Hasil/sumber pasar tampil | TODO | Screenshot |
| T10 | Autopilot | Plan 7 hari | Action plan tampil | TODO | Screenshot |
| T11 | Autopilot | Plan 14 hari | Action plan tampil | TODO | Screenshot |
| T12 | Autopilot | Plan 30 hari | Action plan tampil | TODO | Screenshot |
| T13 | Updates | Tambah business update | Update tersimpan/terlihat | TODO | Screenshot |
| T14 | Finance | Tambah transaksi | Ringkasan berubah sesuai input | TODO | Screenshot |
| T15 | Persistence | Refresh setelah login | State tetap sesuai persistence | TODO | Screenshot |
| T16 | RLS | User A akses state User B | Ditolak | TODO | Supabase evidence |
| T17 | Reset | Reset data | Data yang ditargetkan terhapus | TODO | Screenshot |
| T18 | Theme | Light mode | Text/UI terbaca | TODO | Screenshot |
| T19 | Theme | Dark mode | Text/UI terbaca | TODO | Screenshot |
| T20 | Responsive | Desktop Chrome | Layout berfungsi | TODO | Screenshot |
| T21 | Responsive | Android Chrome | Layout berfungsi | TODO | Screenshot |
| T22 | Responsive | iOS Safari | Layout berfungsi | TODO | Screenshot |
| T23 | Failure | Provider AI utama gagal | Fallback berjalan | TODO | Log/video |
| T24 | Failure | Tavily gagal | Error ditangani dengan jelas | TODO | Screenshot |
| T25 | Health | Live Health Check | Status layanan sesuai kondisi | TODO | Screenshot |

## Evidence minimum untuk lomba

Simpan bukti berikut:

1. screenshot setiap modul utama;
2. screenshot login dan persistence;
3. screenshot light/dark mode;
4. screenshot Market Insight beserta sumber;
5. video fallback/error handling;
6. screenshot Health Check;
7. hasil build production;
8. catatan browser/perangkat yang diuji;
9. commit Git sebagai bukti perkembangan;
10. daftar bug yang ditemukan dan tindakan perbaikannya.

## P1 Automated Regression

Perintah: `npm run test:p1`

Hasil audit source terakhir: **14/14 checks PASS**. Pemeriksaan mencakup keberadaan T01–T25, endpoint Autopilot khusus, schema validation, timeout AI, health status, lockfile, media cleanup, dark theme, finance cash movement, auth, payload limit, dan rate limiting.

Catatan: automated regression ini **bukan pengganti** pengujian browser T01–T25.
