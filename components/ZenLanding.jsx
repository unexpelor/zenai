"use client";

/* ZENAI — Sleek dark landing (CoreShift-inspired).
   Markup only. Styles live in app/globals.css under the `cs-*` namespace. */

function Arrow({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function ZenLanding({ onLogin, onSignup }) {
  return (
    <div className="cs">
      <div className="cs-glow cs-glow-a" aria-hidden="true" />
      <div className="cs-glow cs-glow-b" aria-hidden="true" />
      <div className="cs-grid-bg" aria-hidden="true" />

      {/* NAV */}
      <header className="cs-nav">
        <a className="cs-brand" href="#top" aria-label="ZENAI">
          <span className="cs-mark">Z</span>
          <span className="cs-word">ZENAI</span>
        </a>
        <nav className="cs-links">
          <a href="#cs-features">Fitur</a>
          <a href="#cs-flow">Cara Kerja</a>
          <a href="#cs-why">Mengapa</a>
        </nav>
        <div className="cs-nav-cta">
          <button className="cs-btn cs-btn-ghost" onClick={onLogin}>Masuk</button>
          <button className="cs-btn cs-btn-grad" onClick={onSignup}>Mulai Gratis <Arrow /></button>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="cs-hero">
        <div className="cs-badge"><i />AI-POWERED BUSINESS DECISIONS</div>
        <h1>Lihat bisnis Anda<br /><em>lebih jernih.</em></h1>
        <p className="cs-sub">
          ZENAI mengubah cerita, angka, dan kondisi usaha menjadi diagnosis yang tajam,
          prioritas keputusan, dan langkah yang bisa langsung dieksekusi.
        </p>
        <div className="cs-ctas">
          <button className="cs-btn cs-btn-grad cs-btn-lg" onClick={onSignup}>Analisis Usaha Saya <Arrow size={17} /></button>
          <a className="cs-more" href="#cs-flow">Lihat cara kerjanya <Arrow /></a>
        </div>

        {/* PRODUCT MOCK */}
        <div className="cs-mock" aria-hidden="true">
          <div className="cs-mock-bar"><span /><span /><span /><em>zenai · command center</em></div>
          <div className="cs-mock-body">
            <div className="cs-mock-side"><b>Z</b><i className="on" /><i /><i /><i /><i /></div>
            <div className="cs-mock-main">
              <div className="cs-mock-head">
                <div><small>BUSINESS PULSE</small><strong>Kondisi usaha Anda</strong></div>
                <span className="cs-pill"><i />Sehat</span>
              </div>
              <div className="cs-mock-metrics">
                <div><small>REVENUE</small><b>Rp 42,8 jt</b><em>+12,4%</em></div>
                <div><small>MARGIN</small><b>18,6%</b><em>+2,1%</em></div>
                <div><small>ARUS KAS</small><b>Rp 9,4 jt</b><em>Stabil</em></div>
              </div>
              <div className="cs-mock-insight">
                <small>ZENAI INSIGHT</small>
                <p>Biaya operasional naik lebih cepat daripada pendapatan — margin mulai tertekan.</p>
              </div>
              <div className="cs-mock-chart">
                <i style={{ height: "38%" }} /><i style={{ height: "55%" }} /><i style={{ height: "46%" }} />
                <i style={{ height: "66%" }} /><i style={{ height: "58%" }} /><i style={{ height: "74%" }} /><i style={{ height: "92%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="cs-stats">
          <div><b>5</b><span>modul analisis terhubung</span></div>
          <div><b>3</b><span>jenis input: teks, gambar, suara</span></div>
          <div><b>7–30</b><span>hari rencana tindakan</span></div>
        </div>
      </section>

      {/* FITUR */}
      <section id="cs-features" className="cs-sec">
        <div className="cs-sec-head">
          <span>FITUR</span>
          <h2>Satu komando.<br />Seluruh keputusan.</h2>
        </div>
        <div className="cs-grid">
          <article className="cs-card cs-card-wide">
            <div className="cs-ic">◈</div>
            <h3>Business Pulse</h3>
            <p>Status, perubahan, dan prioritas usaha dirangkum dalam satu pandangan — dari konteks Anda sendiri.</p>
            <div className="cs-spark"><i style={{ height: "40%" }} /><i style={{ height: "58%" }} /><i style={{ height: "44%" }} /><i style={{ height: "70%" }} /><i style={{ height: "88%" }} /></div>
          </article>
          <article className="cs-card">
            <div className="cs-ic">◎</div>
            <h3>Diagnosis</h3>
            <p>Akar masalah, bukan gejala. Setiap temuan disertai dampak dan urutan penanganan.</p>
          </article>
          <article className="cs-card">
            <div className="cs-ic">◉</div>
            <h3>Market Insight</h3>
            <p>Sinyal pasar — permintaan, kompetitor, tren — dibaca sebagai bagian analisis.</p>
          </article>
          <article className="cs-card">
            <div className="cs-ic">⇢</div>
            <h3>Business Autopilot</h3>
            <p>Strategi dipecah jadi action plan 7, 14, atau 30 hari yang siap dijalankan.</p>
          </article>
          <article className="cs-card">
            <div className="cs-ic">▤</div>
            <h3>Laporan Keuangan</h3>
            <p>Catat transaksi, lalu uji setiap keputusan: dampaknya ke laba, kas, dan margin.</p>
          </article>
          <article className="cs-card cs-card-wide">
            <div className="cs-ic">↻</div>
            <h3>Growth Loop</h3>
            <p>Hasil setiap tindakan dievaluasi dan menjadi bahan analisis berikutnya — rekomendasi ZENAI terus berevolusi, tidak mengulang nasihat lama.</p>
          </article>
        </div>
      </section>

      {/* CARA KERJA */}
      <section id="cs-flow" className="cs-sec">
        <div className="cs-sec-head">
          <span>CARA KERJA</span>
          <h2>Empat langkah menuju keputusan yang tajam.</h2>
        </div>
        <ol className="cs-flow">
          <li><em>01</em><h3>Ceritakan</h3><p>Tulis, unggah gambar, atau rekam suara. Tanpa format khusus.</p></li>
          <li><em>02</em><h3>Analisis</h3><p>ZENAI merangkai konteks jadi pulse dan diagnosis yang spesifik.</p></li>
          <li><em>03</em><h3>Putuskan</h3><p>Prioritas diurutkan berdampak, lalu diuji ke angka keuangan.</p></li>
          <li><em>04</em><h3>Tindak Lanjut</h3><p>Jalankan rencana, tandai selesai, dan evaluasi hasilnya.</p></li>
        </ol>
      </section>

      {/* MENGAPA */}
      <section id="cs-why" className="cs-why">
        <p className="cs-quote">Pahami. Putuskan.<br /><em>Tumbuh.</em></p>
        <p className="cs-why-sub">
          ZENAI bukan chatbot biasa. Setiap jawaban dibangun dari analisis terstruktur atas
          konteks usaha Anda — bukan asumsi, bukan template.
        </p>
      </section>

      {/* CTA AKHIR */}
      <section className="cs-final">
        <div className="cs-final-card">
          <h2>Siap melihat usaha Anda<br />dengan mata baru?</h2>
          <p>Mulai dari kondisi usaha hari ini. ZENAI membantu Anda memahami, memutuskan, dan tumbuh.</p>
          <button className="cs-btn cs-btn-grad cs-btn-lg" onClick={onSignup}>Coba ZENAI Sekarang <Arrow size={17} /></button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="cs-foot">
        <div className="cs-fbrand"><span className="cs-mark">Z</span>ZENAI</div>
        <span>Asisten keputusan bisnis — Pahami. Putuskan. Tumbuh.</span>
        <span>© 2026 ZENAI</span>
      </footer>
    </div>
  );
}
