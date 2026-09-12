"use client";

import { useTranslations } from "next-intl";

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

export default function ZenLanding({ darkMode = false, onToggleTheme, onLogin, onSignup }) {
  const t = useTranslations("landing");

  const MENU = [
    ["▦", t("fDashboard")],
    ["▤", t("fCapture")],
    ["◔", t("fPulse")],
    ["◉", t("fDiagnosis")],
    ["◈", t("fMarket")],
    ["⇢", t("fStrategy")],
    ["▧", t("fFinance")],
    ["✦", t("fAdvanced")],
  ];

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
          <a href="#cs-features">{t("navFeatures")}</a>
          <a href="#cs-flow">{t("navHow")}</a>
          <a href="#cs-why">{t("navWhy")}</a>
        </nav>
        <div className="cs-nav-cta">
          <button className="cs-theme" onClick={onToggleTheme} aria-label="Ubah tema terang atau gelap" title="Ubah tema">
            {darkMode ? <Sun /> : <Moon />}
          </button>
          <button className="cs-btn cs-btn-ghost" onClick={onLogin}>{t("login")}</button>
          <button className="cs-btn cs-btn-grad" onClick={onSignup}>{t("startFree")} <Arrow /></button>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="cs-hero">
        <div className="cs-badge"><i />{t("badge")}</div>
        <h1>{t("heroUnderstand")}<br /><em>{t("heroGrow")}</em></h1>
        <p className="cs-sub">{t("heroSub")}</p>
        <div className="cs-ctas">
          <button className="cs-btn cs-btn-grad cs-btn-lg" onClick={onSignup}>{t("startNow")} <Arrow size={17} /></button>
          <a className="cs-more" href="#cs-flow">{t("seeHow")} <Arrow /></a>
        </div>

        {/* MOCK — meniru dashboard ZENAI sesungguhnya */}
        <div className="cs-mock" aria-hidden="true">
          <div className="cs-mock-bar"><span /><span /><span /><em>{t("mockTag")}</em></div>
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
                <div><small>{t("mockDashboard")}</small><strong>{t("mockWelcome")}</strong></div>
                <span className="cs-pill"><i />{t("mockHealthy")}</span>
              </div>
              <div className="cs-mock-metrics">
                <div><small>{t("mockRevenue")}</small><b>Rp 42,8 jt</b><em>+12,4%</em></div>
                <div><small>{t("mockNetProfit")}</small><b>Rp 8,1 jt</b><em>+6,8%</em></div>
                <div><small>{t("mockCashFlow")}</small><b>Rp 9,4 jt</b><em>Stabil</em></div>
              </div>
              <div className="cs-mock-insight">
                <small>{t("mockToday")}</small>
                <p>{t("mockInsight")}</p>
              </div>
              <div className="cs-mock-chart">
                <i style={{ height: "38%" }} /><i style={{ height: "55%" }} /><i style={{ height: "46%" }} />
                <i style={{ height: "66%" }} /><i style={{ height: "58%" }} /><i style={{ height: "74%" }} /><i style={{ height: "92%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="cs-stats">
          <div><b>8</b><span>{t("statModules")}</span></div>
          <div><b>3</b><span>{t("statWays")}</span></div>
          <div><b>7–30</b><span>{t("statDays")}</span></div>
        </div>
      </section>

      {/* FITUR */}
      <section id="cs-features" className="cs-sec">
        <div className="cs-sec-head">
          <span>{t("featuresKicker")}</span>
          <h2>{t("featuresTitle1")}<br />{t("featuresTitle2")}</h2>
        </div>
        <div className="cs-grid">
          <article className="cs-card cs-card-wide">
            <div className="cs-ic">▦</div>
            <h3>{t("fDashboard")}</h3>
            <p>{t("fDashboardDesc")}</p>
            <div className="cs-spark"><i style={{ height: "40%" }} /><i style={{ height: "58%" }} /><i style={{ height: "44%" }} /><i style={{ height: "70%" }} /><i style={{ height: "88%" }} /></div>
          </article>
          <article className="cs-card"><div className="cs-ic">▤</div><h3>{t("fCapture")}</h3><p>{t("fCaptureDesc")}</p></article>
          <article className="cs-card"><div className="cs-ic">◔</div><h3>{t("fPulse")}</h3><p>{t("fPulseDesc")}</p></article>
          <article className="cs-card"><div className="cs-ic">◉</div><h3>{t("fDiagnosis")}</h3><p>{t("fDiagnosisDesc")}</p></article>
          <article className="cs-card"><div className="cs-ic">◈</div><h3>{t("fMarket")}</h3><p>{t("fMarketDesc")}</p></article>
          <article className="cs-card"><div className="cs-ic">⇢</div><h3>{t("fStrategy")}</h3><p>{t("fStrategyDesc")}</p></article>
          <article className="cs-card"><div className="cs-ic">▧</div><h3>{t("fFinance")}</h3><p>{t("fFinanceDesc")}</p></article>
          <article className="cs-card cs-card-wide"><div className="cs-ic">✦</div><h3>{t("fAdvanced")}</h3><p>{t("fAdvancedDesc")}</p></article>
        </div>
      </section>

      {/* CARA KERJA */}
      <section id="cs-flow" className="cs-sec">
        <div className="cs-sec-head">
          <span>{t("howKicker")}</span>
          <h2>{t("howTitle")}</h2>
        </div>
        <ol className="cs-flow">
          <li><em>01</em><h3>{t("how1Title")}</h3><p>{t("how1Desc")}</p></li>
          <li><em>02</em><h3>{t("how2Title")}</h3><p>{t("how2Desc")}</p></li>
          <li><em>03</em><h3>{t("how3Title")}</h3><p>{t("how3Desc")}</p></li>
          <li><em>04</em><h3>{t("how4Title")}</h3><p>{t("how4Desc")}</p></li>
        </ol>
      </section>

      {/* PRINSIP */}
      <section id="cs-why" className="cs-why">
        <p className="cs-quote">{t("whyQuote1")}<br />{t("whyQuote2")}</p>
        <p className="cs-why-sub">{t("whySub")}</p>
        <div className="cs-principles">
          <div><b>{t("why1Title")}</b><span>{t("why1Desc")}</span></div>
          <div><b>{t("why2Title")}</b><span>{t("why2Desc")}</span></div>
          <div><b>{t("why3Title")}</b><span>{t("why3Desc")}</span></div>
        </div>
      </section>

      {/* CTA AKHIR */}
      <section className="cs-final">
        <div className="cs-final-card">
          <h2>{t("finalTitle1")}<br />{t("finalTitle2")}</h2>
          <p>{t("finalSub")}</p>
          <button className="cs-btn cs-btn-grad cs-btn-lg" onClick={onSignup}>{t("finalCta")} <Arrow size={17} /></button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="cs-foot">
        <div className="cs-fbrand"><span className="cs-mark">Z</span>ZENAI</div>
        <span>{t("tagline")}</span>
        <span>© 2026 ZENAI</span>
      </footer>
    </div>
  );
}
