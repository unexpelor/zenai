"use client";

/* ZENAI — Sleek landing (CoreShift-inspired).
   Markup only. Styles in app/globals.css under the `cs-*` namespace.
   Supports light + dark via `darkMode` prop. */

function Arrow({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Sun() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function Moon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
    </svg>
  );
}

const MENU = [
  ["▦", "Dashboard"],
  ["▤", "Ceritakan Usaha"],
  ["◔", "Kondisi Usaha"],
  ["◉", "Diagnosis"],
  ["◈", "Perspektif Bisnis"],
  ["⇢", "Strategi & Tindakan"],
  ["▧", "Laporan Keuangan"],
  ["✦", "Analisis Lanjutan"],
];

export default function ZenLanding({ darkMode = false, onToggleTheme, onLogin, onSignup }) {
  return (
    <div className={`cs${darkMode ? "" : " light"}`}>
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
          <a href="#cs-why">Prinsip</a>
        </nav>
        <div className="cs-nav-cta">
          <button className="cs-theme" onClick={onToggleTheme} aria-label="Ubah tema terang atau gelap" title="Ubah tema">
            {darkMode ? <Sun /> : <Moon />}
          </button>
          <button className="cs-btn cs-btn-ghost" onClick={onLogin}>Masuk</button>
          <button className="cs-btn cs-btn-grad" onClick={onSignup}>Mulai Gratis <Arrow /></button>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="cs-hero">
        <div className="cs-badge"><i />Dibangun untuk pemilik usaha</div>
        <h1>Pahami. Putuskan.<br /><em>Tumbuh.</em></h1>
        <p className="cs-sub">
          ZENAI membantu Anda membaca kondisi usaha dengan jelas, memilih langkah yang
          masuk akal, dan menindaklanjutinya sampai terlihat hasilnya.
        </p>
        <div className="cs-ctas">
          <button className="cs-btn cs-btn-grad cs-btn-lg" onClick={onSignup}>Mulai Sekarang <Arrow size={17} /></button>
          <a className="cs-more" href="#cs-flow">Lihat cara kerjanya <Arrow /></a>
        </div>

        {/* MOCK — meniru dashboard ZENAI sesungguhnya */}
        <div className="cs-mock" aria-hidden="true">
          <div className="cs-mock-bar"><span /><span /><span /><em>zenai · dashboard</em></div>
          <div className="cs-mock-body">
            <div className="cs-mock-side">
              <div className="cs-mock-logo"><b>Z</b><span>ZENAI</span></div>
              <nav className="cs-mock-menu">
                {MENU.map(([g, label], i) => (
                  <span key={label} className={i === 0 ? "on" : ""}>{g}<em>{label}</em></span>
                ))}
              </nav>
              <div className="cs-mock-menu cs-mock-menu-sub">
                <span>? Panduan</span>
                <span>⚙ Pengaturan</span>
              </div>
            </div>
            <div className="cs-mock-main">
              <div className="cs-mock-head">
                <div><small>DASHBOARD USAHA</small><strong>Selamat datang kembali</strong></div>
                <span className="cs-pill"><i />Sehat</span>
              </div>
              <div className="cs-mock-metrics">
                <div><small>PENDAPATAN</small><b>Rp 42,8 jt</b><em>+12,4%</em></div>
                <div><small>LABA BERSIH</small><b>Rp 8,1 jt</b><em>+6,8%</em></div>
                <div><small>ARUS KAS</small><b>Rp 9,4 jt</b><em>Stabil</em></div>
              </div>
              <div className="cs-mock-insight">
                <small>RINGKASAN HARI INI</small>
                <p>Biaya operasional naik lebih cepat daripada pendapatan — cek margin sebelum menambah pengeluaran.</p>
              </div>
              <div className="cs-mock-chart">
                <i style={{ height: "38%" }} /><i style={{ height: "55%" }} /><i style={{ height: "46%" }} />
                <i style={{ height: "66%" }} /><i style={{ height: "58%" }} /><i style={{ height: "74%" }} /><i style={{ height: "92%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="cs-stats">
          <div><b>8</b><span>modul dalam satu tempat</span></div>
          <div><b>3</b><span>cara mulai: teks, foto, suara</span></div>
          <div><b>7–30</b><span>hari rencana tindakan</span></div>
        </div>
      </section>

      {/* FITUR */}
      <section id="cs-features" className="cs-sec">
        <div className="cs-sec-head">
          <span>FITUR</span>
          <h2>Satu tempat.<br />Semua jawaban usaha Anda.</h2>
        </div>
        <div className="cs-grid">
          <article className="cs-card cs-card-wide">
            <div className="cs-ic">▦</div>
            <h3>Dashboard</h3>
            <p>Semua kondisi usaha Anda dalam satu layar — tanpa perlu membuka banyak laporan.</p>
            <div className="cs-spark"><i style={{ height: "40%" }} /><i style={{ height: "58%" }} /><i style={{ height: "44%" }} /><i style={{ height: "70%" }} /><i style={{ height: "88%" }} /></div>
          </article>
          <article className="cs-card"><div className="cs-ic">▤</div><h3>Ceritakan Usaha</h3><p>Mulai dari cerita Anda — teks, foto, atau suara. Tanpa format khusus.</p></article>
          <article className="cs-card"><div className="cs-ic">◔</div><h3>Kondisi Usaha</h3><p>Kabar terbaru usaha Anda, ringkas dan jelas.</p></article>
          <article className="cs-card"><div className="cs-ic">◉</div><h3>Diagnosis</h3><p>Temukan hal yang perlu diperhatikan lebih dulu.</p></article>
          <article className="cs-card"><div className="cs-ic">◈</div><h3>Perspektif Bisnis</h3><p>Lihat usaha Anda dari sudut pasar.</p></article>
          <article className="cs-card"><div className="cs-ic">⇢</div><h3>Strategi & Tindakan</h3><p>Dari rencana menjadi langkah nyata.</p></article>
          <article className="cs-card"><div className="cs-ic">▧</div><h3>Laporan Keuangan</h3><p>Angka yang mudah dipahami.</p></article>
          <article className="cs-card cs-card-wide"><div className="cs-ic">✦</div><h3>Analisis Lanjutan</h3><p>Uji keputusan sebelum dijalankan — lihat dampaknya ke laba dan kas lebih dulu.</p></article>
        </div>
      </section>

      {/* CARA KERJA */}
      <section id="cs-flow" className="cs-sec">
        <div className="cs-sec-head">
          <span>CARA KERJA</span>
          <h2>Empat langkah, dari cerita sampai hasil.</h2>
        </div>
        <ol className="cs-flow">
          <li><em>01</em><h3>Ceritakan</h3><p>Tulis, unggah foto, atau rekam suara.</p></li>
          <li><em>02</em><h3>Analisis</h3><p>ZENAI merangkai kondisi usaha Anda.</p></li>
          <li><em>03</em><h3>Putuskan</h3><p>Pilih langkah yang paling masuk akal.</p></li>
          <li><em>04</em><h3>Tindak Lanjut</h3><p>Jalankan, tandai selesai, dan evaluasi.</p></li>
        </ol>
      </section>

      {/* PRINSIP */}
      <section id="cs-why" className="cs-why">
        <p className="cs-quote">Keputusan yang baik<br />tidak datang dari tebakan.</p>
        <p className="cs-why-sub">
          Tiga prinsip yang menjaga setiap jawaban ZENAI tetap jujur dan bisa ditindaklanjuti.
        </p>
        <div className="cs-principles">
          <div><b>Baca dulu</b><span>baru simpulkan — dari cerita Anda, bukan asumsi.</span></div>
          <div><b>Uji dengan angka</b><span>bukan perkiraan — sebelum bertindak.</span></div>
          <div><b>Berakhir pada langkah</b><span>bukan sekadar wacana.</span></div>
        </div>
      </section>

      {/* CTA AKHIR */}
      <section className="cs-final">
        <div className="cs-final-card">
          <h2>Siap melihat usaha Anda<br />dengan lebih jernih?</h2>
          <p>Mulai dari kondisi usaha hari ini. Pahami, putuskan, lalu tumbuh.</p>
          <button className="cs-btn cs-btn-grad cs-btn-lg" onClick={onSignup}>Coba ZENAI Sekarang <Arrow size={17} /></button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="cs-foot">
        <div className="cs-fbrand"><span className="cs-mark">Z</span>ZENAI</div>
        <span>Pahami. Putuskan. Tumbuh.</span>
        <span>© 2026 ZENAI</span>
      </footer>
    </div>
  );
}
