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

## P2 — Quality & Release Hardening

Implemented in the P2 package:
- Accessibility focus-visible states and reduced-motion support.
- Mobile input sizing and horizontally scrollable tables on small screens.
- Tavily and internal AI request timeouts in Marketplace.
- Rate-limit bucket pruning to prevent unbounded in-memory growth.
- Automated P2 static regression script (`npm run test:p2`).
- Existing authentication, payload limits, security headers, media cleanup, dark mode, finance, and Autopilot controls rechecked.

Validation performed in the available environment:
- P2 static regression: 18/18 PASS.
- JavaScript syntax checks: PASS for changed API/security files and `app/page.js`.
- Production build: NOT RUNNABLE in the available environment because dependencies (`next`) are not installed. Run `npm ci && npm run build` in CI/deployment before release.
- T01–T25: remain live/manual test cases and must be marked from actual browser/deployment evidence.
