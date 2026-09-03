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
- [ ] Respons AI tidak valid tidak menyebabkan aplikasi crash.
- [ ] Timeout/error eksternal menampilkan pesan yang dapat dipahami.

## Security
- [ ] Tidak ada API key di client/repository.
- [ ] Auth dan authorization diuji.
- [ ] RLS diuji dengan akun berbeda.
- [ ] Payload/media limit diuji.
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
