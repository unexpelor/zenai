# ZENAI — Total Dashboard Redesign Prompt

##  Mission Objective
Redesain TOTAL tampilan dashboard ZenAI dari nol. Logika bisnis dan state management TIDAK BOLEH disentuh — hanya UI/UX layer. Tidak boleh ada satu pun class CSS lama yang tersisa; seluruh tampilan dibangun ulang dengan design system baru.

---

##  Context: Apa itu ZenAI
ZenAI adalah **AI-powered business decision dashboard** untuk pemilik usaha kecil-menengah di Indonesia. Pengguna bercerita tentang usahanya (teks/foto/suara), lalu ZenAI memberikan:
- Profil usaha
- Business Pulse (kondisi terkini)
- Diagnosis masalah
- Perspektif pasar
- Strategi & tindakan
- Laporan keuangan
- Simulasi keputusan bisnis

---

##  Stack Saat Ini
- **Next.js 15** + **React 19** (App Router)
- Pure CSS di `app/globals.css` (~1700 baris, namespace `.zenai-home-*`, `.cs-*`, `.zenai-*`, override layer bertumpuk)
- Komponen landing: `components/ZenLanding.jsx`
- Semua state & logic di satu file: `app/page.js` (~8659 baris)
- **Tidak ada Tailwind, tidak ada UI library**
- Font: Inter + Space Grotesk (dari Google Fonts)

---

##  Rencana Arsitektur Baru

### Tahap 1 — Bersihkan CSS Lama
1. Hapus SEMUA isi `app/globals.css` kecuali:
   - CSS reset (`*, *::before, *::after { box-sizing }`)
   - `:focus-visible` accessibility
   - `prefers-reduced-motion` respect
   - Font import (Inter + Space Grotesk dari Google Fonts)
2. Tidak boleh ada namespace `.zenai-*`, `.cs-*`, `.zenai-home-*`, override layer `z2`, `z3`, atau apapun dari CSS lama yang tersisa.

### Tahap 2 — Install Dependencies & Setup Infrastruktur
```bash
npm install tailwindcss @tailwindcss/postcss postcss
npm install framer-motion
npm install next-intl
npm install lucide-react
```

Setup:
- `tailwind.config.js` / PostCSS config sesuai Next.js 15
- `app/globals.css` import `@tailwind base/components/utilities`
- Custom CSS variables di `:root` untuk theme tokens
- Setup `next-intl` untuk i18n (EN + ID):
  - Buat `messages/en.json` dan `messages/id.json`
  - Buat `i18n/request.ts` dan `i18n/routing.ts`
  - Middleware untuk detect/switch locale

### Tahap 3 — Design System Tokens (CSS Variables)
```css
:root {
  /* Base */
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --border-light: #e2e8f0;
  --border-medium: #cbd5e1;

  /* Brand — indigo→cyan→violet gradient */
  --brand-500: #6366f1;
  --brand-600: #4f46e5;
  --brand-gradient: linear-gradient(135deg, #6366f1, #06b6d4, #8b5cf6);

  /* Accent */
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;

  /* Glass */
  --glass-bg: rgba(255, 255, 255, 0.72);
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-shadow: 0 8px 32px rgba(15, 23, 42, 0.08);
  --glass-blur: blur(16px);

  /* Elevation */
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.06);
  --shadow-lg: 0 12px 40px rgba(15, 23, 42, 0.1);
  --shadow-xl: 0 24px 60px rgba(15, 23, 42, 0.14);

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Motion */
  --ease-spring: cubic-bezier(0.2, 0.8, 0.2, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
}

.dark {
  --bg-primary: #0b1120;
  --bg-secondary: #111827;
  --bg-tertiary: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;
  --glass-bg: rgba(17, 24, 39, 0.78);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
}
```

### Tahap 4 — i18n (next-intl)
Setup lengkap next-intl:
```
messages/
  en.json   ← semua string UI dalam bahasa Inggris
  id.json   ← semua string UI dalam bahasa Indonesia
```

