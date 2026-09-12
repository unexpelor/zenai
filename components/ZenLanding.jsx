"use client";

/* ZENAI — Fresh landing (2026). Fully self-contained: markup + scoped styles.
   Namespace `zn-*` — tidak bergantung pada CSS lama di globals.css. */

function Arrow({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export default function ZenLanding({ darkMode = false, onLogin, onSignup }) {
  return (
    <main className={`zn${darkMode ? " zn-dark" : ""}`}>
      <style>{`
.zn{--bg:#F7F7F4;--card:#FFFFFF;--ink:#15181E;--mut:#606876;--ln:#E7E5DF;--acc:#4F46E5;--acc2:#9333EA;--ok:#16A34A;min-height:100vh;background:var(--bg);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased}
.zn *{box-sizing:border-box}
.zn button{font:inherit;cursor:pointer;border:0;background:none;color:inherit;padding:0}
.zn a{color:inherit;text-decoration:none}
.zn-dark{--bg:#090B10;--card:#111420;--ink:#EDF0F4;--mut:#98A0AE;--ln:#222836;--acc:#8B93FF;--acc2:#C084FC;--ok:#4ADE80}
.zn:before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(820px 420px at 72% -8%,rgba(79,70,229,.10),transparent 68%),radial-gradient(600px 400px at 6% 12%,rgba(147,51,234,.07),transparent 68%)}
.zn-dark:before{background:radial-gradient(820px 420px at 72% -8%,rgba(129,140,248,.14),transparent 68%),radial-gradient(600px 400px at 6% 12%,rgba(192,132,252,.08),transparent 68%)}
.zn ::selection{background:rgba(79,70,229,.18)}
/* NAV */
.zn-nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;max-width:1120px;margin:0 auto;padding:16px 24px;background:transparent}
.zn-nav::before{content:"";position:absolute;inset:0;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background:color-mix(in srgb,var(--bg) 72%,transparent);border-bottom:1px solid var(--ln);z-index:-1}
.zn-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:16px;letter-spacing:.6px}
.zn-brand img{width:32px;height:32px;object-fit:contain}
.zn-links{display:flex;gap:28px;font-size:13.5px;font-weight:600;color:var(--mut)}
.zn-links a{transition:color .2s ease}
.zn-links a:hover{color:var(--ink)}
.zn-act{display:flex;align-items:center;gap:10px}
.zn-ghost{font-size:13px;font-weight:700;color:var(--mut);padding:9px 12px;border-radius:9px;transition:color .2s ease,background .2s ease}
.zn-ghost:hover{color:var(--ink);background:rgba(120,120,130,.09)}
.zn-cta{display:inline-flex;align-items:center;gap:8px;background:var(--acc);color:#fff;font-size:13px;font-weight:700;padding:10px 16px;border-radius:10px;box-shadow:0 8px 22px rgba(79,70,229,.25);transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s ease,filter .2s ease}
.zn-dark .zn-cta{color:#0A0C12}
.zn-cta:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(79,70,229,.32);filter:brightness(1.05)}
.zn-cta:active{transform:translateY(0) scale(.98)}
.zn-cta svg{transition:transform .3s cubic-bezier(.2,.8,.2,1)}
.zn-cta:hover svg{transform:translateX(3px)}
/* HERO */
.zn-hero{max-width:880px;margin:0 auto;padding:84px 24px 20px;text-align:center}
.zn-pill{display:inline-flex;align-items:center;gap:8px;font-size:11.5px;font-weight:700;letter-spacing:.4px;color:var(--mut);border:1px solid var(--ln);background:var(--card);border-radius:999px;padding:7px 14px}
.zn-pill i{width:7px;height:7px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 4px rgba(22,163,74,.14);animation:znPulse 2.4s ease-in-out infinite}
@keyframes znPulse{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}
.zn-hero h1{font-size:clamp(40px,6.4vw,72px);line-height:1.02;letter-spacing:-3.2px;font-weight:760;margin:26px 0 24px;text-wrap:balance}
.zn-hero h1 em{font-style:normal;background:linear-gradient(92deg,var(--acc),var(--acc2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.zn-sub{max-width:620px;margin:0 auto;font-size:16px;line-height:1.8;color:var(--mut)}
.zn-ctas{display:flex;align-items:center;justify-content:center;gap:22px;margin-top:34px;flex-wrap:wrap}
.zn-cta.big{font-size:14.5px;padding:14px 22px}
.zn-more{display:inline-flex;align-items:center;gap:7px;font-size:13.5px;font-weight:700;color:var(--mut);transition:color .2s ease}
.zn-more:hover{color:var(--ink)}
.zn-stats{display:flex;justify-content:center;gap:0;margin-top:44px;flex-wrap:wrap}
.zn-stats>div{padding:0 34px;text-align:left}
.zn-stats>div+div{border-left:1px solid var(--ln)}
.zn-stats b{display:block;font-size:26px;letter-spacing:-1.2px;font-variant-numeric:tabular-nums}
.zn-stats span{display:block;margin-top:4px;font-size:12px;color:var(--mut);max-width:150px}
/* MOCK */
.zn-mock{max-width:880px;margin:58px auto 0;background:var(--card);border:1px solid var(--ln);border-radius:18px;box-shadow:0 1px 2px rgba(10,12,18,.05),0 34px 80px rgba(10,12,18,.14);overflow:hidden;text-align:left;animation:znRise .8s .15s cubic-bezier(.2,.8,.2,1) both}
@keyframes znRise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
.zn-mbar{height:42px;display:flex;align-items:center;gap:6px;padding:0 16px;border-bottom:1px solid var(--ln);font-size:10.5px;color:var(--mut);letter-spacing:.6px}
.zn-mbar i{width:9px;height:9px;border-radius:50%;background:var(--ln)}
.zn-mbar span{margin-left:auto}
.zn-mbody{display:grid;grid-template-columns:58px 1fr;min-height:330px}
.zn-mside{background:var(--ink);display:flex;flex-direction:column;align-items:center;padding:16px 0;gap:16px}
.zn-mside b{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;display:grid;place-items:center;font-size:12px}
.zn-mside i{width:18px;height:3.5px;border-radius:3px;background:color-mix(in srgb,var(--ink) 30%,#fff);opacity:.4}
.zn-mside i.on{width:22px;height:22px;border-radius:7px;background:color-mix(in srgb,var(--acc) 26%,transparent);opacity:1}
.zn-mmain{padding:26px 28px}
.zn-mhead{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.zn-mhead small{display:block;font-size:9.5px;font-weight:800;letter-spacing:1.6px;color:var(--acc)}
.zn-mhead strong{display:block;font-size:21px;letter-spacing:-.7px;margin-top:5px}
.zn-chip{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--ok);border:1px solid color-mix(in srgb,var(--ok) 34%,transparent);border-radius:999px;padding:6px 11px;white-space:nowrap}
.zn-mscore{display:flex;gap:24px;align-items:center;margin-top:24px;flex-wrap:wrap}
.zn-ring{width:104px;height:104px;border-radius:50%;background:conic-gradient(var(--acc) 0 78%,var(--ln) 78% 100%);display:grid;place-items:center;flex:0 0 auto}
.zn-ring b{width:80px;height:80px;border-radius:50%;background:var(--card);display:grid;place-items:center;font-size:26px;letter-spacing:-1.2px;font-variant-numeric:tabular-nums}
.zn-msinfo{flex:1;min-width:220px}
.zn-msinfo p{margin:0 0 12px;font-size:13.5px;line-height:1.65;color:var(--mut)}
.zn-tags{display:flex;gap:8px;flex-wrap:wrap}
.zn-tags span{font-size:11px;font-weight:700;color:var(--acc);background:color-mix(in srgb,var(--acc) 10%,transparent);border-radius:8px;padding:6px 10px}
.zn-mchart{display:flex;align-items:flex-end;gap:9px;height:96px;margin-top:24px;padding:12px 14px;border:1px solid var(--ln);border-radius:12px}
.zn-mchart i{flex:1;border-radius:5px 5px 0 0;background:linear-gradient(180deg,color-mix(in srgb,var(--acc) 72%,transparent),color-mix(in srgb,var(--acc) 26%,transparent));animation:znBar 2.6s ease-in-out infinite alternate;transform-origin:bottom}
.zn-mchart i:nth-child(2){animation-delay:.12s}.zn-mchart i:nth-child(3){animation-delay:.24s}.zn-mchart i:nth-child(4){animation-delay:.36s}.zn-mchart i:nth-child(5){animation-delay:.48s}.zn-mchart i:nth-child(6){animation-delay:.6s}.zn-mchart i:nth-child(7){animation-delay:.72s}
@keyframes znBar{from{transform:scaleY(.86)}to{transform:scaleY(1.04)}}
/* SECTIONS */
.zn-sec{max-width:1120px;margin:0 auto;padding:96px 24px}
.zn-sec-head{max-width:560px;margin-bottom:44px}
.zn-sec-head small{display:block;font-size:10.5px;font-weight:800;letter-spacing:2px;color:var(--acc)}
.zn-sec-head h2{font-size:clamp(28px,3.8vw,44px);line-height:1.1;letter-spacing:-1.8px;margin:14px 0 0;text-wrap:balance}
/* BENTO */
.zn-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.zn-card{background:var(--card);border:1px solid var(--ln);border-radius:16px;padding:26px;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s ease,border-color .3s ease;position:relative}
.zn-card:hover{transform:translateY(-5px);box-shadow:0 20px 46px rgba(10,12,18,.1);border-color:color-mix(in srgb,var(--acc) 30%,var(--ln))}
.zn-num{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:10px;background:color-mix(in srgb,var(--acc) 11%,transparent);color:var(--acc);font-size:12px;font-weight:800;margin-bottom:20px}
.zn-card h3{font-size:18px;letter-spacing:-.5px;margin:0 0 8px}
.zn-card p{font-size:13px;line-height:1.7;color:var(--mut);margin:0}
.zn-card.w2{grid-column:span 2;display:grid;grid-template-columns:1fr 180px;gap:22px;align-items:center}
.zn-card.w3{grid-column:span 3}
.zn-mini{border:1px solid var(--ln);border-radius:12px;padding:14px;display:flex;align-items:flex-end;gap:6px;height:130px}
.zn-mini i{flex:1;border-radius:4px 4px 0 0;background:color-mix(in srgb,var(--acc) 55%,transparent);opacity:.75}
.zn-card:hover .zn-mini i{animation:znBar 2.2s ease-in-out infinite alternate}
.zn-card:hover .zn-mini i:nth-child(2){animation-delay:.1s}.zn-card:hover .zn-mini i:nth-child(3){animation-delay:.2s}.zn-card:hover .zn-mini i:nth-child(4){animation-delay:.3s}.zn-card:hover .zn-mini i:nth-child(5){animation-delay:.4s}
/* STEPS */
.zn-steps{display:grid;grid-template-columns:repeat(5,1fr);gap:0;border-top:1px solid var(--ln);counter-reset:znstep}
.zn-steps>div{position:relative;padding:28px 20px 0 0;counter-increment:znstep}
.zn-steps>div::before{content:"";position:absolute;top:-4px;left:0;width:8px;height:8px;border-radius:50%;background:var(--acc)}
.zn-steps>div::after{content:"0" counter(znstep);display:block;font-size:11px;font-weight:800;letter-spacing:1.4px;color:var(--acc)}
.zn-steps h3{font-size:16.5px;letter-spacing:-.3px;margin:20px 0 7px}
.zn-steps p{font-size:12.5px;line-height:1.65;color:var(--mut);margin:0}
/* PRINSIP */
.zn-panel{background:linear-gradient(135deg,#14161D,#1D2030 55%,#221B3A);color:#F2F3F7;border-radius:24px;padding:72px clamp(28px,6vw,80px);display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;position:relative;overflow:hidden}
.zn-panel::after{content:"";position:absolute;width:480px;height:480px;border-radius:50%;right:-160px;bottom:-260px;background:radial-gradient(circle,rgba(129,140,248,.22),transparent 65%)}
.zn-panel h2{font-size:clamp(30px,4vw,52px);line-height:1.04;letter-spacing:-2.4px;margin:0}
.zn-panel h2 em{font-style:normal;background:linear-gradient(92deg,#8B93FF,#C084FC);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.zn-panel>p{margin:18px 0 0;font-size:14.5px;line-height:1.75;color:#A7ACC0;max-width:400px}
.zn-pts{list-style:none;margin:0;padding:0;display:grid;gap:0;position:relative;z-index:1}
.zn-pts li{display:grid;grid-template-columns:26px 1fr;gap:14px;padding:17px 0;border-bottom:1px solid rgba(255,255,255,.1);align-items:start}
.zn-pts li:last-child{border-bottom:0}
.zn-pts svg{color:#8B93FF;margin-top:3px}
.zn-pts b{display:block;font-size:14.5px}
.zn-pts span{display:block;font-size:12.5px;color:#A7ACC0;margin-top:3px;line-height:1.6}
/* FINAL */
.zn-final{max-width:820px;margin:0 auto 40px;padding:0 24px;text-align:center}
.zn-final h2{font-size:clamp(30px,4.4vw,54px);line-height:1.05;letter-spacing:-2.4px;margin:0;text-wrap:balance}
.zn-final p{margin:18px auto 30px;font-size:15px;line-height:1.75;color:var(--mut);max-width:520px}
/* FOOTER */
.zn-foot{max-width:1120px;margin:0 auto;padding:26px 24px 34px;display:flex;align-items:center;justify-content:space-between;gap:18px;border-top:1px solid var(--ln);font-size:12px;color:var(--mut);flex-wrap:wrap}
.zn-fbrand{display:flex;align-items:center;gap:9px;font-weight:800;color:var(--ink);letter-spacing:.5px}
.zn-fbrand img{width:24px;height:24px}
/* RESPONSIVE */
@media(max-width:920px){.zn-links{display:none}.zn-grid{grid-template-columns:1fr 1fr}.zn-card.w2,.zn-card.w3{grid-column:span 2;grid-template-columns:1fr}.zn-steps{grid-template-columns:repeat(2,1fr);row-gap:34px}.zn-panel{grid-template-columns:1fr;gap:44px;padding:52px 28px}}
@media(max-width:600px){.zn-hero{padding-top:60px}.zn-stats>div{padding:0 16px}.zn-grid{grid-template-columns:1fr}.zn-card.w2,.zn-card.w3{grid-column:span 1}.zn-steps{grid-template-columns:1fr}.zn-mbody{grid-template-columns:44px 1fr}.zn-mmain{padding:18px 16px}}
@media(prefers-reduced-motion:reduce){.zn *{animation:none!important;transition:none!important}}
      `}</style>

      {/* NAV */}
      <nav className="zn-nav">
        <a className="zn-brand" href="#top" aria-label="ZENAI">
          <img src="/zenai-mark.png" alt="" />
          <span>ZENAI</span>
        </a>
        <div className="zn-links">
          <a href="#zn-fitur">Fitur</a>
          <a href="#zn-alur">Alur Kerja</a>
          <a href="#zn-prinsip">Prinsip</a>
        </div>
        <div className="zn-act">
          <button className="zn-ghost" onClick={onLogin}>Masuk</button>
          <button className="zn-cta" onClick={onSignup}>Coba ZENAI <Arrow /></button>
        </div>
      </nav>

      {/* HERO */}
      <header id="top" className="zn-hero">
        <div className="zn-pill"><i />Asisten keputusan bisnis berbasis AI</div>
        <h1>Pahami usaha Anda.<br /><em>Putuskan dengan yakin.</em></h1>
        <p className="zn-sub">
          Ceritakan kondisi usaha — lewat teks, gambar, atau suara. ZENAI menyusun diagnosis,
          membaca pasar, menghitung dampak keuangan, lalu mengubah semuanya menjadi rencana
          tindakan yang bisa langsung dijalankan.
        </p>
        <div className="zn-ctas">
          <button className="zn-cta big" onClick={onSignup}>Mulai Sekarang <Arrow size={17} /></button>
          <a className="zn-more" href="#zn-alur">Lihat alurnya ↓</a>
        </div>
        <div className="zn-stats">
          <div><b>5 modul</b><span>analisis bisnis yang saling terhubung</span></div>
          <div><b>3 input</b><span>teks, gambar, dan rekaman suara</span></div>
          <div><b>7–30 hari</b><span>rentang rencana tindakan terukur</span></div>
        </div>

        {/* PREVIEW PRODUK */}
        <div className="zn-mock" aria-label="Pratinjau ZENAI">
          <div className="zn-mbar"><i /><i /><i /><span>zenai · business pulse</span></div>
          <div className="zn-mbody">
            <div className="zn-mside"><b>Z</b><i className="on" /><i /><i /><i /><i /></div>
            <div className="zn-mmain">
              <div className="zn-mhead">
                <div>
                  <small>KONDISI USAHA HARI INI</small>
                  <strong>Business Pulse</strong>
                </div>
                <span className="zn-chip">● Sehat</span>
              </div>
              <div className="zn-mscore">
                <div className="zn-ring"><b>78</b></div>
                <div className="zn-msinfo">
                  <p>Penjualan tumbuh stabil, tetapi biaya operasional naik lebih cepat daripada pendapatan — margin mulai tertekan.</p>
                  <div className="zn-tags"><span>Prioritas: margin</span><span>Review biaya</span><span>Review stok lambat</span></div>
                </div>
              </div>
              <div className="zn-mchart">
                <i style={{ height: "34%" }} /><i style={{ height: "48%" }} /><i style={{ height: "41%" }} />
                <i style={{ height: "58%" }} /><i style={{ height: "52%" }} /><i style={{ height: "71%" }} /><i style={{ height: "86%" }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FITUR — BENTO */}
      <section id="zn-fitur" className="zn-sec">
        <div className="zn-sec-head">
          <small>FITUR</small>
          <h2>Satu ruang kerja untuk seluruh keputusan bisnis.</h2>
        </div>
        <div className="zn-grid">
          <article className="zn-card w2">
            <div>
              <span className="zn-num">01</span>
              <h3>Business Pulse</h3>
              <p>Status usaha, hal yang berjalan baik, dan yang perlu perhatian — dirangkum dalam satu pandangan dari konteks Anda sendiri.</p>
            </div>
            <div className="zn-mini"><i style={{ height: "38%" }} /><i style={{ height: "55%" }} /><i style={{ height: "44%" }} /><i style={{ height: "68%" }} /><i style={{ height: "88%" }} /></div>
          </article>
          <article className="zn-card">
            <span className="zn-num">02</span>
            <h3>Diagnosis</h3>
            <p>Akar masalah, bukan gejala. Setiap temuan disertai dampak dan urutan penanganan.</p>
          </article>
          <article className="zn-card">
            <span className="zn-num">03</span>
            <h3>Market Insight</h3>
            <p>Sinyal pasar — permintaan, kompetitor, tren — dibaca sebagai bagian dari analisis.</p>
          </article>
          <article className="zn-card">
            <span className="zn-num">04</span>
            <h3>Business Autopilot</h3>
            <p>Strategi dipecah menjadi action plan 7, 14, atau 30 hari yang bisa dijalankan langkah demi langkah.</p>
          </article>
          <article className="zn-card">
            <span className="zn-num">05</span>
            <h3>Laporan Keuangan</h3>
            <p>Catat transaksi, lalu uji setiap keputusan: dampaknya ke laba, kas, dan margin.</p>
          </article>
          <article className="zn-card w3">
            <span className="zn-num">06</span>
            <h3>Growth Loop</h3>
            <p>Tindakan ditandai selesai, hasilnya dievaluasi, dan evaluasi itu menjadi bahan analisis berikutnya — sehingga rekomendasi ZENAI tidak mengulang nasihat lama, tapi berevolusi mengikuti perkembangan usaha Anda.</p>
          </article>
        </div>
      </section>

      {/* ALUR KERJA */}
      <section id="zn-alur" className="zn-sec">
        <div className="zn-sec-head">
          <small>ALUR KERJA</small>
          <h2>Dari cerita menjadi tindakan — dalam lima langkah.</h2>
        </div>
        <div className="zn-steps">
          <div><h3>Ceritakan</h3><p>Tulis kondisi usaha, unggah gambar, atau rekam suara. Tanpa format khusus.</p></div>
          <div><h3>Dianalisis</h3><p>ZENAI merangkai konteks menjadi Business Pulse dan diagnosis yang spesifik.</p></div>
          <div><h3>Diprioritaskan</h3><p>Masalah, peluang, dan sinyal pasar diurutkan berdasarkan dampaknya.</p></div>
          <div><h3>Dijalankan</h3><p>Keputusan diuji ke dampak keuangannya, lalu dijadwalkan sebagai tindakan.</p></div>
          <div><h3>Dievaluasi</h3><p>Hasil dicatat dan menjadi konteks untuk analisis berikutnya.</p></div>
        </div>
      </section>

      {/* PRINSIP */}
      <section id="zn-prinsip" className="zn-sec">
        <div className="zn-panel">
          <div>
            <h2>Pahami. Putuskan.<br /><em>Tumbuh.</em></h2>
            <p>Tiga prinsip yang menjadi fondasi setiap analisis ZENAI — supaya setiap jawaban bisa dipercaya dan ditindaklanjuti.</p>
          </div>
          <ul className="zn-pts">
            <li><Check /><div><b>Konteks dulu, baru kesimpulan.</b><span>Analisis dibangun dari cerita usaha Anda, bukan asumsi umum.</span></div></li>
            <li><Check /><div><b>Keputusan diuji dengan angka.</b><span>Dampak ke laba, kas, dan margin dihitung sebelum bertindak.</span></div></li>
            <li><Check /><div><b>Analisis berakhir pada tindakan.</b><span>Insight tanpa langkah berikutnya bukan hasil — hanya wacana.</span></div></li>
          </ul>
        </div>
      </section>

      {/* CTA AKHIR */}
      <section className="zn-final">
        <h2>Setiap keputusan besar dimulai dari cerita kecil hari ini.</h2>
        <p>Mulai dari kondisi usaha Anda sekarang. ZENAI bantu menyusun apa yang perlu dipahami, diputuskan, dan dilakukan berikutnya.</p>
        <button className="zn-cta big" onClick={onSignup}>Coba ZENAI Sekarang <Arrow size={17} /></button>
      </section>

      {/* FOOTER */}
      <footer className="zn-foot">
        <div className="zn-fbrand"><img src="/zenai-mark.png" alt="" />ZENAI</div>
        <span>Asisten keputusan bisnis — Pahami. Putuskan. Tumbuh.</span>
        <span>© 2026 ZENAI</span>
      </footer>
    </main>
  );
}
