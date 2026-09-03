# Release Readiness Checklist ZenAI

Dokumen ini digunakan sebelum submission atau demo resmi.

## Fungsionalitas
- [ ] Alur utama dapat dijalankan dari input usaha sampai action plan.
- [ ] Empty state dan error state diperiksa.
- [ ] Reset/logout tidak menyebabkan state pengguna tertukar.

## Reliability
- [ ] Refresh diuji.
- [ ] Login ulang diuji.
- [ ] Provider AI utama gagal → fallback diuji.
- [x] Respons AI tidak valid ditolak dengan error terstruktur pada Autopilot.
- [x] Timeout/error provider AI memiliki penanganan terkontrol; Gemini, Groq, dan OpenRouter memiliki batas waktu request.

## Security
- [ ] Tidak ada API key di client/repository.
- [x] Auth dan authorization diwajibkan pada API utama; pengujian lintas akun tetap perlu dilakukan pada deployment.
- [ ] RLS diuji dengan akun berbeda.
- [x] Payload/media limit diterapkan pada API AI.
- [ ] Error tidak membocorkan secret/token.

## Compatibility
- [ ] Chrome desktop
- [ ] Edge desktop
- [ ] Android Chrome
- [ ] iOS Safari
- [ ] Kondisi jaringan normal
- [ ] Kondisi jaringan lambat/terputus

## Documentation
- [ ] User manual tersedia.
- [ ] FAQ/troubleshooting tersedia.
- [ ] Architecture tersedia.
- [ ] Security documentation tersedia.
- [ ] Testing report berisi bukti aktual.
- [ ] Flowchart tersedia.
- [ ] UI visualization tersedia.
- [ ] Proposal tersedia.
- [ ] Teaser maksimal 3 menit tersedia.
- [ ] Source code/repository tersedia.

## Final Evidence

Setiap item yang dinyatakan selesai sebaiknya memiliki bukti: screenshot, video, log, test result, atau tautan repository/dokumen yang relevan.

## P1 Validation Note

Automated source regression terakhir: **14/14 PASS**. `npm ci` dan `npm run build` production belum dapat dinyatakan PASS dari environment kerja ini karena registry npm tidak dapat diakses; lakukan validasi build pada mesin/CI yang memiliki akses registry. Pengujian T01–T25 live juga tetap memerlukan deployment dan kredensial pengujian.