**Struktur messages/en.json (contoh):**
```json
{
  "nav": {
    "dashboard": "Dashboard",
    "capture": "Tell Your Business",
    "pulse": "Business Condition",
    "diagnosis": "Diagnosis",
    "perspective": "Business Perspective",
    "strategy": "Strategy & Actions",
    "finance": "Financial Report",
    "advanced": "Advanced Analysis",
    "guide": "Guide",
    "settings": "Settings",
    "logout": "Log Out",
    "darkMode": "Dark Mode",
    "lightMode": "Light Mode",
    "language": "Language"
  },
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "search": "Search",
    "noData": "No data available",
    "confirm": "Confirm",
    "back": "Back",
    "next": "Next",
    "close": "Close",
    "menu": "Menu"
  },
  "auth": {
    "login": "Log In",
    "signup": "Sign Up",
    "email": "Email",
    "password": "Password",
    "loginPrompt": "Already have an account?",
    "signupPrompt": "Don't have an account?",
    "logoutConfirm": "Are you sure you want to log out?"
  },
  "home": {
    "welcome": "Welcome back",
    "subtitle": "Your business at a glance",
    "noBusiness": "Tell us about your business to get started",
    "startCapture": "Tell Your Business"
  },
  "pulse": {
    "title": "Business Pulse",
    "status": "Status",
    "summary": "Summary",
    "positive": "What's Working",
    "attention": "Needs Attention",
    "priority": "Priority Actions",
    "runPulse": "Analyze Condition"
  },
  "diagnosis": {
    "title": "Business Diagnosis",
    "mainProblem": "Main Problem",
    "strengths": "Strengths",
    "problems": "Problems",
    "opportunities": "Opportunities",
    "runDiagnosis": "Run Diagnosis"
  },
  "finance": {
    "title": "Financial Report",
    "income": "Revenue",
    "expense": "Expenses",
    "profit": "Net Profit",
    "cashFlow": "Cash Flow",
    "addTransaction": "Add Transaction",
    "period": "Period",
    "comparison": "Comparison Period"
  },
  "strategy": {
    "title": "Strategy & Actions",
    "evaluate": "Evaluate Growth",
    "actions": "Action Plan",
    "days": "Days",
    "markComplete": "Mark Complete",
    "updates": "Business Updates"
  },
  "settings": {
    "title": "Settings",
    "theme": "Theme",
    "language": "Display Language",
    "english": "English",
    "indonesian": "Bahasa Indonesia"
  }
}
```

**messages/id.json — mirror struktur yang sama, isi bahasa Indonesia.**

### Tahap 5 — Komponen Baru (Ganti Semua)
Buat file-file ini di `components/`:

#### `components/Sidebar.jsx`
```
- Glassmorphism sidebar (backdrop-filter blur)
- Logo ZENAI di atas dengan animasi pulse halus
- Nav items dengan icon Lucide, active state dengan gradient indicator
- Bottom section: language toggle (EN/ID flag), theme toggle, user menu, logout
- Mobile: slide-in drawer dengan overlay transparan
- Animasi: stagger entrance setiap nav item (framer-motion)
```

#### `components/TopBar.jsx`
```
- Sticky top bar dengan glassmorphism
- Breadcrumb atau page title dinamis
- User greeting + avatar (default inisial)
- Quick actions: language + theme toggles
- Mobile: hamburger menu trigger
```

#### `components/DashboardHome.jsx`
```
- Welcome section dengan gradient text hero
- Metric cards (4 kolom grid): pendapatan, laba, arus kas, margin
  - Tiap card: glass card dengan hover lift animation
  - Angka pakai counting animation (framer-motion spring)
  - Trend indicator (↑ hijau / ↓ merah)
- Quick insight panel: gradient border card dengan AI summary
- Recent activity timeline
```

#### `components/BusinessCapture.jsx`
```
- Input area yang luas dengan placeholder friendly
- Voice record button dengan waveform animation saat recording
- Image upload zone dengan drag-and-drop + preview
- Submit button dengan loading state (animated gradient skeleton)
```

#### `components/BusinessPulse.jsx`
```
- Status badge besar (animasi pulse)
- Ringkasan dalam typography yang readable
- Grid 2 kolom: Positive vs Attention
- Priority actions list dengan checkbox interaktif
```

#### `components/DiagnosisView.jsx`
```
- Main problem highlight card (gradient border, subtle glow)
- Strengths & Problems dalam accordion atau tab
- Opportunity cards dengan hover animation
- Status indicator per item (color-coded dots)
```

#### `components/FinanceModule.jsx`
```
- Tab: Ringkasan / Transaksi / Posisi Keuangan
- Summary cards: Pendapatan, HPP, Beban, Laba (4 grid)
- Comparison period selector yang clean
- Tabel transaksi dengan zebra stripe dan hover highlight
- Form transaksi: modal overlay atau slide-in panel
- Insight panel dengan AI-generated analysis
```

#### `components/StrategyView.jsx`
```
- Business updates list dengan timeline aesthetic
- Action cards yang bisa di-check/di-complete
- Progress ring untuk days remaining
- Add update inline form
```

#### `components/AdvancedAnalysis.jsx`
```
- Decision type selector: pricing/sales/cost/investment/custom
- Input form dengan layout 2 kolom
- Results: simulation comparison table
- Assessment badge (Menguntungkan / Perlu Dipertimbangkan / Tidak Menguntungkan)
- Boundary indicator dengan visual gauge
```

#### `components/LanguageSwitcher.jsx`
```
- Toggle button EN/ID dengan animasi bendera
- Simpan preferensi ke localStorage + cookie (untuk next-intl middleware)
- Dropdown atau inline toggle yang compact
```

#### `components/ThemeToggle.jsx`
```
- Sun/Moon icon dengan animasi rotate
- Smooth transition antar mode
```

### Tahap 6 — Animasi & Micro-Interactions (framer-motion)
Semua animasi pakai `framer-motion`:

| Element | Animation |
|---|---|
| Page enter | `fadeInUp` — opacity 0→1, y 20→0, durasi 400ms, ease spring |
| Metric cards | Stagger children — tiap card delay 80ms, y 30→0 + opacity |
| Sidebar nav items | Stagger dari atas ke bawah, x -20→0 |
| Number counters | `useSpring` untuk counting animation (0 → target value) |
| Card hover | `whileHover={{ y: -6, scale: 1.02 }}` dengan shadow increase |
| Button click | `whileTap={{ scale: 0.97 }}` |
| Modal/sheet | Scale 0.95→1 + opacity + backdrop blur |
| Loading skeleton | Shimmer animation — gradient bergerak left→right |
| Recording indicator | Pulse ring animation (scale 1→1.3, opacity 1→0) |
| Tab switch | AnimatePresence dengan fade + slide horizontal pendek |
| Notification/toast | Slide in dari atas kanan, auto-dismiss 4 detik |
| List items | Stagger entrance dengan delay per index |

**Background ambient:**
- Grid pattern subtle (seperti `bg-grid-slate-100` tapi custom)
- Radial gradient orbs yang bergerak sangat lambat (CSS animation, 20s loop)
- Light mode: biru muda + cyan di pojok kanan atas
- Dark mode: indigo + violet di area yang sama

### Tahap 7 — Rewrite `app/page.js`
1. **JANGAN hapus logic/state satupun.** Hanya ganti JSX markup, import komponen baru, dan bungkus state ke komponen.
2. Semua inline style dihapus — ganti dengan Tailwind classes.
3. Semua string hardcoded Bahasa Indonesia → ganti dengan `useTranslations()` dari next-intl.
4. Struktur:
```jsx
export default function Home() {
  // ... SEMUA STATE + LOGIC TETAP ADA, TIDAK BOLEH DIHAPUS ...

  const t = useTranslations();

  if (!session && !authReady) return <LoadingScreen />;
  if (!session) return <AuthScreen />;
  if (!business) return <BusinessCapture />;

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {tab === 'home' && <DashboardHome key="home" />}
            {tab === 'capture' && <BusinessCapture key="capture" />}
            {tab === 'pulse' && <BusinessPulse key="pulse" />}
            {/* ... dan seterusnya */}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
```

### Tahap 8 — Rewrite `app/layout.js`
```jsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import './globals.css';

export default async function RootLayout({ children }) {
  const messages = await getMessages();
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Tahap 9 — Rewrite `components/ZenLanding.jsx`
Halaman landing public (sebelum login):
- Tetap mempertahankan struktur section yang ada
- Ganti semua class `cs-*` dengan Tailwind
- Support i18n
- Hero section dengan animated gradient text
- Mock dashboard preview dengan glass card
- Feature grid dengan hover animations

---

##  Aturan Mutlak (NON-NEGOTIABLE)

1. **JANGAN SENTUH LOGIC.** State, useEffect, function handler, API call, Supabase — semua tetap utuh. Hanya ganti JSX + styling.
2. **JANGAN ADA SISA CSS LAMA.** Setiap class `.zenai-*`, `.cs-*`, override lama di `globals.css` harus DIHAPUS.
3. **TAILWIND FIRST.** Semua styling pakai Tailwind utility classes. CSS custom hanya untuk: CSS variables, keyframes, glassmorphism utilities, dan hal yang tidak bisa di-express dengan Tailwind.
4. **DARK MODE HARUS JALAN.** `.dark` class di `<html>` toggle semua variabel. Transisi warna smooth (`transition-colors duration-300`).
5. **RESPONSIVE.** Mobile-first. Breakpoint: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.
6. **ACCESSIBILITY.** Focus ring visible, `aria-label` di icon buttons, color contrast minimal AA.
7. **PERFORMANCE.** Animasi GPU-accelerated (`transform` + `opacity` only). `will-change` untuk elemen yang di-animasikan. Lazy load komponen berat.
8. **i18n COMPLETE.** Tidak boleh ada string hardcoded. Semua lewat `t('key')` dari next-intl.
9. **BAHASA INDONESIA + INGGRIS.** Semua string harus ada di kedua file messages.
10. **LUCIDE ICONS.** Semua icon pakai `lucide-react`. Tidak boleh hardcode SVG inline (kecuali logo ZENAI).

---

##  Spesifikasi Tampilan Per Komponen

### Sidebar
```
┌──────────────┐
│  ◆ ZENAI     │  ← logo + nama
│              │
│  ▦ Dashboard │  ← active: gradient left border + bg accent
│  ▤ Capture   │
│  ◔ Pulse     │
│  ◉ Diagnosis │
│  ◈ Market    │
│  ⇢ Strategy  │
│  ▧ Finance   │
│  ✦ Advanced  │
│              │
│  ──────────  │
│  ? Guide     │
│  ⚙ Settings  │
│              │
│  [EN|ID]     │  ← language toggle
│  ☀/🌙        │  ← theme toggle
│  👤 User →   │  ← logout
└──────────────┘
```
- Width: 260px (desktop), full-width drawer (mobile)
- Background: glassmorphism (blur + semi-transparent)
- Active item: gradient left border + subtle background highlight
- Logo area: sedikit lebih terang dari background sidebar

### Dashboard Home
```
┌──────────────────────────────────────────────┐
│  Welcome back, [User]          [EN|ID] [☀]  │
│  Your business at a glance                   │
├──────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐  │
│  │Revenue │ │Profit  │ │Cash    │ │Margin│  │
│  │42.8jt  │ │8.1jt   │ │9.4jt   │ │19%   │  │
│  │↑12.4%  │ │↑6.8%   │ │Stable  │ │      │  │
│  └────────┘ └────────┘ └────────┘ └──────┘  │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  AI Insight                          │    │
│  │  "Biaya operasional naik lebih       │    │
│  │   cepat dari pendapatan..."          │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  Recent Activity Timeline            │    │
│  │  • Updated financial report          │    │
│  │  • Ran business diagnosis            │    │
│  │  • Added new transaction             │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

---

##  Verifikasi Checklist
Setelah selesai, pastikan:
- [ ] `npm run build` SUCCESS tanpa error
- [ ] `npm run dev` berjalan, dashboard muncul
- [ ] Login/logout masih berfungsi
- [ ] Semua 8 tab/modul bisa dibuka
- [ ] Dark mode toggle berfungsi
- [ ] Language toggle EN↔ID berfungsi, semua teks berubah
- [ ] Mobile responsive — sidebar jadi drawer
- [ ] Animasi tidak lag di mobile
- [ ] Tidak ada class CSS lama yang tersisa
- [ ] Tidak ada string hardcoded (semua lewat `t()`)
- [ ] Semua logic/fungsi asli masih berfungsi (capture, pulse, diagnosis, finance, strategy, advanced analysis)
- [ ] Supabase sync masih bekerja
- [ ] Audio recording masih berfungsi
- [ ] Image upload masih berfungsi

---

##  Output Yang Diharapkan
1. `app/globals.css` — clean, hanya reset + Tailwind directives + CSS variables + keyframes
2. `tailwind.config.js` — config Tailwind dengan custom theme tokens
3. `app/layout.js` — rewrite dengan next-intl provider
4. `app/page.js` — rewrite JSX, pertahankan semua logic
5. `components/Sidebar.jsx` — baru
6. `components/TopBar.jsx` — baru
7. `components/DashboardHome.jsx` — baru
8. `components/BusinessCapture.jsx` — refactor dari Capture tab
9. `components/BusinessPulse.jsx` — refactor dari Pulse tab
10. `components/DiagnosisView.jsx` — refactor dari Diagnosis tab
11. `components/FinanceModule.jsx` — refactor dari Finance tab
12. `components/StrategyView.jsx` — refactor dari Strategy tab
13. `components/AdvancedAnalysis.jsx` — refactor dari Advanced tab
14. `components/LanguageSwitcher.jsx` — baru
15. `components/ThemeToggle.jsx` — baru
16. `components/AuthScreen.jsx` — refactor dari auth UI
17. `components/LoadingScreen.jsx` — baru
18. `messages/en.json` — semua string English
19. `messages/id.json` — semua string Indonesia
20. `i18n/request.ts` — next-intl config
21. `i18n/routing.ts` — routing config
22. `middleware.ts` — locale detection

---

##  Referensi Visual
- **Style reference**: Linear, Vercel, Stripe dashboard — clean, editorial, data-first
- **Glassmorphism**: backdrop-filter blur, subtle border, semi-transparent bg
- **Color palette**: Indigo (#6366f1) → Cyan (#06b6d4) → Violet (#8b5cf6) gradient sebagai aksen
- **Typography**: Inter untuk body/UI, Space Grotesk untuk headings/numbers
- **Motion**: Apple-esque spring physics, subtle bukan berlebihan