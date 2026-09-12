"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "../lib/supabase/client";
import BusinessGrowthLoop from "../components/BusinessGrowthLoop";
import ZenLanding from "../components/ZenLanding";
function ZenIcon({ name, size = 18, strokeWidth = 1.9 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    capture: <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
    activity: <><path d="M3 12h4l3-8 4 16 3-8h4"/></>,
    diagnosis: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/><path d="M11 8v6M8 11h6"/></>,
    perspective: <><path d="M12 3 3 7.5 12 12l9-4.5Z"/><path d="M5 10v5c0 2 3.1 4 7 4s7-2 7-4v-5"/></>,
    strategy: <><path d="M9 18h6"/><path d="M10 22h4"/><path d="M8 14a6 6 0 1 1 8 0c-.8.6-1 1.5-1 2H9c0-.5-.2-1.4-1-2Z"/></>,
    finance: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/></>,
    intelligence: <><path d="M9.5 3.5a3.5 3.5 0 0 0-3 5.3A4.5 4.5 0 0 0 8 17h1.5"/><path d="M14.5 3.5a3.5 3.5 0 0 1 3 5.3A4.5 4.5 0 0 1 16 17h-1.5"/><path d="M9 12h6M10 7h4M10 17h4"/></>,
    guide: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.8c-1.1 1-1.8 1.4-1.8 2.7"/><path d="M12 17h.01"/></>,
    settings: <><circle cx="12" cy="12" r="3.5"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.4 1.4-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L9 17.4l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H7v-2h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L8.2 9.4 9.6 8l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V6h2v.9a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19 9.4l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.9v2h-.9a1.7 1.7 0 0 0-1.5.6Z"/></>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 19V5a2 2 0 0 0-2-2h-6"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
  };
  return <svg {...common}>{paths[name] || paths.dashboard}</svg>;
}
export default function Home() {
  const supabase = createClient();
  const [authReady, setAuthReady] = useState(false);
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [showAuth, setShowAuth] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [cloudSaving, setCloudSaving] = useState(false);
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const cloudHydratedRef = useRef(false);
  const cloudSaveTimerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("zenai_theme") === "dark";
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("zenai_theme", darkMode ? "dark" : "light");
    } catch (error) {
      console.error("Gagal menyimpan tema:", error);
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    document.body.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);


useEffect(() => {
  const checkScreen = () => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    // Pada Android/HP, sidebar mulai dalam kondisi tertutup agar konten langsung memenuhi layar.
    if (mobile) setSidebarOpen(false);
  };

  checkScreen();
  window.addEventListener("resize", checkScreen);

  return () => {
    window.removeEventListener("resize", checkScreen);
  };
}, []);

  const [tab, setTab] = useState("capture");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const [audio, setAudio] = useState("");
  const [audioName, setAudioName] = useState("");
  const [audioMimeType, setAudioMimeType] =
    useState("");

  const [isRecording, setIsRecording] =
    useState(false);

  const [recordingTime, setRecordingTime] =
    useState(0);

  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState("");

  const [business, setBusiness] =
    useState(null);

  const [pulseData, setPulseData] =
    useState(null);

  const [diagnosis, setDiagnosis] =
    useState(null);

  const [autopilotData, setAutopilotData] =
    useState(null);

const [marketData, setMarketData] =
  useState(null);

const [marketLoading, setMarketLoading] =
  useState(false);

const [marketError, setMarketError] =
  useState("");

  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState("");

  const getAccessToken = async () => {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || null;
  };

  const runLiveHealthCheck = async () => {
    setHealthLoading(true); setHealthError("");
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Sesi pengguna tidak tersedia.");
      const response = await fetch("/api/health", { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error(result?.message || "Health check gagal.");
      setHealthData(result);
    } catch (error) {
      console.error("LIVE HEALTH CHECK ERROR:", error);
      setHealthError(error?.message || "Health check gagal dijalankan.");
    } finally { setHealthLoading(false); }
  };

  const runLiveAiSmokeTest = async () => {
    setHealthLoading(true); setHealthError("");
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Sesi pengguna tidak tersedia.");
      const started = performance.now();
      const response = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify({ prompt: "Balas hanya dengan kata PASS.", system: "Smoke test. Jawab tepat: PASS", jsonMode: false }), cache: "no-store" });
      const result = await response.json().catch(() => null);
      const latency = Math.round(performance.now() - started);
      if (!response.ok || !result?.success) throw new Error(result?.message || "AI smoke test gagal.");
      setHealthData((previous) => ({ ...(previous || {}), checkedAt: new Date().toISOString(), liveAiSmokeTest: { status: "operational", provider: result.provider || "Unknown", latencyMs: latency, response: String(result.text || "").trim().slice(0, 20) } }));
    } catch (error) {
      console.error("LIVE AI SMOKE TEST ERROR:", error);
      setHealthError(error?.message || "AI smoke test gagal.");
    } finally { setHealthLoading(false); }
  };

  const [businessUpdates, setBusinessUpdates] =
    useState([]);

  const [growthActions, setGrowthActions] =
    useState([]);

  const [growthEvaluating, setGrowthEvaluating] =
    useState(false);

  const [updateText, setUpdateText] =
    useState("");

  const [days, setDays] = useState(7);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  // =========================
  // LAPORAN KEUANGAN
  // Data keuangan tidak disimpan di localStorage.
  // Saat pengguna login, source of truth adalah Supabase cloud state.
  // Jika Supabase tidak dikonfigurasi, data hanya berada di memory sesi.
  // =========================
  const [financePeriod, setFinancePeriod] =
    useState(new Date().toISOString().slice(0, 7));

  // Periode pembanding dapat dipilih secara manual oleh pengguna.
  const [financeComparisonPeriod, setFinanceComparisonPeriod] = useState(() => {
    const now = new Date();
    const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return `${previous.getFullYear()}-${String(previous.getMonth() + 1).padStart(2, "0")}`;
  });

  const [financeTransactions, setFinanceTransactions] =
    useState([]);

  const [financeForm, setFinanceForm] =
    useState({
      date: new Date().toISOString().slice(0, 10),
      description: "",
      amount: "",
      type: "income",
      account: "bank"
    });

  const [editingFinanceId, setEditingFinanceId] =
    useState(null);

  const [financeView, setFinanceView] =
    useState("summary");

  // =========================
  // ZENAI ANALISIS LANJUTAN
  // Modul untuk mengevaluasi kondisi, risiko, skenario, dan keputusan bisnis secara terukur.
  // =========================
  const [decisionText, setDecisionText] = useState("");
  const [decisionResult, setDecisionResult] = useState(null);
  const [decisionRunning, setDecisionRunning] = useState(false);
  const [decisionScenario, setDecisionScenario] = useState({
    currentPrice: "",
    plannedPrice: "",
    volumeChange: "",
    hppChange: "",
    expenseChange: "",
    investmentAmount: "",
    expectedRevenue: "",
    incrementalHppRate: "",
    incrementalExpense: "",
    revenueChange: "",
    cashImpact: ""
  });
  const [decisionType, setDecisionType] = useState("custom");

  const [financeMessage, setFinanceMessage] =
    useState("");

  const financePersistenceNotice = supabase
    ? "Data keuangan tersimpan di akun Supabase Anda."
    : "Mode tanpa Supabase: data keuangan hanya tersimpan selama sesi ini dan tidak disimpan ke browser.";

  const financeTypes = [
    { value: "income", label: "Penjualan / Pendapatan" },
    { value: "expense", label: "Biaya Usaha" },
    { value: "hpp", label: "Pembelian / HPP" },
    { value: "capital", label: "Modal Masuk" },
    { value: "withdrawal", label: "Prive / Ambil Uang" },
    { value: "receivable", label: "Terima Piutang" },
    { value: "loan", label: "Pinjaman Masuk" }
  ];

  const financeAccounts = [
    { value: "cash", label: "Kas" },
    { value: "bank", label: "Bank" },
    { value: "receivable", label: "Piutang" }
  ];

  // =========================
  // BUSINESS UPDATES / HISTORY
  // Must be declared before cloud persistence effects because the cloud
  // save effect depends on businessUpdates.
  // =========================
  const clearUserScopedState = () => {
    setBusiness(null);
    setPulseData(null);
    setDiagnosis(null);
    setAutopilotData(null);
    setMarketData(null);
    setMarketError("");
    setBusinessUpdates([]);
    setGrowthActions([]);
    setFinanceTransactions([]);
    setFinancePeriod(new Date().toISOString().slice(0, 7));
    setText("");
    setImage("");
    setAudio("");
    setAudioName("");
    setAudioMimeType("");
    setProvider("");
    setUpdateText("");
    setFinanceMessage("");
    setEditingFinanceId(null);
    setDecisionText("");
    setDecisionResult(null);
    setDecisionRunning(false);
    setTab("capture");
  };

  // =========================
  // CLOUD PERSISTENCE
  // Semua hasil penting ZenAI disimpan ke Supabase berdasarkan user.
  // Data sensitif seperti transaksi keuangan tidak memakai localStorage.
  // =========================
  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    let active = true;

    const loadCloudState = async (currentSession) => {
      if (!currentSession?.user?.id) {
        clearUserScopedState();
        if (active) {
          setSession(null);
          setAuthReady(true);
          setCloudLoaded(false);
        }
        return;
      }

      if (active) {
        clearUserScopedState();
        setSession(currentSession);
      }

      const { data, error } = await supabase
        .from("zenai_user_state")
        .select("state")
        .eq("user_id", currentSession.user.id)
        .maybeSingle();

      if (error) {
        console.error("Gagal memuat data ZenAI:", error);
        if (active) setAuthMessage("Data cloud belum dapat dimuat. Coba refresh.");
      } else if (data?.state && active) {
        const saved = data.state;
        if (saved.business !== undefined) setBusiness(saved.business);
        if (saved.pulseData !== undefined) setPulseData(saved.pulseData);
        if (saved.diagnosis !== undefined) setDiagnosis(saved.diagnosis);
        if (saved.autopilotData !== undefined) setAutopilotData(saved.autopilotData);
        if (saved.marketData !== undefined) setMarketData(saved.marketData);
        if (Array.isArray(saved.businessUpdates)) setBusinessUpdates(saved.businessUpdates);
        if (Array.isArray(saved.growthActions)) setGrowthActions(saved.growthActions);
        if (Array.isArray(saved.financeTransactions)) setFinanceTransactions(saved.financeTransactions);
        if (saved.financePeriod) setFinancePeriod(saved.financePeriod);
        if (saved.financeComparisonPeriod) setFinanceComparisonPeriod(saved.financeComparisonPeriod);
        if (saved.decisionScenario) setDecisionScenario(saved.decisionScenario);
        if (saved.decisionType) setDecisionType(saved.decisionType);
        if (saved.decisionText !== undefined) setDecisionText(saved.decisionText || "");
        if (saved.decisionResult !== undefined) setDecisionResult(saved.decisionResult || null);
        if (saved.tab) setTab(saved.tab);
      }

      if (active) {
        cloudHydratedRef.current = true;
        setCloudLoaded(true);
        setAuthReady(true);
      }
    };

    supabase.auth.getSession().then(({ data }) => loadCloudState(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession) {
        cloudHydratedRef.current = false;
        setCloudLoaded(false);
        clearUserScopedState();
        setSession(null);
        setAuthReady(true);
        return;
      }
      loadCloudState(nextSession);
    });

    return () => {
      active = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !session?.user?.id || !cloudHydratedRef.current) return;

    if (cloudSaveTimerRef.current) {
      clearTimeout(cloudSaveTimerRef.current);
    }

    cloudSaveTimerRef.current = setTimeout(async () => {
      setCloudSaving(true);
      const { error } = await supabase
        .from("zenai_user_state")
        .upsert(
          {
            user_id: session.user.id,
            state: {
              business,
              pulseData,
              diagnosis,
              autopilotData,
              marketData,
              businessUpdates,
              growthActions,
              financeTransactions,
              financePeriod,
              financeComparisonPeriod,
              decisionScenario,
              decisionType,
              decisionText,
              decisionResult,
              tab
            },
            updated_at: new Date().toISOString()
          },
          { onConflict: "user_id" }
        );

      if (error) {
        console.error("Gagal menyimpan data ZenAI:", error);
      }

      setCloudSaving(false);
    }, 700);

    return () => {
      if (cloudSaveTimerRef.current) clearTimeout(cloudSaveTimerRef.current);
    };
  }, [
    session?.user?.id,
    business,
    pulseData,
    diagnosis,
    autopilotData,
    marketData,
    businessUpdates,
    growthActions,
    financeTransactions,
    financePeriod,
    decisionScenario,
    decisionType,
    decisionText,
    decisionResult,
    tab
  ]);

  const handleAuth = async (event) => {
    event.preventDefault();

    if (!supabase) {
      setAuthMessage("Supabase belum dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
      return;
    }

    if (!authEmail.trim() || authPassword.length < 6) {
      setAuthMessage("Masukkan email dan password minimal 6 karakter.");
      return;
    }

    setAuthLoading(true);
    setAuthMessage("");

    const result = authMode === "signup"
      ? await supabase.auth.signUp({
          email: authEmail.trim(),
          password: authPassword
        })
      : await supabase.auth.signInWithPassword({
          email: authEmail.trim(),
          password: authPassword
        });

    if (result.error) {
      setAuthMessage(result.error.message);
    } else if (authMode === "signup" && !result.data.session) {
      setAuthMessage("Akun berhasil dibuat. Cek email untuk verifikasi, lalu masuk.");
      setAuthMode("login");
    } else {
      setAuthMessage("Berhasil masuk.");
    }

    setAuthLoading(false);
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    cloudHydratedRef.current = false;
    setCloudLoaded(false);
    clearUserScopedState();
    setSession(null);
  };

  const formatRupiah = (value) => {
    const number = Number(value) || 0;

    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
      }
    ).format(number);
  };

  const financePeriodLabel = (period) => {
    const value = String(period || "");
    const match = /^(\d{4})-(\d{2})$/.exec(value);

    if (!match) return "periode tidak valid";

    const year = Number(match[1]);
    const month = Number(match[2]);

    if (month < 1 || month > 12) return "periode tidak valid";

    const date = new Date(year, month - 1, 1);

    return date.toLocaleDateString(
      "id-ID",
      {
        month: "long",
        year: "numeric"
      }
    );
  };

  const financeCurrent = (Array.isArray(financeTransactions) ? financeTransactions : []).filter(
    (item) =>
      item &&
      typeof item.date === "string" &&
      item.date.slice(0, 7) === financePeriod
  );

  // Periode kedua dipilih manual, bukan otomatis dihitung oleh sistem.
  const financePreviousPeriod = financeComparisonPeriod;

  const financePrevious = (Array.isArray(financeTransactions) ? financeTransactions : []).filter(
    (item) =>
      item &&
      typeof item.date === "string" &&
      item.date.slice(0, 7) === financePreviousPeriod
  );

  // Laporan posisi keuangan menggunakan saldo kumulatif sampai akhir periode,
  // sedangkan laba rugi dan arus kas tetap menggunakan transaksi periode terpilih.
  const financeThroughCurrent = (Array.isArray(financeTransactions) ? financeTransactions : []).filter(
    (item) => item && typeof item.date === "string" && item.date.slice(0, 7) <= financePeriod
  );

  const financeThroughPrevious = (Array.isArray(financeTransactions) ? financeTransactions : []).filter(
    (item) => item && typeof item.date === "string" && item.date.slice(0, 7) <= financePreviousPeriod
  );

  const calculateFinance = (periodItems, balanceItems = periodItems) => {
    const result = {
      income: 0,
      hpp: 0,
      expense: 0,
      capital: 0,
      withdrawal: 0,
      receivable: 0,
      debt: 0,
      loan: 0,
      cash: 0,
      bank: 0,
      inventory: 0,
      cashIn: 0,
      cashOut: 0,
      cashChange: 0
    };

    const amountOf = (item) => Math.max(0, Number(item.amount) || 0);
    const accountOf = (item) => item.account === "cash" ? "cash" : "bank";

    // Saldo aset/kewajiban/modal dihitung dari seluruh transaksi sampai periode akhir.
    balanceItems.forEach((item) => {
      const amount = amountOf(item);
      const account = accountOf(item);

      if (item.type === "income") {
        if (item.account === "receivable") {
          result.receivable += amount;
        } else {
          result[account] += amount;
        }
      } else if (item.type === "expense" || item.type === "hpp") {
        result[account] -= amount;
      } else if (item.type === "capital") {
        result[account] += amount;
      } else if (item.type === "withdrawal") {
        result[account] -= amount;
      } else if (item.type === "receivable") {
        result.receivable -= amount;
        result[account] += amount;
      } else if (item.type === "loan") {
        result.debt += amount;
        result.loan += amount;
        result[account] += amount;
      }
    });

    // Laba rugi periode terpilih.
    periodItems.forEach((item) => {
      const amount = amountOf(item);

      if (item.type === "income") {
        result.income += amount;
        if (item.account !== "receivable") result.cashIn += amount;
      } else if (item.type === "hpp") {
        result.hpp += amount;
        result.cashOut += amount;
      } else if (item.type === "expense") {
        result.expense += amount;
        result.cashOut += amount;
      } else if (item.type === "capital") {
        result.cashIn += amount;
      } else if (item.type === "withdrawal") {
        result.cashOut += amount;
      } else if (item.type === "receivable") {
        result.cashIn += amount;
      } else if (item.type === "loan") {
        result.cashIn += amount;
      }
    });

    const cumulativeIncome = balanceItems.reduce(
      (sum, item) => sum + (item.type === "income" ? amountOf(item) : 0), 0
    );
    const cumulativeHpp = balanceItems.reduce(
      (sum, item) => sum + (item.type === "hpp" ? amountOf(item) : 0), 0
    );
    const cumulativeExpense = balanceItems.reduce(
      (sum, item) => sum + (item.type === "expense" ? amountOf(item) : 0), 0
    );
    const cumulativeCapital = balanceItems.reduce(
      (sum, item) => sum + (item.type === "capital" ? amountOf(item) : 0), 0
    );
    const cumulativeWithdrawal = balanceItems.reduce(
      (sum, item) => sum + (item.type === "withdrawal" ? amountOf(item) : 0), 0
    );

    result.grossProfit = result.income - result.hpp;
    result.netProfit = result.grossProfit - result.expense;
    result.cumulativeNetProfit = cumulativeIncome - cumulativeHpp - cumulativeExpense;
    result.capital = cumulativeCapital;
    result.withdrawal = cumulativeWithdrawal;
    result.cashTotal = result.cash + result.bank;
    result.cashChange = result.cashIn - result.cashOut;
    result.totalAssets = result.cashTotal + result.receivable + result.inventory;
    result.totalEquity = result.capital + result.cumulativeNetProfit - result.withdrawal;

    return result;
  };

  const financeCurrentTotals = calculateFinance(
    financeCurrent,
    financeThroughCurrent
  );

  const financePreviousTotals = calculateFinance(
    financePrevious,
    financeThroughPrevious
  );

  const financeChange = (current, previous) => {
    if (!previous) {
      return null;
    }

    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const handleFinanceSubmit = (event) => {
    event.preventDefault();

    const amount =
      Number(financeForm.amount);

    if (
      !financeForm.description.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !financeForm.date
    ) {
      setFinanceMessage(
        "Lengkapi transaksi dan masukkan nominal yang valid."
      );
      return;
    }

    if (editingFinanceId) {
      setFinanceTransactions((current) =>
        current.map((item) =>
          item.id === editingFinanceId
            ? {
                ...item,
                date: financeForm.date,
                description:
                  financeForm.description.trim(),
                amount,
                type: financeForm.type,
                account: financeForm.account
              }
            : item
        )
      );

      setFinanceMessage(
        "Transaksi berhasil diperbarui."
      );
    } else {
      const transaction = {
        id:
          `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,
        date: financeForm.date,
        description:
          financeForm.description.trim(),
        amount,
        type: financeForm.type,
        account: financeForm.account
      };

      setFinanceTransactions((current) => [
        transaction,
        ...current
      ]);

      setFinanceMessage(
        "Transaksi berhasil dicatat."
      );
    }

    setFinanceForm({
      date: financeForm.date,
      description: "",
      amount: "",
      type: "income",
      account: "bank"
    });

    setEditingFinanceId(null);
    setFinanceView("transactions");
  };

  const editFinanceTransaction = (item) => {
    setEditingFinanceId(item.id);

    setFinanceForm({
      date: item.date,
      description: item.description,
      amount: String(item.amount),
      type: item.type,
      account: item.account
    });

    setFinanceMessage(
      "Mode edit transaksi aktif."
    );

    setFinanceView("transactions");

    window.requestAnimationFrame(() => {
      document
        .getElementById("finance-transaction-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    });
  };

  const cancelFinanceEdit = () => {
    setEditingFinanceId(null);

    setFinanceForm({
      date: new Date().toISOString().slice(0, 10),
      description: "",
      amount: "",
      type: "income",
      account: "bank"
    });

    setFinanceMessage(
      "Edit transaksi dibatalkan."
    );
  };

  const deleteFinanceTransaction = (id) => {
    setFinanceTransactions((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    if (editingFinanceId === id) {
      cancelFinanceEdit();
    }

    setFinanceMessage(
      "Transaksi dihapus."
    );
  };

  const financeDelta = (current, previous) => {
    const delta = (Number(current) || 0) - (Number(previous) || 0);
    const percentage = financeChange(current, previous);
    return { delta, percentage };
  };

  const financeChangeLabel = (current, previous, inverse = false) => {
    const { delta, percentage } = financeDelta(current, previous);
    if (Number(previous) === 0) {
      return delta === 0 ? "Tidak berubah" : "Belum ada basis pembanding";
    }
    const improving = inverse ? delta < 0 : delta > 0;
    const tone = delta === 0 ? "Stabil" : improving ? "Membaik" : "Menurun";
    return `${tone} ${delta >= 0 ? "↑" : "↓"} ${formatRupiah(Math.abs(delta))} (${Math.abs(percentage || 0).toFixed(1)}%)`;
  };

  const financeInsight = (() => {
    const current = financeCurrentTotals;
    const previous = financePreviousTotals;
    const hasCurrent = current.income !== 0 || current.expense !== 0 || current.hpp !== 0 || current.cashChange !== 0;

    if (!hasCurrent) {
      const hasPrevious =
        previous.income !== 0 ||
        previous.expense !== 0 ||
        previous.hpp !== 0 ||
        previous.cashChange !== 0;

      const linkedAnalysis = [];
      if (pulseData?.summary) linkedAnalysis.push(`Business Pulse: ${pulseData.summary}`);
      if (diagnosis?.mainProblem) linkedAnalysis.push(`Masalah utama: ${diagnosis.mainProblem}`);
      if (Array.isArray(diagnosis?.problems) && diagnosis.problems[0]?.description) {
        linkedAnalysis.push(`Diagnosis: ${diagnosis.problems[0].title || "Temuan utama"} — ${diagnosis.problems[0].description}`);
      }
      if (Array.isArray(pulseData?.priority) && pulseData.priority[0]) {
        const item = pulseData.priority[0];
        linkedAnalysis.push(`Prioritas ZENAI: ${item.title || ""}${item.action ? ` — ${item.action}` : ""}`);
      }
      if (autopilotData?.priority) linkedAnalysis.push(`Strategi aktif: ${autopilotData.priority}`);

      return {
        headline: hasPrevious
          ? `Tidak ada transaksi pada ${financePeriodLabel(financePeriod)}, sehingga belum ada kinerja baru yang dapat dibandingkan.`
          : `Belum ada transaksi pada ${financePeriodLabel(financePeriod)}.`,
        summary: hasPrevious
          ? `ZENAI tetap menampilkan periode sebelumnya sebagai konteks, tetapi tidak menganggap bulan kosong sebagai penurunan 100%. Tambahkan transaksi jika memang ada aktivitas keuangan pada periode ini.`
          : `Belum ada transaksi yang tercatat pada ${financePeriodLabel(financePeriod)}. Laporan ditampilkan sebagai nol dan tidak akan dianggap sebagai penurunan kinerja.`,
        points: hasPrevious
          ? [
              `Periode sebelumnya (${financePeriodLabel(financePreviousPeriod)}) memiliki data: pendapatan ${formatRupiah(previous.income)}, HPP ${formatRupiah(previous.hpp)}, beban ${formatRupiah(previous.expense)}, dan laba bersih ${formatRupiah(previous.netProfit)}.`,
              "Perubahan persentase tidak dihitung untuk periode kosong agar tidak menghasilkan kesimpulan yang menyesatkan.",
              "Analisis bisnis tetap menggunakan hasil ZENAI terbaru dan tidak berubah hanya karena periode laporan keuangan sedang kosong."
            ]
          : [],
        linkedAnalysis
      };
    }

    const profitChange = financeChange(current.netProfit, previous.netProfit);
    const incomeChange = financeChange(current.income, previous.income);
    const hppChange = financeChange(current.hpp, previous.hpp);
    const expenseChange = financeChange(current.expense, previous.expense);
    const cashChange = financeChange(current.cashTotal, previous.cashTotal);

    const grossMargin = current.income > 0 ? (current.grossProfit / current.income) * 100 : 0;
    const previousGrossMargin = previous.income > 0 ? (previous.grossProfit / previous.income) * 100 : 0;
    const netMargin = current.income > 0 ? (current.netProfit / current.income) * 100 : 0;
    const previousNetMargin = previous.income > 0 ? (previous.netProfit / previous.income) * 100 : 0;

    const points = [];

    if (incomeChange !== null && incomeChange !== 0) {
      points.push(
        `Pendapatan ${incomeChange > 0 ? "naik" : "turun"} ${Math.abs(incomeChange).toFixed(1)}% menjadi ${formatRupiah(current.income)}.`
      );
    }

    if (hppChange !== null && hppChange !== 0) {
      points.push(
        `HPP ${hppChange > 0 ? "naik" : "turun"} ${Math.abs(hppChange).toFixed(1)}% menjadi ${formatRupiah(current.hpp)}. ${hppChange > 0 && incomeChange !== null && hppChange > incomeChange ? "Kenaikan HPP lebih cepat daripada pertumbuhan pendapatan, sehingga margin perlu diwaspadai." : "Perubahan HPP masih perlu dibandingkan dengan perubahan pendapatan."}`
      );
    }

    if (expenseChange !== null && expenseChange !== 0) {
      points.push(
        `Beban operasional ${expenseChange > 0 ? "naik" : "turun"} ${Math.abs(expenseChange).toFixed(1)}% menjadi ${formatRupiah(current.expense)}.`
      );
    }

    if (profitChange !== null && profitChange !== 0) {
      points.push(
        `Laba bersih ${profitChange > 0 ? "meningkat" : "menurun"} ${Math.abs(profitChange).toFixed(1)}% dari ${formatRupiah(previous.netProfit)} menjadi ${formatRupiah(current.netProfit)}.`
      );
    }

    if (current.netProfit < 0) {
      points.push("Periode ini mencatat rugi bersih. Fokus utama adalah mengendalikan HPP dan biaya yang tidak menghasilkan pendapatan.");
    }

    if (previous.income > 0 && current.income > 0) {
      const marginDelta = netMargin - previousNetMargin;
      points.push(
        `Margin laba bersih ${netMargin.toFixed(1)}%, ${marginDelta >= 0 ? "naik" : "turun"} ${Math.abs(marginDelta).toFixed(1)} poin persentase dari ${previousNetMargin.toFixed(1)}% pada periode sebelumnya.`
      );
    }

    if (previous.income > 0 && current.income > 0) {
      const grossMarginDelta = grossMargin - previousGrossMargin;
      points.push(
        `Margin laba kotor ${grossMargin.toFixed(1)}%, ${grossMarginDelta >= 0 ? "naik" : "turun"} ${Math.abs(grossMarginDelta).toFixed(1)} poin persentase dibanding ${previousGrossMargin.toFixed(1)}%.`
      );
    }

    if (cashChange !== null && cashChange !== 0) {
      points.push(
        `Saldo kas dan bank ${cashChange > 0 ? "naik" : "turun"} ${Math.abs(cashChange).toFixed(1)}% menjadi ${formatRupiah(current.cashTotal)}.`
      );
    }

    const headline =
      current.netProfit < 0
        ? "️ Profitabilitas perlu segera diperbaiki."
        : profitChange !== null && profitChange > 0
        ? " Kinerja laba membaik, tetapi sumber pertumbuhannya tetap perlu diperiksa."
        : profitChange !== null && profitChange < 0
        ? "️ Laba melemah dan perlu ditelusuri penyebabnya."
        : " Kinerja keuangan relatif stabil.";

    const linkedAnalysis = [];
    if (pulseData?.summary) linkedAnalysis.push(`Business Pulse: ${pulseData.summary}`);
    if (diagnosis?.mainProblem) linkedAnalysis.push(`Masalah utama: ${diagnosis.mainProblem}`);
    if (Array.isArray(diagnosis?.problems) && diagnosis.problems[0]?.description) {
      linkedAnalysis.push(`Diagnosis: ${diagnosis.problems[0].title || "Temuan utama"} — ${diagnosis.problems[0].description}`);
    }
    if (Array.isArray(pulseData?.priority) && pulseData.priority[0]) {
      const item = pulseData.priority[0];
      linkedAnalysis.push(`Prioritas ZENAI: ${item.title || ""}${item.action ? ` — ${item.action}` : ""}`);
    }
    if (autopilotData?.priority) linkedAnalysis.push(`Strategi aktif: ${autopilotData.priority}`);

    return {
      headline,
      summary: `Periode ${financePeriodLabel(financePeriod)} dibandingkan dengan ${financePeriodLabel(financePreviousPeriod)}. ZENAI membaca perubahan nominal, persentase, margin, arus kas, serta temuan analisis bisnis yang paling terbaru.`,
      points,
      linkedAnalysis
    };
  })();


  const runDecisionSimulation = async (decisionOverride = null) => {
    const num = (key) => {
      const value = decisionScenario?.[key];
      if (value === "" || value === null || value === undefined) return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const base = financeCurrentTotals || {};
    const comparison = financePreviousTotals || {};
    const income = Number(base.income) || 0;
    const hpp = Number(base.hpp) || 0;
    const expense = Number(base.expense) || 0;
    const profit = Number(base.netProfit) || 0;
    const cash = Number(base.cashTotal) || 0;
    const baseMargin = income > 0 ? (profit / income) * 100 : 0;
    const hppRate = income > 0 ? (hpp / income) * 100 : 0;
    const expenseRate = income > 0 ? (expense / income) * 100 : 0;

    if (!income && !hpp && !expense && !cash) {
      setFinanceMessage("Periode dasar belum memiliki data keuangan yang cukup untuk disimulasikan.");
      return null;
    }

    const type = decisionType || "custom";
    const decision = String(decisionOverride ?? decisionText ?? "").trim();
    if (!decision) {
      setFinanceMessage("Tuliskan keputusan yang ingin diuji.");
      return null;
    }

    const requiredByType = {
      pricing: ["currentPrice", "plannedPrice", "volumeChange"],
      sales: ["volumeChange"],
      cost: ["hppChange", "expenseChange"],
      investment: ["investmentAmount", "expectedRevenue", "incrementalHppRate", "incrementalExpense"],
      custom: ["revenueChange", "hppChange", "expenseChange"]
    };

    const missing = (requiredByType[type] || requiredByType.custom).filter((key) => num(key) === null);
    if (missing.length) {
      const labels = {
        currentPrice: "harga saat ini",
        plannedPrice: "harga rencana",
        volumeChange: "perubahan volume penjualan",
        hppChange: "perubahan HPP",
        expenseChange: "perubahan beban",
        investmentAmount: "nilai investasi/pengeluaran",
        expectedRevenue: "tambahan pendapatan yang diharapkan",
        incrementalHppRate: "HPP atas tambahan penjualan",
        incrementalExpense: "beban tambahan"
      };
      setFinanceMessage(`Lengkapi asumsi: ${missing.map((key) => labels[key] || key).join(", ")}.`);
      return null;
    }

    const assumptions = {
      currentPrice: num("currentPrice"),
      plannedPrice: num("plannedPrice"),
      volumeChange: num("volumeChange"),
      hppChange: num("hppChange"),
      expenseChange: num("expenseChange"),
      investmentAmount: num("investmentAmount"),
      expectedRevenue: num("expectedRevenue"),
      incrementalHppRate: num("incrementalHppRate"),
      incrementalExpense: num("incrementalExpense"),
      revenueChange: num("revenueChange"),
      cashImpact: num("cashImpact") || 0
    };

    if (assumptions.volumeChange <= -100 || assumptions.revenueChange <= -100) {
      setFinanceMessage("Perubahan volume atau pendapatan tidak boleh mencapai -100% atau lebih rendah.");
      return null;
    }
    if (type === "pricing" && assumptions.currentPrice <= 0) {
      setFinanceMessage("Harga saat ini harus lebih besar dari nol.");
      return null;
    }
    if (type === "pricing" && assumptions.plannedPrice <= 0) {
      setFinanceMessage("Harga rencana harus lebih besar dari nol.");
      return null;
    }
    if (type === "investment" && assumptions.investmentAmount < 0) {
      setFinanceMessage("Nilai investasi/pengeluaran tidak boleh negatif.");
      return null;
    }

    setFinanceMessage("");
    setDecisionRunning(true);

    try {
      let simulatedIncome = income;
      let simulatedHpp = hpp;
      let simulatedExpense = expense;
      let directCashAdjustment = assumptions.cashImpact;
      let modelExplanation = "";
      let keyVariable = "";
      let keyVariableValue = null;

      if (type === "pricing") {
        const priceFactor = assumptions.plannedPrice / assumptions.currentPrice;
        const volumeFactor = 1 + assumptions.volumeChange / 100;
        simulatedIncome = income * priceFactor * volumeFactor;
        simulatedHpp = hpp * volumeFactor * (1 + assumptions.hppChange / 100);
        simulatedExpense = expense * (1 + assumptions.expenseChange / 100);
        modelExplanation = `Pendapatan diproyeksikan dari perubahan harga ${((priceFactor - 1) * 100).toFixed(1)}% dan perubahan volume ${assumptions.volumeChange.toFixed(1)}%. HPP mengikuti perubahan volume dan asumsi perubahan HPP.`;
        keyVariable = "volumeChange";
        keyVariableValue = assumptions.volumeChange;
      } else if (type === "sales") {
        const volumeFactor = 1 + assumptions.volumeChange / 100;
        simulatedIncome = income * volumeFactor;
        simulatedHpp = hpp * volumeFactor * (1 + assumptions.hppChange / 100);
        simulatedExpense = expense * (1 + assumptions.expenseChange / 100);
        modelExplanation = `Pendapatan mengikuti perubahan volume ${assumptions.volumeChange.toFixed(1)}%. HPP mengikuti volume dan perubahan HPP ${assumptions.hppChange.toFixed(1)}%, sedangkan beban mengikuti perubahan ${assumptions.expenseChange.toFixed(1)}%.`;
        keyVariable = "volumeChange";
        keyVariableValue = assumptions.volumeChange;
      } else if (type === "cost") {
        simulatedIncome = income * (1 + assumptions.revenueChange / 100);
        simulatedHpp = hpp * (1 + assumptions.hppChange / 100);
        simulatedExpense = expense * (1 + assumptions.expenseChange / 100);
        modelExplanation = `Simulasi biaya mempertahankan pendapatan pada perubahan ${assumptions.revenueChange.toFixed(1)}%, lalu mengubah HPP ${assumptions.hppChange.toFixed(1)}% dan beban ${assumptions.expenseChange.toFixed(1)}%.`;
        keyVariable = "hppChange";
        keyVariableValue = assumptions.hppChange;
      } else if (type === "investment") {
        simulatedIncome = income + assumptions.expectedRevenue;
        simulatedHpp = hpp + (assumptions.expectedRevenue * assumptions.incrementalHppRate / 100);
        simulatedExpense = expense + assumptions.incrementalExpense;
        directCashAdjustment -= assumptions.investmentAmount;
        modelExplanation = `Investasi/pengeluaran sebesar ${formatRupiah(assumptions.investmentAmount)} dibandingkan dengan tambahan pendapatan ${formatRupiah(assumptions.expectedRevenue)}, HPP tambahan ${assumptions.incrementalHppRate.toFixed(1)}% atas pendapatan tambahan, dan beban tambahan ${formatRupiah(assumptions.incrementalExpense)}.`;
        keyVariable = "expectedRevenue";
        keyVariableValue = assumptions.expectedRevenue;
      } else {
        simulatedIncome = income * (1 + assumptions.revenueChange / 100);
        simulatedHpp = hpp * (1 + assumptions.hppChange / 100);
        simulatedExpense = expense * (1 + assumptions.expenseChange / 100);
        modelExplanation = `Skenario khusus mengubah pendapatan ${assumptions.revenueChange.toFixed(1)}%, HPP ${assumptions.hppChange.toFixed(1)}%, dan beban ${assumptions.expenseChange.toFixed(1)}%.`;
        keyVariable = "revenueChange";
        keyVariableValue = assumptions.revenueChange;
      }

      const simulatedGrossProfit = simulatedIncome - simulatedHpp;
      const simulatedProfit = simulatedGrossProfit - simulatedExpense;
      const simulatedMargin = simulatedIncome > 0 ? (simulatedProfit / simulatedIncome) * 100 : 0;
      const profitDelta = simulatedProfit - profit;
      const incomeDelta = simulatedIncome - income;
      const hppDelta = simulatedHpp - hpp;
      const expenseDelta = simulatedExpense - expense;
      const cashDelta = (simulatedIncome - income) - (simulatedHpp - hpp) - (simulatedExpense - expense) + directCashAdjustment;
      const simulatedCash = cash + cashDelta;
      const marginDelta = simulatedMargin - baseMargin;

      let assessment = "Perlu Dipertimbangkan";
      if (simulatedProfit <= 0 || simulatedCash < 0) {
        assessment = "Tidak Menguntungkan";
      } else if (profitDelta > 0 && marginDelta >= 0 && cashDelta >= 0) {
        assessment = "Menguntungkan";
      } else if (profitDelta > 0 || cashDelta > 0) {
        assessment = "Perlu Dipertimbangkan";
      } else {
        assessment = "Tidak Menguntungkan";
      }

      const boundary = {
        label: "",
        value: null,
        unit: "%",
        explanation: ""
      };

      const contributionAfter = simulatedIncome > 0 ? Math.max(0, (simulatedIncome - simulatedHpp) / simulatedIncome) : 0;
      const expenseAfter = simulatedExpense;

      if (type === "pricing") {
        // Batas volume saat laba sama dengan laba dasar, dengan harga/HPP/beban hasil simulasi tetap.
        const unitPriceFactor = assumptions.plannedPrice / assumptions.currentPrice;
        const hppPerIncomeBase = hpp / Math.max(income, 1);
        const simulatedHppRate = hppPerIncomeBase * (1 + assumptions.hppChange / 100) / Math.max(unitPriceFactor, 0.000001);
        const contribution = 1 - simulatedHppRate;
        if (contribution > 0 && income > 0) {
          const requiredRevenue = (expenseAfter + profit) / contribution;
          const requiredVolumeFactor = requiredRevenue / (income * unitPriceFactor);
          const maxVolumeDecline = Math.max(0, (1 - requiredVolumeFactor) * 100);
          boundary.label = "Batas penurunan volume";
          boundary.value = maxVolumeDecline;
          boundary.explanation = `Dengan harga rencana dan struktur biaya simulasi, volume penjualan masih dapat turun sekitar ${maxVolumeDecline.toFixed(1)}% sebelum laba turun ke tingkat laba periode dasar.`;
        }
      } else if (type === "investment") {
        const incrementalContribution = 1 - assumptions.incrementalHppRate / 100;
        if (incrementalContribution > 0) {
          const minimumRevenue = (assumptions.investmentAmount + assumptions.incrementalExpense) / incrementalContribution;
          boundary.label = "Tambahan pendapatan minimum";
          boundary.unit = "Rp";
          boundary.value = minimumRevenue;
          boundary.explanation = `Investasi membutuhkan tambahan pendapatan minimal sekitar ${formatRupiah(minimumRevenue)} agar biaya investasi dan beban tambahannya tertutup oleh margin kontribusi.`;
        }
      } else if (type === "sales") {
        if (contributionAfter > 0) {
          const breakEvenRevenue = expenseAfter / contributionAfter;
          const maxRevenueDecline = income > 0 ? Math.max(0, (1 - breakEvenRevenue / Math.max(simulatedIncome, 1)) * 100) : null;
          if (maxRevenueDecline !== null) {
            boundary.label = "Batas penurunan pendapatan";
            boundary.value = maxRevenueDecline;
            boundary.explanation = `Pada struktur HPP dan beban hasil simulasi, pendapatan masih memiliki ruang turun sekitar ${maxRevenueDecline.toFixed(1)}% dari hasil simulasi sebelum laba berpotensi menjadi nol.`;
          }
        }
      } else if (type === "cost") {
        const availableForCost = income - hpp - expense;
        const hppBase = Math.max(hpp, 1);
        const maxHppIncrease = availableForCost > 0 ? Math.max(0, (availableForCost / hppBase) * 100) : 0;
        boundary.label = "Batas kenaikan HPP";
        boundary.value = maxHppIncrease;
        boundary.explanation = `Jika pendapatan dan beban lain tetap, kenaikan HPP sekitar ${maxHppIncrease.toFixed(1)}% dari HPP periode dasar akan membawa laba mendekati nol.`;
      } else {
        if (contributionAfter > 0 && simulatedIncome > 0) {
          const breakEvenRevenue = expenseAfter / contributionAfter;
          boundary.label = "Batas penurunan pendapatan";
          boundary.value = Math.max(0, (1 - breakEvenRevenue / simulatedIncome) * 100);
          boundary.explanation = `Dengan struktur biaya hasil simulasi, pendapatan masih memiliki ruang turun sekitar ${boundary.value.toFixed(1)}% sebelum laba berpotensi menjadi nol.`;
        }
      }

      const comparisonIncome = Number(comparison.income) || 0;
      const comparisonProfit = Number(comparison.netProfit) || 0;
      const comparisonMargin = comparisonIncome > 0 ? (comparisonProfit / comparisonIncome) * 100 : 0;
      const comparisonText = comparisonIncome > 0
        ? `Periode dasar memiliki pendapatan ${formatRupiah(income)} dan laba ${formatRupiah(profit)}, sedangkan periode pembanding memiliki pendapatan ${formatRupiah(comparisonIncome)} dan laba ${formatRupiah(comparisonProfit)}. Margin laba bersih berubah dari ${comparisonMargin.toFixed(1)}% pada pembanding menjadi ${baseMargin.toFixed(1)}% pada dasar.`
        : `Periode pembanding ${financePeriodLabel(financeComparisonPeriod)} belum memiliki pendapatan yang dapat dijadikan basis perbandingan.`;

      const result = {
        decision,
        decisionType: type,
        basePeriod: financePeriodLabel(financePeriod),
        comparisonPeriod: financePeriodLabel(financeComparisonPeriod),
        assumptions,
        baseline: { income, hpp, expense, profit, cash, margin: baseMargin },
        simulated: { income: simulatedIncome, hpp: simulatedHpp, expense: simulatedExpense, profit: simulatedProfit, cash: simulatedCash, margin: simulatedMargin },
        deltas: { income: incomeDelta, hpp: hppDelta, expense: expenseDelta, profit: profitDelta, cash: cashDelta, margin: marginDelta },
        assessment,
        boundary,
        keyVariable,
        keyVariableValue,
        modelExplanation,
        comparisonText,
        baselineRates: { hppRate, expenseRate },
        linked: [
          pulseData?.summary ? `Kondisi usaha: ${pulseData.summary}` : null,
          diagnosis?.mainProblem ? `Temuan diagnosis: ${diagnosis.mainProblem}` : null,
          autopilotData?.priority ? `Prioritas tindakan: ${autopilotData.priority}` : null
        ].filter(Boolean),
        interpretation: ""
      };

      try {
        const aiRaw = await askAI({
          prompt: `Anda sedang menjelaskan hasil SIMULASI KEPUTUSAN BISNIS. Jangan membuat angka baru dan jangan mengulang nasihat bisnis generik. Gunakan HANYA data berikut.

${JSON.stringify(result, null, 2)}

Jelaskan secara spesifik:
1. apa keputusan yang diuji dan mekanisme dampaknya;
2. perubahan laba, kas, pendapatan, atau margin yang paling penting;
3. trade-off yang muncul;
4. batas keputusan jika tersedia;
5. kondisi yang harus dipenuhi agar keputusan tetap layak.
Sebut minimal dua angka dari data. Jika data tidak cukup untuk suatu kesimpulan, katakan tidak cukup.`,
          system: "Anda adalah Financial Decision Intelligence AI ZENAI. Berikan 4-6 kalimat Bahasa Indonesia formal dan konkret. Jangan memberi nasihat umum seperti 'tingkatkan pemasaran', 'efisiensi biaya', atau 'pantau secara berkala' kecuali langsung terkait dengan angka simulasi. Jangan mengubah angka. Jangan membuat data. Jangan markdown atau emoji."
        });
        result.interpretation = String(aiRaw || "").trim();
      } catch (aiError) {
        console.warn("Interpretasi AI tidak tersedia:", aiError);
        result.interpretation = `${modelExplanation} Dampak terhadap laba adalah ${formatRupiah(profitDelta)} dan dampak terhadap kas adalah ${formatRupiah(cashDelta)}. ${boundary.explanation || "Batas keputusan belum dapat dihitung dari data yang tersedia."}`;
      }

      setDecisionResult(result);
      return result;
    } catch (error) {
      console.error("ANALISIS LANJUTAN ERROR:", error);
      alert(formatError(error));
      return null;
    } finally {
      setDecisionRunning(false);
    }
  };

  const formatError = (error) => {
    if (!error) {
      return "Terjadi kesalahan.";
    }

    if (typeof error === "string") {
      return error;
    }

    if (error.message) {
      return error.message;
    }

    return "Terjadi kesalahan. Silakan coba lagi.";
  };

  const getBusinessContext = () => {
    if (!business) {
      return null;
    }

    return {
      ...business,

      updates: businessUpdates.map((item) => ({
        id: item.id,
        text: item.text,
        date: item.date || null,
        createdAt:
          item.createdAt ||
          item.date ||
          null,

        pulse: item.pulse || null
      }))
    };
  };

  const renderStatus = (status) => {
    const normalized = String(status || "")
      .toLowerCase()
      .trim();

    const statusMap = {
      critical: " Kritis",
      high: " Tinggi",
      medium: " Sedang",
      low: " Rendah",

      urgent: " Mendesak",

      warning: " Perlu Perhatian",

      attention: " Perlu Perhatian",

      good: " Baik",
      healthy: " Sehat",
      positive: " Positif",

      stable: " Stabil",
      normal: " Normal",

      success: " Berhasil",
      completed: " Selesai",

      pending: " Menunggu",

      unknown: " Tidak diketahui"
    };

    return (
      statusMap[normalized] ||
      (status
        ? String(status)
        : " Belum diketahui")
    );
  };
    const startRecording = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });

      mediaStreamRef.current = stream;

      const mediaRecorder =
        new MediaRecorder(stream);

      mediaRecorderRef.current =
        mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          audioChunksRef.current.push(
            event.data
          );
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType =
          mediaRecorder.mimeType ||
          "audio/webm";

        const audioBlob = new Blob(
          audioChunksRef.current,
          {
            type: mimeType
          }
        );

        const reader = new FileReader();

        reader.onloadend = () => {
          setAudio(reader.result);
          setAudioMimeType(mimeType);

          const extension =
            mimeType.includes("ogg")
              ? "ogg"
              : mimeType.includes("mp4")
                ? "m4a"
                : "webm";

          setAudioName(
            `rekaman.${extension}`
          );
        };

        reader.readAsDataURL(audioBlob);

        if (mediaStreamRef.current) {
          mediaStreamRef.current
            .getTracks()
            .forEach((track) =>
              track.stop()
            );
        }

        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
      };

      mediaRecorder.start();

      setRecordingTime(0);
      setIsRecording(true);

      recordingTimerRef.current =
        setInterval(() => {
          setRecordingTime((previous) =>
            previous + 1
          );
        }, 1000);

    } catch (error) {
      console.error(
        "Gagal mengakses mikrofon:",
        error
      );

      alert(
        "Mikrofon tidak dapat diakses. Pastikan izin mikrofon sudah diberikan."
      );
    }
  };


  const stopRecording = () => {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      if (recordingTimerRef.current) {
        clearInterval(
          recordingTimerRef.current
        );

        recordingTimerRef.current = null;
      }

      setIsRecording(false);

    } catch (error) {
      console.error(
        "Gagal menghentikan rekaman:",
        error
      );

      setIsRecording(false);
    }
  };


  const clearAudio = () => {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      }

      if (recordingTimerRef.current) {
        clearInterval(
          recordingTimerRef.current
        );

        recordingTimerRef.current = null;
      }

      mediaRecorderRef.current = null;
      mediaStreamRef.current = null;
      audioChunksRef.current = [];

      setAudio("");
      setAudioName("");
      setAudioMimeType("");

      setRecordingTime(0);
      setIsRecording(false);

    } catch (error) {
      console.error(
        "Gagal menghapus audio:",
        error
      );
    }
  };


  const handleAudioUpload = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("audio/")
    ) {
      alert(
        "File yang dipilih harus berupa audio."
      );

      event.target.value = "";

      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setAudio(reader.result);
      setAudioName(file.name);
      setAudioMimeType(file.type);

      setRecordingTime(0);
    };

    reader.readAsDataURL(file);
  };


  const handleImageUpload = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      alert(
        "File yang dipilih harus berupa gambar."
      );

      event.target.value = "";

      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };


  const getApiAuthHeaders = async () => {
    if (!supabase) return {};
    const { data } = await supabase.auth.getSession();
    const accessToken = data?.session?.access_token;
    return accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};
  };

  const askAI = async ({
    prompt,
    system = ""
  }) => {
    const response = await fetch(
      "/api/ai",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          ...(await getApiAuthHeaders())
        },

        body: JSON.stringify({
          prompt,
          system,
          text,
          image,
          audio,
          audioName,
          audioMimeType
        })
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
        data?.message ||
        "Gagal menghubungi AI."
      );
    }

    if (data?.provider) {
      setProvider(data.provider);
    }

    return (
      data?.result ||
      data?.text ||
      data?.message ||
      ""
    );
  };


  const extractJson = (value) => {
    if (!value) {
      throw new Error(
        "AI tidak mengembalikan data."
      );
    }

    if (
      typeof value === "object"
    ) {
      return value;
    }

    let cleaned =
      String(value).trim();

    cleaned = cleaned
      .replace(
        /^```json\s*/i,
        ""
      )
      .replace(
        /^```\s*/i,
        ""
      )
      .replace(
        /\s*```$/i,
        ""
      )
      .trim();

    try {
      return JSON.parse(cleaned);

    } catch {
      const firstBrace =
        cleaned.indexOf("{");

      const lastBrace =
        cleaned.lastIndexOf("}");

      if (
        firstBrace !== -1 &&
        lastBrace !== -1 &&
        lastBrace > firstBrace
      ) {
        const jsonString =
          cleaned.slice(
            firstBrace,
            lastBrace + 1
          );

        try {
          return JSON.parse(
            jsonString
          );

        } catch {
          // lanjut ke error di bawah
        }
      }

      throw new Error(
        "Respons AI tidak dalam format JSON yang valid."
      );
    }
  };
    const analyzeBusiness = async () => {
    if (
      !text.trim() &&
      !image &&
      !audio
    ) {
      alert(
        "Ceritakan usaha Anda, unggah gambar, atau kirim rekaman suara terlebih dahulu."
      );

      return;
    }

    setBusy(true);

    try {
      const prompt = `
Analisis informasi usaha berikut.

DESKRIPSI USAHA:
${text || "-"}

Buat profil usaha dalam format JSON valid.

Gunakan struktur berikut:

{
  "name": "",
  "product": "",
  "description": "",
  "targetMarket": "",
  "location": "",
  "businessStage": "",
  "strengths": [],
  "weaknesses": [],
  "opportunities": [],
  "risks": [],
  "summary": ""
}

Jangan gunakan markdown.
Jangan menambahkan teks selain JSON.
Jika informasi tidak tersedia, gunakan string kosong atau array kosong.
`;

      const raw = await askAI({
        prompt,

        system: `
Anda adalah Business Intelligence AI untuk ZENAI.

Tugas Anda adalah memahami informasi usaha pengguna
dan mengubahnya menjadi profil usaha yang jelas.

Gunakan bahasa Indonesia yang sederhana.

Jangan mengarang informasi yang tidak tersedia.
Balas hanya dengan JSON valid.
`
      });

      const result =
        extractJson(raw);

      setBusiness(result);

      // Gambar/audio adalah input satu kali. Hapus setelah berhasil agar
      // tidak ikut terkirim pada Business Pulse, Diagnosis, Autopilot, dll.
      setImage("");
      setAudio("");
      setAudioName("");
      setAudioMimeType("");

      setPulseData(null);
      setDiagnosis(null);
      setAutopilotData(null);

      setBusinessUpdates([]);

      setTab("home");

      return result;

    } catch (error) {
      console.error(
        "Gagal menganalisis usaha:",
        error
      );

      alert(
        formatError(error)
      );

    } finally {
      setBusy(false);
    }
  };

  const runPulse = async (
    contextOverride = null,
    options = {}
  ) => {
    /*
      Proteksi jika function tidak sengaja
      menerima React Event dari onClick.
    */
    if (
      contextOverride &&
      typeof contextOverride ===
        "object" &&
      (
        contextOverride.nativeEvent ||
        contextOverride.currentTarget ||
        contextOverride.target
      )
    ) {
      contextOverride = null;
    }

    if (!business) {
      alert(
        "Analisis usaha terlebih dahulu."
      );

      setTab("capture");

      return;
    }

    const context =
      contextOverride ||
      getBusinessContext();

    const {
      silent = false,
      goToTab = true
    } = options;

    if (!silent) {
      setBusy(true);
    }

    try {
      const prompt = `
Berikut adalah kondisi usaha:

${JSON.stringify(
  context,
  null,
  2
)}

Analisis kondisi usaha saat ini.

Balas dengan JSON valid menggunakan struktur:

{
  "status": "",
  "summary": "",

  "positive": [
    {
      "title": "",
      "description": ""
    }
  ],

  "attention": [
    {
      "title": "",
      "description": "",
      "status": ""
    }
  ],

  "priority": [
    {
      "title": "",
      "action": "",
      "impact": ""
    }
  ],

  "nextStep": ""
}

Aturan:

- Jangan membuat angka atau omzet jika tidak ada data.
- Fokus pada kondisi usaha yang benar-benar tersedia.
- Gunakan bahasa Indonesia sederhana.
- Jangan gunakan markdown.
- Balas hanya JSON valid.
`;

      const raw =
        await askAI({
          prompt,

          system: `
Anda adalah Business Pulse AI ZENAI.

Tugas Anda adalah membaca kondisi usaha
dan memberikan gambaran singkat mengenai
apa yang berjalan baik, apa yang perlu
diperhatikan, dan tindakan prioritas.

Jangan mengarang data.
Gunakan informasi yang tersedia.
Balas JSON valid.
`
        });

      const result =
        extractJson(raw);

      setPulseData(result);

      if (goToTab) {
        setTab("pulse");
      }

      return result;

    } catch (error) {
      console.error(
        "Gagal membuat Business Pulse:",
        error
      );

      if (!silent) {
        alert(
          formatError(error)
        );
      }

      throw error;

    } finally {
      if (!silent) {
        setBusy(false);
      }
    }
  };

  const runDiagnosis = async (
    contextOverride = null,
    options = {}
  ) => {
    /*
      Proteksi jika React Event
      masuk sebagai parameter pertama.
    */
    if (
      contextOverride &&
      typeof contextOverride ===
        "object" &&
      (
        contextOverride.nativeEvent ||
        contextOverride.currentTarget ||
        contextOverride.target
      )
    ) {
      contextOverride = null;
    }

    if (!business) {
      alert(
        "Analisis usaha terlebih dahulu."
      );

      setTab("capture");

      return;
    }

    const context =
      contextOverride ||
      getBusinessContext();

    const {
      silent = false,
      goToTab = true
    } = options;

    if (!silent) {
      setBusy(true);
    }

    try {
      const prompt = `
Berikut adalah data usaha:

${JSON.stringify(
  context,
  null,
  2
)}

Lakukan diagnosis usaha secara menyeluruh.

Balas dengan JSON valid
menggunakan struktur:

{
  "summary": "",

  "status": "",

  "mainProblem": "",

  "strengths": [
    {
      "title": "",
      "description": ""
    }
  ],

  "problems": [
    {
      "title": "",
      "description": "",
      "impact": "",
      "priority": ""
    }
  ],

  "opportunities": [
    {
      "title": "",
      "description": "",
      "potential": ""
    }
  ],

  "recommendations": [
    {
      "priority": "",
      "action": "",
      "reason": ""
    }
  ],

  "nextStep": ""
}

Aturan:

- Jangan membuat data keuangan.
- Jangan membuat angka tanpa data pendukung.
- Fokus pada masalah yang benar-benar mungkin
  berdasarkan informasi usaha.
- Gunakan bahasa Indonesia sederhana.
- Jangan gunakan markdown.
- Balas hanya JSON valid.
`;

      const raw =
        await askAI({
          prompt,

          system: `
Anda adalah Business Diagnosis AI ZENAI.

Tugas Anda adalah membantu pemilik usaha
memahami masalah, kekuatan, peluang,
risiko, dan prioritas perbaikan.

Berikan diagnosis yang praktis
dan mudah dipahami.

Jangan mengarang data.
Balas hanya JSON valid.
`
        });

      const result =
        extractJson(raw);

      setDiagnosis(result);

      if (goToTab) {
        setTab("diagnosis");
      }

      return result;

    } catch (error) {
      console.error(
        "Gagal melakukan diagnosis:",
        error
      );

      if (!silent) {
        alert(
          formatError(error)
        );
      }

      throw error;

    } finally {
      if (!silent) {
        setBusy(false);
      }
    }
  };
  const runMarketInsight = async () => {
  if (!business) {
    alert(
      "Ceritakan usaha terlebih dahulu."
    );

    setTab("capture");
    return;
  }

  setMarketLoading(true);
  setMarketError("");

  try {
    const response = await fetch(
      "/api/marketplace",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          ...(await getApiAuthHeaders())
        },

        body: JSON.stringify({
          action: "market-insight",

          businessProfile: {
            business:
              business.description ||
              business.product ||
              "",

            industry:
              business.product ||
              "",

            location:
              business.location ||
              business.lokasi ||
              "",
          },
        }),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ||
        "Gagal memperbarui Wawasan Pasar."
      );
    }

    if (!result.success) {
      throw new Error(
        result.error ||
        "Wawasan Pasar tidak dapat dibuat."
      );
    }

    setMarketData(result);

    setTab("market");

  } catch (error) {

    console.error(
      "MARKET INSIGHT ERROR:",
      error
    );

    const message =
      formatError(error) ||
      "Terjadi kesalahan saat mengambil informasi pasar.";

    setMarketError(message);

  } finally {

    setMarketLoading(false);

  }
};
    const runAutopilot = async (
    contextOverride = null,
    options = {}
  ) => {
    /*
      Proteksi jika React Event masuk
      sebagai parameter pertama.
    */
    if (
      contextOverride &&
      typeof contextOverride === "object" &&
      (
        contextOverride.nativeEvent ||
        contextOverride.currentTarget ||
        contextOverride.target
      )
    ) {
      contextOverride = null;
    }

    if (!business) {
      alert(
        "Analisis usaha terlebih dahulu."
      );

      setTab("capture");

      return;
    }

    const context =
      contextOverride ||
      getBusinessContext();

    const {
      diagnosisOverride = null,
      pulseOverride = null,
      silent = false,
      goToTab = true
    } = options;

    const latestDiagnosis =
      diagnosisOverride || diagnosis;

    const latestPulse =
      pulseOverride || pulseData;

    if (!silent) {
      setBusy(true);
    }

    try {
      const prompt = `
Berikut adalah kondisi usaha:

KONTEKS USAHA:
${JSON.stringify(context, null, 2)}

BUSINESS PULSE:
${JSON.stringify(
  latestPulse || {},
  null,
  2
)}

DIAGNOSIS:
${JSON.stringify(
  latestDiagnosis || {},
  null,
  2
)}

Buat strategi dan tindakan yang praktis.

Balas dengan JSON valid menggunakan struktur:

{
  "summary": "",

  "priority": "",

  "plan7": [
    {
      "day": "",
      "title": "",
      "action": "",
      "purpose": ""
    }
  ],

  "plan14": [
    {
      "phase": "",
      "title": "",
      "action": ""
    }
  ],

  "plan30": [
    {
      "phase": "",
      "title": "",
      "action": ""
    }
  ],

  "plan": [
    {
      "step": "",
      "action": "",
      "purpose": ""
    }
  ],

  "warning": "",

  "nextStep": ""
}

Aturan:

- Prioritaskan tindakan dengan dampak terbesar.
- Buat langkah sederhana dan realistis.
- Jangan membuat angka target, omzet,
  persentase, atau estimasi keuntungan
  tanpa data pendukung.
- Gunakan bahasa Indonesia sederhana.
- Jangan gunakan markdown.
- Balas hanya JSON valid.
`;

      const response = await fetch("/api/autopilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(await getApiAuthHeaders())
        },
        body: JSON.stringify({
          business: {
            ...context,
            pulse: latestPulse || {},
            diagnosis: latestDiagnosis || {}
          },
          duration: 30
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Gagal membuat strategi Autopilot.");
      }

      const apiResult = data?.result;
      if (!apiResult?.mission || !Array.isArray(apiResult.actions)) {
        throw new Error("Respons Autopilot tidak sesuai format.");
      }

      const result = {
        summary: apiResult.mission.target,
        priority: apiResult.mission.priority,
        plan30: apiResult.actions.map((item) => ({
          phase: `Hari ${item.id}`,
          title: item.title,
          action: item.description
        })),
        plan7: apiResult.actions.slice(0, 7).map((item) => ({
          day: item.id,
          title: item.title,
          action: item.description,
          purpose: item.output
        })),
        plan14: apiResult.actions.slice(0, 14).map((item) => ({
          phase: `Hari ${item.id}`,
          title: item.title,
          action: item.description
        })),
        plan: apiResult.actions.map((item) => ({
          step: item.id,
          action: item.description,
          purpose: item.output
        })),
        warning: "",
        nextStep: apiResult.actions[0]?.title || "Mulai dari tindakan prioritas pertama."
      };

      setAutopilotData(result);

      if (goToTab) {
        setTab("autopilot");
      }

      return result;

    } catch (error) {
      console.error(
        "Gagal menjalankan Autopilot:",
        error
      );

      if (!silent) {
        alert(
          formatError(error)
        );
      }

      throw error;

    } finally {
      if (!silent) {
        setBusy(false);
      }
    }
  };


  const resetAnalysis = () => {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      }

      if (recordingTimerRef.current) {
        clearInterval(
          recordingTimerRef.current
        );

        recordingTimerRef.current = null;
      }

      mediaRecorderRef.current = null;
      mediaStreamRef.current = null;
      audioChunksRef.current = [];

      setIsRecording(false);
      setRecordingTime(0);

      setText("");
      setImage("");

      setAudio("");
      setAudioName("");
      setAudioMimeType("");

      // Pertahankan profil perusahaan, riwayat pembaruan, dan laporan keuangan.
      setDiagnosis(null);
      setPulseData(null);
      setUpdateText("");

      setAutopilotData(null);
      setMarketData(null);
      setMarketError("");
      setDecisionText("");
      setDecisionResult(null);
      setDecisionRunning(false);

      setProvider("");
      setBusy(false);

      setDays(7);

      setTab("capture");

    } catch (error) {
      console.error(
        "Gagal mereset analisis:",
        error
      );

      setBusy(false);
      setTab("capture");
    }
  };


  const resetCompanyTotal = async () => {
    const firstConfirm = window.confirm(
      "Reset Perusahaan Total? Semua profil, analisis, pembaruan usaha, periode, dan laporan keuangan akan dihapus."
    );

    if (!firstConfirm) return;

    const confirmation = window.prompt(
      'Ketik RESET untuk menghapus seluruh data perusahaan.'
    );

    if (confirmation !== "RESET") {
      alert("Reset dibatalkan. Ketik RESET persis untuk melanjutkan.");
      return;
    }

    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      cloudHydratedRef.current = false;
      if (cloudSaveTimerRef.current) {
        clearTimeout(cloudSaveTimerRef.current);
        cloudSaveTimerRef.current = null;
      }

      if (supabase && session?.user?.id) {
        // Jangan menghapus row state. Tulis state kosong secara atomik
        // agar tidak ada data lama yang dapat muncul kembali akibat
        // race antara cloud save dan reset.
        const emptyState = {
          business: null,
          pulseData: null,
          diagnosis: null,
          autopilotData: null,
          marketData: null,
          businessUpdates: [],
          growthActions: [],
          financeTransactions: [],
          financePeriod: new Date().toISOString().slice(0, 7),
          financeComparisonPeriod: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().slice(0, 7),
          decisionScenario: { currentPrice: "", plannedPrice: "", volumeChange: "", hppChange: "", expenseChange: "", investmentAmount: "", expectedRevenue: "", incrementalHppRate: "", incrementalExpense: "", revenueChange: "", cashImpact: "" },
          decisionType: "pricing",
          decisionText: "",
          decisionResult: null,
          tab: "capture"
        };

        const { error } = await supabase
          .from("zenai_user_state")
          .upsert(
            {
              user_id: session.user.id,
              state: emptyState,
              updated_at: new Date().toISOString()
            },
            { onConflict: "user_id" }
          );

        if (error) throw error;
      }

      setText("");
      setImage("");
      setAudio("");
      setAudioName("");
      setAudioMimeType("");
      setIsRecording(false);
      setRecordingTime(0);
      setBusy(false);
      setProvider("");
      setBusiness(null);
      setPulseData(null);
      setDiagnosis(null);
      setAutopilotData(null);
      setMarketData(null);
      setMarketError("");
      setBusinessUpdates([]);
      setUpdateText("");
      setFinanceTransactions([]);
      setFinancePeriod(new Date().toISOString().slice(0, 7));
      setFinanceForm({
        date: new Date().toISOString().slice(0, 10),
        description: "",
        amount: "",
        type: "income",
        account: "bank"
      });
      setEditingFinanceId(null);
      setFinanceView("summary");
      setFinanceMessage("");
      setTab("capture");

      // Reset selesai dan state cloud sudah diset ke keadaan kosong.
      // Aktifkan kembali persistence agar perusahaan baru dapat tersimpan.
      cloudHydratedRef.current = true;
      setCloudLoaded(true);

      setAuthMessage("Data perusahaan berhasil dihapus. Anda dapat memulai perusahaan baru.");
    } catch (error) {
      console.error("Gagal mereset perusahaan total:", error);
      alert(formatError(error));
      cloudHydratedRef.current = true;
    }
  };


  const addBusinessUpdate =
    async () => {
      if (!updateText.trim()) {
        alert(
          "Masukkan pembaruan usaha terlebih dahulu."
        );

        return;
      }

      const newUpdate = {
        id: Date.now(),

        text: updateText.trim(),

        date:
          new Date().toLocaleString(
            "id-ID"
          ),

        createdAt:
          new Date().toISOString()
      };


      const latestUpdates = [
        newUpdate,
        ...businessUpdates
      ];


      const latestContext = {
        ...business,

        updates: latestUpdates.map(
          (item) => ({
            id: item.id,

            text: item.text,

            createdAt:
              item.createdAt ||
              item.date ||
              null,

            pulse:
              item.pulse || null
          })
        ),

        latestUpdate: {
          id: newUpdate.id,

          text: newUpdate.text,

          createdAt:
            newUpdate.createdAt,

          pulse: null
        }
      };


      setBusinessUpdates(
        latestUpdates
      );

      setUpdateText("");
      setBusy(true);

      try {
        /*
          LANGKAH 1
          Memperbarui kondisi usaha
        */

        const latestPulse =
          await runPulse(
            latestContext,
            {
              silent: true,
              goToTab: false
            }
          );


        /*
          LANGKAH 2
          Memperbarui diagnosis
        */

        const latestDiagnosis =
          await runDiagnosis(
            latestContext,
            {
              silent: true,
              goToTab: false
            }
          );


        /*
          LANGKAH 3
          Memperbarui strategi
        */

        await runAutopilot(
          latestContext,
          {
            diagnosisOverride:
              latestDiagnosis,

            pulseOverride:
              latestPulse,

            silent: true,

            goToTab: false
          }
        );


        setTab("pulse");

      } catch (error) {
        console.error(
          "Gagal memperbarui analisis:",
          error
        );

        alert(
          formatError(error) ||
          "Pembaruan berhasil disimpan, tetapi analisis terbaru gagal dibuat."
        );

      } finally {
        setBusy(false);
      }
    };


  const getAnalysisHistory =
    () => {
      const history = [];

      if (business) {
        history.push({
          type: "Profil Usaha",

          description:
            business.product ||
            business.description ||
            "Informasi usaha telah dianalisis.",

          date:
            "Tersedia"
        });
      }

      if (pulseData) {
        history.push({
          type:
            "Lihat Kondisi Usaha",

          description:
            pulseData.summary ||
            "Analisis kondisi usaha telah dibuat.",

          date:
            "Selesai"
        });
      }

      if (diagnosis) {
        history.push({
          type:
            "Diagnosis Usaha",

          description:
            diagnosis.summary ||
            "Diagnosis usaha telah dibuat.",

          date:
            "Selesai"
        });
      }

      if (autopilotData) {
        history.push({
          type:
            "Strategi & Tindakan",

          description:
            autopilotData.summary ||
            "Rencana tindakan telah dibuat.",

          date:
            "Selesai"
        });
      }

      return history;
    };


  const analysisHistory =
    getAnalysisHistory();

  // =========================
  // EXPORT REPORTS TO PDF
  // Browser print engine: no additional dependency required.
  // =========================
  const escapePdfHtml = (value) => {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const pdfLabel = (label) => {
    const labels = {
      // Judul/fitur
      "Business Pulse": "Kondisi Usaha",
      "Business Diagnosis": "Diagnosis Usaha",
      "Diagnosis": "Diagnosis Usaha",
      "Market Insight": "Wawasan Pasar",
      "Business Autopilot": "Strategi & Tindakan",
      "Growth Actions": "Tindakan Pertumbuhan",
      "Business Updates": "Pembaruan Usaha",
      "Financial Statements": "Laporan Keuangan",
      "Summary": "Ikhtisar",
      "Status": "Status",
      "Summary": "Ringkasan",
      "Main Problem": "Masalah Utama",
      "Positive": "Hal Positif",
      "Attention": "Perlu Perhatian",
      "Priority": "Prioritas",
      "Next Step": "Langkah Berikutnya",
      "Strengths": "Kekuatan",
      "Problems": "Masalah",
      "Opportunities": "Peluang",
      "Recommendations": "Rekomendasi",
      "Action": "Tindakan",
      "Reason": "Alasan",
      "Impact": "Dampak",
      "Potential": "Potensi",
      "Description": "Deskripsi",
      "Title": "Judul",
      "Date": "Tanggal",
      "Description": "Keterangan",
      "Type": "Jenis",
      "Amount": "Jumlah",
      "Reason": "Alasan",
      "Market Condition": "Kondisi Pasar",
      "Demand Signal": "Sinyal Permintaan",
      "Business Perspective": "Perspektif Bisnis",
      "External Factors": "Faktor Eksternal",
      "Risks": "Risiko",
      "Competition Insight": "Wawasan Persaingan",
      "Scenarios": "Skenario",
      "Optimistic": "Optimistis",
      "Realistic": "Realistis",
      "Risk": "Risiko",
      "Strategic Implication": "Implikasi Strategis",
      "Limitations": "Keterbatasan",
      "DemandSignal": "Sinyal Permintaan",
      "MarketCondition": "Kondisi Pasar",
      "BusinessPerspective": "Perspektif Bisnis",
      "ExternalFactors": "Faktor Eksternal",
      "CompetitionInsight": "Wawasan Persaingan",
      "StrategicImplication": "Implikasi Strategis",
      "MainProblem": "Masalah Utama",
      "NextStep": "Langkah Berikutnya",
      "CumulativeNetProfit": "Laba Bersih Kumulatif",
      "cashIn": "Kas Masuk",
      "cashOut": "Kas Keluar",
      "cashChange": "Perubahan Kas Bersih",
      "cashTotal": "Saldo Kas dan Bank",
      "income": "Pendapatan",
      "hpp": "Harga Pokok Penjualan",
      "grossProfit": "Laba Kotor",
      "expense": "Beban Operasional",
      "netProfit": "Laba Bersih",
      "receivable": "Piutang Usaha",
      "inventory": "Persediaan",
      "totalAssets": "Total Aset",
      "debt": "Liabilitas",
      "capital": "Modal",
      "cumulativeNetProfit": "Laba Ditahan",
      "withdrawal": "Prive",
      "totalEquity": "Total Ekuitas",
      "ASET": "ASET",
      "LIABILITAS DAN EKUITAS": "LIABILITAS DAN EKUITAS",
      "Pendapatan": "Pendapatan",
      "Harga Pokok Penjualan": "Harga Pokok Penjualan",
      "Laba Kotor": "Laba Kotor",
      "Beban Operasional": "Beban Operasional",
      "Laba Bersih": "Laba Bersih",
      "Kas Masuk": "Kas Masuk",
      "Kas Keluar": "Kas Keluar",
      "Perubahan Kas Bersih": "Perubahan Kas Bersih",
      "Saldo Kas dan Bank": "Saldo Kas dan Bank",
      "Kas dan Bank": "Kas dan Bank",
      "Piutang Usaha": "Piutang Usaha",
      "Persediaan": "Persediaan",
      "Total Aset": "Total Aset",
      "Liabilitas": "Liabilitas",
      "Modal": "Modal",
      "Laba Ditahan": "Laba Ditahan",
      "Prive": "Prive",
      "Total Ekuitas": "Total Ekuitas",
      "Total Liabilitas dan Ekuitas": "Total Liabilitas dan Ekuitas",
      "Tidak ada transaksi yang tercatat pada periode ini.": "Tidak ada transaksi yang tercatat pada periode ini.",
      "No transactions recorded for this period.": "Tidak ada transaksi yang tercatat pada periode ini.",
      "connector-ready": "Siap digunakan",
      "operational": "Beroperasi",
      "configured": "Terkonfigurasi",
      "down": "Tidak tersedia",
      "HIGH": "TINGGI",
      "MEDIUM": "SEDANG",
      "LOW": "RENDAH"
    };

    const raw = String(label ?? "");
    if (Object.prototype.hasOwnProperty.call(labels, raw)) return labels[raw];

    // Fallback untuk key camelCase/snake-like yang mungkin muncul dari respons AI.
    const normalized = raw
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .trim();
    if (Object.prototype.hasOwnProperty.call(labels, normalized)) return labels[normalized];

    const lower = normalized.toLowerCase();
    const dynamic = {
      "status": "Status", "summary": "Ringkasan",
      "main problem": "Masalah Utama", "positive": "Hal Positif",
      "attention": "Perlu Perhatian", "priority": "Prioritas",
      "next step": "Langkah Berikutnya", "strengths": "Kekuatan",
      "problems": "Masalah", "opportunities": "Peluang",
      "recommendations": "Rekomendasi", "action": "Tindakan",
      "reason": "Alasan", "impact": "Dampak", "potential": "Potensi",
      "description": "Deskripsi", "title": "Judul", "date": "Tanggal",
      "type": "Jenis", "amount": "Jumlah", "market condition": "Kondisi Pasar",
      "demand signal": "Sinyal Permintaan", "business perspective": "Perspektif Bisnis",
      "external factors": "Faktor Eksternal", "risks": "Risiko",
      "competition insight": "Wawasan Persaingan", "scenarios": "Skenario",
      "optimistic": "Optimistis", "realistic": "Realistis",
      "risk": "Risiko", "strategic implication": "Implikasi Strategis",
      "limitations": "Keterbatasan",
      "market insight": "Wawasan Pasar",
      "market condition": "Kondisi Pasar",
      "demand signal": "Sinyal Permintaan",
      "business perspective": "Perspektif Bisnis",
      "external factors": "Faktor Eksternal",
      "competition insight": "Wawasan Persaingan",
      "strategic implication": "Implikasi Strategis",
      "scenarios": "Skenario",
      "optimistic": "Optimistis",
      "realistic": "Realistis",
      "risk": "Risiko",
      "warning": "peringatan",
      "plan": "Ringkasan Rencana",
      "plan7": "Rencana 7 Hari",
      "plan14": "Rencana 14 Hari",
      "plan30": "Rencana 30 Hari"
    };
    return dynamic[lower] || normalized || raw;
  };

  const translatePdfText = (value) => {
    if (value === null || value === undefined) return value;
    const replacements = [
      [/\bMarket Insight\b/gi, "Wawasan Pasar"],
      [/\bBusiness Perspective\b/gi, "Perspektif Bisnis"],
      [/\bMarket Condition\b/gi, "Kondisi Pasar"],
      [/\bDemand Signal\b/gi, "Sinyal Permintaan"],
      [/\bExternal Factors\b/gi, "Faktor Eksternal"],
      [/\bCompetition Insight\b/gi, "Wawasan Persaingan"],
      [/\bStrategic Implication\b/gi, "Implikasi Strategis"],
      [/\bOptimistic\b/gi, "Optimistis"],
      [/\bRealistic\b/gi, "Realistis"],
      [/\bRisk\b/gi, "Risiko"],
      [/\bRisks\b/gi, "Risiko"],
      [/\bOpportunities\b/gi, "Peluang"],
      [/\bStrengths\b/gi, "Kekuatan"],
      [/\bProblems\b/gi, "Masalah"],
      [/\bRecommendations\b/gi, "Rekomendasi"],
      [/\bSummary\b/gi, "Ringkasan"],
      [/\bStatus\b/gi, "Status"],
      [/\bReason\b/gi, "Alasan"],
      [/\bLimitations\b/gi, "Keterbatasan"],
      [/\bDemandSignal\b/gi, "Sinyal Permintaan"],
      [/\bMarketCondition\b/gi, "Kondisi Pasar"],
      [/\bBusinessPerspective\b/gi, "Perspektif Bisnis"],
      [/\bExternalFactors\b/gi, "Faktor Eksternal"],
      [/\bCompetitionInsight\b/gi, "Wawasan Persaingan"],
      [/\bStrategicImplication\b/gi, "Implikasi Strategis"],
    ];
    return replacements.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), String(value));
  };

  const formatPdfValue = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    if (Array.isArray(value)) {
      if (!value.length) return "—";
      return `<table class="pdf-table"><tbody>${value.map((item) => {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          return `<tr>${Object.values(item).map((cell) => `<td>${formatPdfValue(cell)}</td>`).join("")}</tr>`;
        }
        return `<tr><td>${formatPdfValue(item)}</td></tr>`;
      }).join("")}</tbody></table>`;
    }
    if (typeof value === "object") {
      return `<table class="pdf-table"><tbody>${Object.entries(value)
        .map(([key, item]) => `<tr><th>${escapePdfHtml(pdfLabel(key))}</th><td>${formatPdfValue(item)}</td></tr>`)
        .join("")}</tbody></table>`;
    }
    return escapePdfHtml(translatePdfText(value)).replace(/\n/g, "<br />");
  };

  const exportReportPdf = (title, sections = []) => {
    if (typeof window === "undefined") return;

    const reportWindow = window.open("", "_blank", "width=980,height=900");
    if (!reportWindow) {
      alert("Popup browser diblokir. Izinkan popup untuk ZenAI, lalu coba lagi.");
      return;
    }

    const businessName = business?.name || business?.businessName || "Usaha Anda";
    const generatedAt = new Intl.DateTimeFormat("id-ID", {
      dateStyle: "long",
      timeStyle: "short"
    }).format(new Date());

    const sectionHtml = sections
      .filter((section) => section && section.value !== null && section.value !== undefined)
      .map((section) => `
        <section class="pdf-section">
          <h2>${escapePdfHtml(section.title)}</h2>
          ${formatPdfValue(section.value)}
        </section>
      `)
      .join("");

    reportWindow.document.open();
    reportWindow.document.write(`<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>${escapePdfHtml(title)} — ZENAI</title>
<style>
  @page { size: A4; margin: 16mm 15mm 18mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #172033; background: #fff; font-size: 10.5px; line-height: 1.45; }
  .pdf-header { display:flex; align-items:center; gap:14px; padding-bottom:14px; border-bottom:2px solid #2563eb; margin-bottom:20px; }
  .pdf-logo { width:58px; height:58px; object-fit:contain; }
  .brand { margin:0; font-size:18px; font-weight:800; letter-spacing:.04em; }
  .subtitle { margin:2px 0 0; font-size:10px; color:#64748b; font-weight:700; letter-spacing:.08em; text-transform:uppercase; }
  .report-title { margin:0 0 4px; font-size:20px; color:#0f172a; }
  .business { margin:0; color:#475569; font-size:11px; font-weight:600; }
  .meta { margin-top:5px; color:#64748b; font-size:9px; }
  .pdf-section { page-break-inside: avoid; margin:0 0 18px; }
  .pdf-section h2 { margin:0 0 8px; padding:7px 10px; background:#f8fafc; border-left:4px solid #2563eb; color:#1e3a8a; font-size:12px; }
  .pdf-table { width:100%; border-collapse:collapse; margin-top:4px; }
  .pdf-table th, .pdf-table td { border:1px solid #cbd5e1; padding:7px 9px; vertical-align:top; }
  .pdf-table th { width:42%; text-align:left; background:#f8fafc; font-weight:700; color:#334155; }
  .pdf-table td { text-align:right; }
  .pdf-table td .pdf-table { margin-top:0; }
  .pdf-table td .pdf-table th, .pdf-table td .pdf-table td { text-align:left; }
  ul { margin:5px 0 5px 20px; padding:0; }
  li { margin-bottom:4px; }
  .pdf-footer { margin-top:24px; padding-top:10px; border-top:1px solid #cbd5e1; color:#64748b; font-size:8.5px; text-align:center; }
  .print-actions { position:sticky; top:0; padding:10px 0; background:#fff; text-align:right; }
  .print-actions button { border:0; background:#2563eb; color:#fff; padding:9px 14px; border-radius:8px; font-weight:700; cursor:pointer; }
  @media print { .print-actions { display:none; } }
</style>
</head>
<body>
<div class="print-actions"><button onclick="window.print()">Cetak / Simpan sebagai PDF</button></div>
<header class="pdf-header">
  <img class="pdf-logo" src="${window.location.origin}/zenai-logo.png" alt="ZenAI Logo" onerror="this.style.display='none'" />
  <div>
    <div class="brand">ZENAI</div>
    <div class="subtitle">Pendamping Bisnis Berbasis AI</div>
  </div>
</header>
<h1 class="report-title">${escapePdfHtml(title)}</h1>
<p class="business">Usaha: ${escapePdfHtml(businessName)}</p>
<p class="meta">Dibuat: ${escapePdfHtml(generatedAt)}</p>
${sectionHtml}
<div class="pdf-footer">ZENAI — AI BUSINESS ASSISTANT · Pahami. Putuskan. Tumbuh.</div>
</body>
</html>`);
    reportWindow.document.close();
  };

  const exportPulsePdf = () => exportReportPdf("Laporan Kondisi Usaha", [
    { title: "Kondisi Usaha", value: pulseData }
  ]);

  const exportDiagnosisPdf = () => exportReportPdf("Laporan Diagnosis Usaha", [
    { title: "Diagnosis Usaha", value: diagnosis }
  ]);

  const exportMarketPdf = () => {
    const analysis = marketData?.analysis || {};
    const sourceItems = Array.isArray(marketData?.sources)
      ? marketData.sources.slice(0, 10).map((item, index) => ({
          No: index + 1,
          Judul: item?.title || "Sumber informasi",
          Tanggal: item?.publishedDate || "—",
          Tautan: item?.url || "—"
        }))
      : [];

    return exportReportPdf("Laporan Perspektif Bisnis", [
      {
        title: "Ringkasan",
        value: analysis.summary || "Belum tersedia."
      },
      {
        title: "Kondisi Pasar",
        value: analysis.marketCondition || "Belum tersedia."
      },
      {
        title: "Sinyal Permintaan",
        value: analysis.demandSignal || "Belum tersedia."
      },
      {
        title: "Perspektif Bisnis",
        value: analysis.businessPerspective || "Belum tersedia."
      },
      {
        title: "Faktor Eksternal",
        value: analysis.externalFactors || []
      },
      {
        title: "Risiko",
        value: analysis.risks || []
      },
      {
        title: "Peluang",
        value: analysis.opportunities || []
      },
      {
        title: "Wawasan Persaingan",
        value: analysis.competitionInsight || "Belum tersedia."
      },
      {
        title: "Skenario",
        value: analysis.scenarios || {}
      },
      {
        title: "Implikasi Strategis",
        value: analysis.strategicImplication || "Belum tersedia."
      },
      {
        title: "Keterbatasan",
        value: analysis.limitations || "Belum tersedia."
      },
      ...(sourceItems.length
        ? [{ title: "Sumber Informasi", value: sourceItems }]
        : [])
    ]);
  };

  const exportAutopilotPdf = () => {
    const plans = [
      { title: "Rencana 7 Hari", value: Array.isArray(autopilotData?.plan7) ? autopilotData.plan7 : [] },
      { title: "Rencana 14 Hari", value: Array.isArray(autopilotData?.plan14) ? autopilotData.plan14 : [] },
      { title: "Rencana 30 Hari", value: Array.isArray(autopilotData?.plan30) ? autopilotData.plan30 : [] },
    ].filter((section) => section.value.length > 0);

    return exportReportPdf("Rencana Strategi dan Tindakan", [
      { title: "Strategi Utama", value: autopilotData?.mission || autopilotData?.strategy || {} },
      ...plans,
      { title: "Tindakan Pertumbuhan", value: growthActions }
    ]);
  };

  const exportFinancePdf = () => {
    const current = financeCurrentTotals;
    const transactions = financeTransactions
      .filter((item) => item.date?.slice(0, 7) === financePeriod)
      .map((item) => ({
        Tanggal: item.date,
        Keterangan: item.description,
        Jenis: financeTypes.find((type) => type.value === item.type)?.label || item.type,
        Jumlah: formatRupiah(item.amount)
      }));

    return exportReportPdf(`Laporan Keuangan — ${financePeriodLabel(financePeriod)}`, [
      {
        title: "Laporan Laba Rugi",
        value: {
          "Pendapatan": formatRupiah(current.income),
          "Harga Pokok Penjualan": formatRupiah(current.hpp),
          "Laba Kotor": formatRupiah(current.grossProfit),
          "Beban Operasional": formatRupiah(current.expense),
          "Laba Bersih": formatRupiah(current.netProfit)
        }
      },
      {
        title: "Laporan Arus Kas",
        value: {
          "Kas Masuk": formatRupiah(current.cashIn),
          "Kas Keluar": formatRupiah(current.cashOut),
          "Perubahan Kas Bersih": formatRupiah(current.cashChange),
          "Saldo Kas dan Bank": formatRupiah(current.cashTotal)
        }
      },
      {
        title: "Laporan Posisi Keuangan",
        value: {
          "ASET": "",
          "Kas dan Bank": formatRupiah(current.cashTotal),
          "Piutang Usaha": formatRupiah(current.receivable),
          "Persediaan": formatRupiah(current.inventory),
          "Total Aset": formatRupiah(current.totalAssets),
          "LIABILITAS DAN EKUITAS": "",
          "Liabilitas": formatRupiah(current.debt),
          "Modal": formatRupiah(current.capital),
          "Laba Ditahan": formatRupiah(current.cumulativeNetProfit),
          "Prive": formatRupiah(current.withdrawal),
          "Total Ekuitas": formatRupiah(current.totalEquity),
          "Total Liabilitas dan Ekuitas": formatRupiah(current.debt + current.totalEquity)
        }
      },
      {
        title: "Analisis Keuangan ZENAI",
        value: {
          "Kesimpulan": financeInsight.headline,
          "Ringkasan": financeInsight.summary,
          "Perubahan Utama": financeInsight.points,
          "Keterkaitan Analisis Bisnis": financeInsight.linkedAnalysis
        }
      },
      {
        title: "Rincian Transaksi",
        value: transactions.length ? transactions : "No transactions recorded for this period."
      }
    ]);
  };

  // Supabase auth screens are rendered only after all hooks have run.
  // This keeps React hook order stable and avoids rendering JSX inside useEffect.
  if (supabase && !authReady) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          fontFamily: "Inter, Arial, sans-serif"
        }}
      >
        <div style={{ color: darkMode ? "#CBD5E1" : "#64748B" }}>Memuat ZenAI...</div>
      </main>
    );
  }

  if (supabase && !session && !showAuth) {
    return (
      <ZenLanding
        darkMode={darkMode}
        onLogin={() => { setAuthMode("login"); setShowAuth(true); }}
        onSignup={() => { setAuthMode("signup"); setShowAuth(true); }}
      />
    );
  }
  if (supabase && !session) {
  return (
    <main
      style={{
        width: "100%",
        minHeight: "100vh",
        maxWidth: "none",
        margin: 0,
        padding: "24px",
        boxSizing: "border-box",

        display: "grid",
        placeItems: "center",

        background: darkMode ? "#0b1120" : "#F8FAFC",
        color: darkMode ? "#F8FAFC" : "#0F172A",
        fontFamily: "Inter, Arial, sans-serif",

        position: "relative",
        overflowX: "hidden",
      }}
    >
        <form
          onSubmit={handleAuth}
          style={{
            width: "100%",
            maxWidth: "420px",
            background: darkMode ? "#111827" : "#FFFFFF",
            color: darkMode ? "#F8FAFC" : "#0F172A",
            border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
            borderRadius: "20px",
            padding: "28px",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              marginBottom: "24px"
            }}
          >
            <img
              src="/zenai-logo.png"
              alt="ZENAI"
              style={{
                width: "180px",
                height: "180px",
                objectFit: "contain",
                marginBottom: "8px"
              }}
            />
            <div
              style={{
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "2px",
                color: darkMode ? "#6ee7b7" : "#2563EB"
              }}
            >
              Know More Grow More
            </div>
            <button type="button" onClick={() => setShowAuth(false)} style={{ marginTop: "14px", background: "transparent", color: darkMode ? "#93C5FD" : "#2563EB", fontWeight: "700", cursor: "pointer" }}>← Kembali ke beranda</button>
          </div>

          <div
            style={{
              color: darkMode ? "#CBD5E1" : "#64748B",
              marginBottom: "24px",
              lineHeight: "1.5",
              textAlign: "center"
            }}
          >
            {authMode === "login"
              ? "Masuk untuk menyimpan data bisnis dan hasil AI secara permanen."
              : "Buat akun ZENAI agar data tersimpan di cloud."}
          </div>

          <label style={{ display: "block", fontWeight: "600", marginBottom: "7px", color: darkMode ? "#F8FAFC" : "#0F172A" }}>
            Email
          </label>
          <input
            type="email"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            autoComplete="email"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #CBD5E1",
              borderRadius: "10px",
              marginBottom: "14px",
              boxSizing: "border-box"
            }}
          />

          <label style={{ display: "block", fontWeight: "600", marginBottom: "7px", color: darkMode ? "#F8FAFC" : "#0F172A" }}>
            Password
          </label>
          <input
            type="password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            autoComplete={authMode === "login" ? "current-password" : "new-password"}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #CBD5E1",
              borderRadius: "10px",
              marginBottom: "16px",
              boxSizing: "border-box"
            }}
          />

          <button
            type="submit"
            disabled={authLoading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "10px",
              background: darkMode ? "#2563EB" : "#2563EB",
              color: "#FFFFFF",
              fontWeight: "700",
              cursor: authLoading ? "not-allowed" : "pointer"
            }}
          >
            {authLoading
              ? "Memproses..."
              : authMode === "login"
                ? "Masuk"
                : "Buat Akun"}
          </button>

          {authMessage && (
            <div
              style={{
                marginTop: "14px",
                color: darkMode ? "#E2E8F0" : "#475569",
                fontSize: "14px",
                lineHeight: "1.5"
              }}
            >
              {authMessage}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setAuthMode(authMode === "login" ? "signup" : "login");
              setAuthMessage("");
            }}
            style={{
              marginTop: "16px",
              border: "none",
              background: "transparent",
              color: darkMode ? "#60A5FA" : "#2563EB",
              fontWeight: "600",
              cursor: "pointer",
              padding: 0
            }}
          >
            {authMode === "login"
              ? "Belum punya akun? Buat akun"
              : "Sudah punya akun? Masuk"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main
  className={`zenai-app ${darkMode ? "zenai-dark" : "zenai-light"}`}
  style={{
        flex: 1,
minWidth: 0,
overflowX: "hidden",
padding: isMobile ? "16px 12px" : "32px",
        minHeight: "100vh",
        background: darkMode ? "#0B1120" : "#F8FAFC",
        color: darkMode ? "#F8FAFC" : "#0F172A",
        display: "flex",
        fontFamily: "Arial, sans-serif"
      }}
    >
     {/* MOBILE OVERLAY */}
     {isMobile && sidebarOpen && <button type="button" className="zenai-sidebar-overlay" aria-label="Tutup menu" onClick={() => setSidebarOpen(false)} />}
     {/* SIDEBAR */}
<aside
  className={`zenai-sidebar ${sidebarOpen ? "open" : "closed"}`}
  style={{
    width: isMobile ? (sidebarOpen ? "220px" : "64px") : (sidebarOpen ? "280px" : "72px"),
    minWidth: isMobile ? (sidebarOpen ? "220px" : "64px") : (sidebarOpen ? "280px" : "72px"),
    height: "100dvh",
    maxHeight: "100dvh",
    background: darkMode ? "#111827" : "#FFFFFF",
    borderRight: "1px solid #E2E8F0",
    padding: sidebarOpen
      ? (isMobile ? "14px 10px" : "18px 14px")
      : (isMobile ? "14px 6px" : "18px 8px"),
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 1000,
    boxSizing: "border-box",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    overscrollBehavior: "contain",
    transition: "width 0.25s ease, min-width 0.25s ease, padding 0.25s ease"
  }}
>
  {/* TOGGLE SIDEBAR */}
  <button
    onClick={() => setSidebarOpen(!sidebarOpen)}
    title={sidebarOpen ? "Tutup menu" : "Buka menu"}
    style={{
      width: "100%",
      minHeight: "40px",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: "7px 8px",
      marginBottom: "6px",
      fontSize: "21px",
      lineHeight: 1,
      textAlign: sidebarOpen ? "right" : "center",
      color: "#334155",
      flexShrink: 0
    }}
  >
    <ZenIcon name="menu" size={20} />
  </button>

  {/* LOGO */}
  <div
    style={{
      padding: sidebarOpen ? "4px 8px 12px" : "4px 0 12px",
      display: "flex",
      flexDirection: "column",
      alignItems: sidebarOpen ? "flex-start" : "center",
      justifyContent: "center",
      overflow: "hidden",
      flexShrink: 0
    }}
  >
    <img
      src={sidebarOpen ? "/zenai-logo.png" : "/zenai-mark.png"}
      alt="ZENAI"
      style={{
        display: "block",
        width: sidebarOpen ? "clamp(70px, 13vh, 110px)" : (isMobile ? "42px" : "46px"),
        height: sidebarOpen ? "clamp(70px, 13vh, 110px)" : (isMobile ? "42px" : "46px"),
        objectFit: "contain",
        objectPosition: "center",
        filter: darkMode ? "brightness(1.08) saturate(1.05)" : "none",
        transition: "all 0.25s ease"
      }}
    />
    {sidebarOpen && (
      <div
        style={{
          marginTop: "-4px",
          paddingLeft: "2px",
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "1px",
          color: darkMode ? "#CBD5E1" : "#64748B",
          whiteSpace: "nowrap"
        }}
      >
        AI Business Assistant
      </div>
    )}
  </div>

  {/* NAVIGASI UTAMA */}
  <nav
    className="zenai-sidebar-nav"
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "clamp(5px, 0.9vh, 7px)",
      flex: "1 1 auto",
      minHeight: 0,
      maxHeight: "100%",
      overflowY: "auto",
      overflowX: "hidden",
      paddingRight: "3px",
      paddingBottom: "4px",
      scrollbarWidth: "thin",
      WebkitOverflowScrolling: "touch"
    }}
  >
    {[
      ["home", "dashboard", "Dashboard"],
      ["capture", "capture", "Ceritakan Usaha"],
      ["pulse", "activity", "Kondisi Usaha"],
      ["diagnosis", "diagnosis", "Diagnosis"],
      ["market", "perspective", "Perspektif Bisnis"],
      ["autopilot", "strategy", "Strategi & Tindakan"],
      ["finance", "finance", "Laporan Keuangan"],
      ["advancedAnalysis", "intelligence", "Analisis Lanjutan"],
    ].map(([key, icon, label]) => (
      <button
        key={key}
        onClick={() => {
          setTab(key);
          if (isMobile) setSidebarOpen(false);
        }}
        title={sidebarOpen ? "" : label}
        style={{
          width: "100%",
          minHeight: "43px",
          border: tab === key ? "1px solid #BFDBFE" : "1px solid #e8edf3",
          padding: "10px 12px",
          borderRadius: "10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "flex-start" : "center",
          gap: sidebarOpen ? "9px" : "0",
          textAlign: sidebarOpen ? "left" : "center",
          background: tab === key ? (darkMode ? "#172554" : "#EFF6FF") : (darkMode ? "#111827" : "#FFFFFF"),
          color: tab === key ? (darkMode ? "#60A5FA" : "#2563EB") : (darkMode ? "#E2E8F0" : "#475569"),
          fontWeight: tab === key ? "700" : "500",
          boxShadow: tab === key ? "0 3px 10px rgba(37, 99, 235, 0.08)" : "0 1px 2px rgba(15, 23, 42, 0.03)",
          fontSize: "13px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          flexShrink: 0
        }}
      >
        <span className="zenai-nav-icon"><ZenIcon name={icon} size={18} /></span>
        {sidebarOpen && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>}
      </button>
    ))}
  </nav>

  {/* AREA BAWAH SIDEBAR */}
  <div
    style={{
      marginTop: "clamp(6px, 1.5vh, 14px)",
      paddingTop: "clamp(6px, 1.2vh, 10px)",
      flexShrink: 0,
      minHeight: 0
    }}
  >
    <div
      style={{
        height: "1px",
        background: darkMode ? "#334155" : "#E2E8F0",
        margin: "0 2px 9px"
      }}
    />

    <div style={{ display: "grid", gap: "7px", marginBottom: "7px" }}>
      <button
        type="button"
        onClick={() => { setTab("guide"); if (isMobile) setSidebarOpen(false); }}
        title={sidebarOpen ? "" : "Panduan"}
        aria-label="Panduan"
        style={{
          width: "100%",
          minHeight: "41px",
          border: tab === "guide" ? "1px solid #BFDBFE" : "1px solid #E2E8F0",
          background: tab === "guide" ? (darkMode ? "#172554" : "#EFF6FF") : (darkMode ? "#111827" : "#FFFFFF"),
          color: tab === "guide" ? (darkMode ? "#60A5FA" : "#2563EB") : (darkMode ? "#E2E8F0" : "#475569"),
          padding: "9px 11px",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "flex-start" : "center",
          gap: sidebarOpen ? "8px" : "0",
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontWeight: "600"
        }}
      >
        <span className="zenai-nav-icon"><ZenIcon name="guide" size={17} /></span>
        {sidebarOpen && <span>Panduan</span>}
      </button>

      <button
        type="button"
        onClick={() => { setTab("settings"); if (isMobile) setSidebarOpen(false); }}
        title={sidebarOpen ? "" : "Pengaturan"}
        aria-label="Pengaturan"
        style={{
          width: "100%",
          minHeight: "41px",
          border: tab === "settings" ? "1px solid #BFDBFE" : "1px solid #E2E8F0",
          background: tab === "settings" ? (darkMode ? "#172554" : "#EFF6FF") : (darkMode ? "#111827" : "#FFFFFF"),
          color: tab === "settings" ? (darkMode ? "#60A5FA" : "#2563EB") : (darkMode ? "#E2E8F0" : "#475569"),
          padding: "9px 11px",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "flex-start" : "center",
          gap: sidebarOpen ? "8px" : "0",
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontWeight: "600"
        }}
      >
        <span className="zenai-nav-icon"><ZenIcon name="settings" size={17} /></span>
        {sidebarOpen && <span>Pengaturan</span>}
      </button>
    </div>

      <button
        type="button"
        onClick={async () => {
          const ok = window.confirm("Keluar dari akun ZenAI?");
          if (!ok) return;
          await handleLogout();
        }}
        title={sidebarOpen ? "" : "Keluar"}
        aria-label="Keluar"
        style={{
          width: "100%",
          minHeight: "41px",
          border: "1px solid #fda4af",
          background: darkMode ? "#111827" : "#FFFFFF",
          color: "#e11d48",
          padding: "9px 11px",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "flex-start" : "center",
          gap: sidebarOpen ? "8px" : "0",
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontWeight: "600"
        }}
      >
        <span className="zenai-nav-icon"><ZenIcon name="logout" size={17} /></span>
        {sidebarOpen && <span>Keluar</span>}
      </button>
    </div>
</aside>

      {/* KONTEN UTAMA */}
      {isMobile && <button type="button" className="zenai-mobile-menu" aria-label="Buka menu" onClick={() => setSidebarOpen(true)}><ZenIcon name="menu" size={20} /></button>}
      <section
  className="zenai-content"
  style={{
    flex: 1,
    minWidth: 0,

    marginLeft: isMobile
      ? "0"
      : (sidebarOpen ? "280px" : "72px"),

    width: isMobile
      ? "100%"
      : `calc(100% - ${sidebarOpen ? "280px" : "72px"})`,

    padding: isMobile ? "24px 12px" : "32px",
    boxSizing: "border-box",
    transition: "margin-left 0.25s ease, width 0.25s ease"
  }}
>
        {/* HEADER */}
        <header
          className="zenai-page-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px",
            background: darkMode ? "#111827" : "transparent",
            color: darkMode ? "#F8FAFC" : "#0F172A",
            border: darkMode ? "1px solid #334155" : "none",
            borderRadius: darkMode ? "24px" : "0",
            padding: darkMode ? "28px 32px" : "0"
          }}
        >
          <div style={{ width: "100%" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "28px",
                color: darkMode ? "#FFFFFF" : "#0F172A",
                fontWeight: "800"
              }}
            >
              {tab === "home" &&
                "Dashboard Usaha"}

              {tab === "capture" &&
                "Ceritakan Usaha Anda"}

              {tab === "pulse" &&
                "Kondisi Usaha"}

              {tab === "diagnosis" &&
                "Diagnosis Usaha"}

              {tab === "autopilot" &&
                "Strategi & Tindakan"}

              {tab === "guide" && "Panduan ZenAI"}

              {tab === "settings" && "Pengaturan"}

              {tab === "finance" &&
                "Laporan Keuangan"}

{tab === "market" &&
  "Perspektif Bisnis"}

              {tab === "advancedAnalysis" &&
                "Analisis Lanjutan"}
            </h2>

            <p
              style={{
                margin: "8px 0 0",
                color: darkMode ? "#d1fae5" : "#64748B",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              {tab === "settings"
                ? "Kelola sistem, tampilan, dan data ZenAI dari satu tempat."
                : provider
                  ? `AI aktif: ${provider}`
                  : "Gunakan AI untuk memahami kondisi usaha Anda."}
            </p>
          </div>

          {busy && (
            <div
              style={{
                background: "#EFF6FF",
                color: darkMode ? "#60A5FA" : "#2563EB",
                padding: "10px 16px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: "600"
              }}
            >
               AI sedang menganalisis...
            </div>
          )}
        </header>

        {/* =========================
            PENGATURAN
        ========================== */}
        {tab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                padding: "22px",
                borderRadius: "18px",
                border: `1px solid ${darkMode ? "#334155" : "#BFDBFE"}`,
                background: darkMode ? "#111827" : "#FFFFFF"
              }}
            >
              <div style={{ fontSize: "20px", fontWeight: "800", color: darkMode ? "#F8FAFC" : "#0F172A" }}>
                ️ Pengaturan ZenAI
              </div>
              <div style={{ marginTop: "6px", color: darkMode ? "#CBD5E1" : "#64748B", fontSize: "14px", lineHeight: 1.5 }}>
                Kelola pengaturan dan preferensi ZenAI di sini.
              </div>
            </div>

            <div
              style={{
                padding: "22px",
                borderRadius: "18px",
                border: `1px solid ${darkMode ? "#334155" : "#BFDBFE"}`,
                background: darkMode ? "#0F172A" : "#EFF6FF"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: darkMode ? "#F8FAFC" : "#0F172A" }}> System Health</div>
                  <div style={{ marginTop: "6px", color: darkMode ? "#CBD5E1" : "#1D4ED8", fontSize: "14px", lineHeight: 1.5 }}>
                    Periksa kondisi layanan ZenAI dan koneksi AI secara langsung.
                  </div>
                </div>
                <button type="button" onClick={runLiveHealthCheck} disabled={healthLoading} style={{ border: "none", borderRadius: "10px", padding: "11px 16px", background: "#2563EB", color: "#FFFFFF", fontWeight: "800", cursor: healthLoading ? "wait" : "pointer" }}>
                  {healthLoading ? "Memeriksa..." : "Run Live Health Check"}
                </button>
              </div>
            </div>

            {healthError && (
              <div style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid #FDA4AF", background: darkMode ? "#3B121D" : "#FFF1F2", color: darkMode ? "#FECDD3" : "#9F1239", fontSize: "14px" }}>
                {healthError}
              </div>
            )}

            {healthData && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
                  {(healthData.services || []).map((service) => (
                    <div key={service.name} style={{ padding: "18px", borderRadius: "14px", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`, background: darkMode ? "#111827" : "#FFFFFF" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                        <strong>{service.name}</strong>
                        <span style={{ fontWeight: "800", color: service.status === "operational" ? "#2563EB" : service.status === "configured" ? "#B45309" : "#BE123C" }}>
                          {service.status === "operational" ? " OPERATIONAL" : service.status === "configured" ? " CONFIGURED" : " DOWN"}
                        </span>
                      </div>
                      <div style={{ marginTop: "8px", color: darkMode ? "#CBD5E1" : "#64748B", fontSize: "13px", lineHeight: 1.5 }}>{service.detail}</div>
                      {service.latencyMs != null && <div style={{ marginTop: "8px", fontSize: "12px", color: darkMode ? "#94A3B8" : "#64748B" }}>Latency: {service.latencyMs} ms</div>}
                    </div>
                  ))}
                </div>
                {healthData.liveAiSmokeTest && (
                  <div style={{ padding: "18px", borderRadius: "14px", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`, background: darkMode ? "#111827" : "#FFFFFF" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><strong>Live AI Smoke Test</strong><span style={{ color: darkMode ? "#60A5FA" : "#2563EB", fontWeight: "800" }}> OPERATIONAL</span></div>
                    <div style={{ marginTop: "8px", fontSize: "13px", color: darkMode ? "#CBD5E1" : "#64748B" }}>Provider: {healthData.liveAiSmokeTest.provider} · Latency: {healthData.liveAiSmokeTest.latencyMs} ms · Response: {healthData.liveAiSmokeTest.response || "—"}</div>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap", padding: "16px", borderRadius: "14px", background: darkMode ? "#0F172A" : "#F8FAFC" }}>
                  <div><strong>{healthData.summary?.operational ?? 0}/{healthData.summary?.total ?? 0} layanan operational</strong><div style={{ marginTop: "4px", fontSize: "12px", color: darkMode ? "#94A3B8" : "#64748B" }}>Checked: {healthData.checkedAt ? new Date(healthData.checkedAt).toLocaleString("id-ID") : "—"}</div></div>
                  <button type="button" onClick={runLiveAiSmokeTest} disabled={healthLoading} style={{ border: `1px solid ${darkMode ? "#475569" : "#CBD5E1"}`, borderRadius: "10px", padding: "10px 14px", background: darkMode ? "#111827" : "#FFFFFF", color: darkMode ? "#F8FAFC" : "#0F172A", fontWeight: "700", cursor: healthLoading ? "wait" : "pointer" }}>{healthLoading ? "Menguji AI..." : "Run AI Smoke Test"}</button>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: "18px" }}>
              <div style={{ padding: "20px", borderRadius: "18px", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`, background: darkMode ? "#111827" : "#FFFFFF" }}>
                <div style={{ fontSize: "17px", fontWeight: "800", color: darkMode ? "#F8FAFC" : "#0F172A" }}> Tampilan</div>
                <div style={{ marginTop: "6px", color: darkMode ? "#CBD5E1" : "#64748B", fontSize: "13px", lineHeight: 1.5 }}>Atur tema antarmuka ZenAI.</div>
                <button type="button" onClick={() => setDarkMode((current) => !current)} style={{ marginTop: "14px", width: "100%", minHeight: "43px", border: `1px solid ${darkMode ? "#475569" : "#CBD5E1"}`, background: darkMode ? "#0F172A" : "#F8FAFC", color: darkMode ? "#F8FAFC" : "#0F172A", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}>
                  {darkMode ? "️ Gunakan Tema Terang" : " Gunakan Tema Gelap"}
                </button>
              </div>

              <div style={{ padding: "20px", borderRadius: "18px", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`, background: darkMode ? "#111827" : "#FFFFFF" }}>
                <div style={{ fontSize: "17px", fontWeight: "800", color: darkMode ? "#F8FAFC" : "#0F172A" }}>️ Data & Reset</div>
                <div style={{ marginTop: "6px", color: darkMode ? "#CBD5E1" : "#64748B", fontSize: "13px", lineHeight: 1.5 }}>Reset analisis atau hapus seluruh data perusahaan.</div>
                <div style={{ display: "grid", gap: "9px", marginTop: "14px" }}>
                  <button type="button" disabled={!business} onClick={() => { const ok = window.confirm("Reset Analisis? Profil perusahaan dan laporan keuangan tetap disimpan."); if (ok) resetAnalysis(); }} style={{ width: "100%", minHeight: "43px", border: "1px solid #FDA4AF", background: darkMode ? "#3B121D" : "#FFF1F2", color: darkMode ? "#FDA4AF" : "#9F1239", padding: "10px 14px", borderRadius: "10px", cursor: business ? "pointer" : "not-allowed", fontWeight: "700", opacity: business ? 1 : 0.55 }}> Reset Analisis</button>
                  <button type="button" disabled={!business} onClick={resetCompanyTotal} style={{ width: "100%", minHeight: "43px", border: "1px solid #FDA4AF", background: darkMode ? "#3B121D" : "#FFF1F2", color: darkMode ? "#FDA4AF" : "#9F1239", padding: "10px 14px", borderRadius: "10px", cursor: business ? "pointer" : "not-allowed", fontWeight: "700", opacity: business ? 1 : 0.55 }}> Reset Perusahaan Total</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================
            PANDUAN ZENAI
        ========================== */}
        {tab === "guide" && (() => {
          const hasBusiness = !!business;
          const hasPulse = !!pulseData;
          const hasDiagnosis = !!diagnosis;
          const hasMarket = !!marketData;
          const hasAutopilot = !!autopilotData;
          const hasGrowth = Array.isArray(growthActions) && growthActions.length > 0;
          const hasFinance = Array.isArray(financeTransactions) && financeTransactions.length > 0;

          const guideSteps = [
            {
              key: "capture",
              title: "Ceritakan Usaha",
              icon: "",
              done: hasBusiness,
              text: "Masukkan cerita, profil, kondisi, produk, pelanggan, dan informasi penting usaha Anda. Ini menjadi konteks utama ZenAI.",
              action: "Buka Ceritakan Usaha",
              canOpen: true
            },
            {
              key: "pulse",
              title: "Kondisi Usaha",
              icon: "",
              done: hasPulse,
              text: "Gunakan Business Pulse untuk melihat gambaran kondisi dan prioritas usaha berdasarkan konteks yang sudah diberikan.",
              action: "Buka Kondisi Usaha",
              canOpen: hasBusiness
            },
            {
              key: "diagnosis",
              title: "Diagnosis",
              icon: "",
              done: hasDiagnosis,
              text: "Gunakan Diagnosis untuk memahami masalah, kekuatan, peluang, rekomendasi, dan langkah berikutnya.",
              action: "Buka Diagnosis",
              canOpen: hasBusiness
            },
            {
              key: "market",
              title: "Perspektif Bisnis",
              icon: "",
              done: hasMarket,
              text: "ZenAI memperkaya analisis dengan informasi eksternal yang relevan. Tavily bekerja di belakang layar sebagai sumber informasi, kemudian AI mengolahnya menjadi perspektif bisnis.",
              action: "Buka Perspektif Bisnis",
              canOpen: hasBusiness
            },
            {
              key: "autopilot",
              title: "Strategi & Tindakan",
              icon: "",
              done: hasAutopilot,
              text: "Ubah hasil analisis menjadi strategi dan tindakan yang dapat dijalankan. Pilih durasi yang sesuai dengan kebutuhan usaha.",
              action: "Buka Strategi & Tindakan",
              canOpen: hasBusiness
            },
            {
              key: "growth",
              title: "Growth Loop",
              icon: "",
              done: hasGrowth,
              text: "Jadikan strategi sebagai tindakan, mulai, selesaikan, catat hasil, dan evaluasi. Hasil evaluasi digunakan sebagai konteks untuk analisis berikutnya.",
              action: "Buka Strategi & Tindakan",
              canOpen: hasAutopilot
            },
            {
              key: "finance",
              title: "Laporan Keuangan",
              icon: "",
              done: hasFinance,
              text: "Catat transaksi dan gunakan ringkasan keuangan untuk memahami pendapatan, HPP, biaya, laba, arus kas, dan posisi keuangan.",
              action: "Buka Laporan Keuangan",
              canOpen: true
            },
          ];

          const nextStep =
            !hasBusiness ? guideSteps[0] :
            !hasPulse ? guideSteps[1] :
            !hasDiagnosis ? guideSteps[2] :
            !hasMarket ? guideSteps[3] :
            !hasAutopilot ? guideSteps[4] :
            !hasGrowth ? guideSteps[5] :
            guideSteps[6];

          const openGuideStep = (step) => {
            if (!step.canOpen) {
              setTab("capture");
              return;
            }
            setTab(step.key === "growth" ? "autopilot" : step.key);
          };

          return (
            <div style={{ maxWidth: "1050px", display: "grid", gap: "18px" }}>
              <div
                style={{
                  background: darkMode ? "#0F172A" : "#FFFFFF",
                  border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
                  borderRadius: "20px",
                  padding: "26px"
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: "800", color: darkMode ? "#6ee7b7" : "#2563EB", letterSpacing: "0.04em" }}>
                  PANDUAN INTERAKTIF
                </div>
                <h3 style={{ margin: "7px 0 8px", fontSize: "25px", color: darkMode ? "#F8FAFC" : "#0F172A" }}>
                  Bingung harus mulai dari mana?
                </h3>
                <p style={{ margin: 0, color: darkMode ? "#CBD5E1" : "#64748B", lineHeight: 1.65, maxWidth: "760px" }}>
                  ZenAI akan membimbing Anda sesuai kondisi data yang sudah ada. Tidak perlu membuka semua menu sekaligus.
                  Ikuti langkah berikut dan gunakan tombol tindakan untuk melanjutkan.
                </p>
              </div>

              <div
                style={{
                  background: darkMode ? "#172033" : "#EFF6FF",
                  border: `1px solid ${darkMode ? "#1D4ED8" : "#BFDBFE"}`,
                  borderRadius: "18px",
                  padding: "22px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "18px",
                  flexWrap: "wrap"
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "800", color: darkMode ? "#6ee7b7" : "#2563EB", marginBottom: "5px" }}>
                    LANGKAH BERIKUTNYA
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: darkMode ? "#FFFFFF" : "#0F172A" }}>
                    {nextStep.icon} {nextStep.title}
                  </div>
                  <div style={{ marginTop: "6px", color: darkMode ? "#d1fae5" : "#475569", lineHeight: 1.55 }}>
                    {nextStep.text}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openGuideStep(nextStep)}
                  disabled={!nextStep.canOpen}
                  style={{
                    border: "none",
                    borderRadius: "11px",
                    padding: "12px 18px",
                    background: nextStep.canOpen ? "#2563EB" : "#94A3B8",
                    color: "#FFFFFF",
                    fontWeight: "800",
                    cursor: nextStep.canOpen ? "pointer" : "not-allowed",
                    whiteSpace: "nowrap"
                  }}
                >
                  {nextStep.action} →
                </button>
              </div>

              <div
                style={{
                  background: darkMode ? "#0F172A" : "#FFFFFF",
                  border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
                  borderRadius: "20px",
                  padding: "22px"
                }}
              >
                <h3 style={{ margin: "0 0 15px", color: darkMode ? "#F8FAFC" : "#0F172A" }}>
                   Alur utama ZenAI
                </h3>
                <div style={{ display: "grid", gap: "9px" }}>
                  {guideSteps.slice(0, 6).map((step, index) => (
                    <div
                      key={step.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
                        background: step.done
                          ? (darkMode ? "#052e16" : "#EFF6FF")
                          : (darkMode ? "#111827" : "#F8FAFC")
                      }}
                    >
                      <div style={{ width: "28px", textAlign: "center", fontWeight: "800", color: step.done ? "#2563EB" : "#64748B" }}>
                        {step.done ? "" : index + 1}
                      </div>
                      <div style={{ fontSize: "17px" }}>{step.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "800", color: darkMode ? "#F8FAFC" : "#0F172A" }}>
                          {step.title}
                        </div>
                        <div style={{ fontSize: "12px", color: darkMode ? "#94A3B8" : "#64748B", marginTop: "3px" }}>
                          {step.text}
                        </div>
                      </div>
                      {step.canOpen && (
                        <button
                          type="button"
                          onClick={() => openGuideStep(step)}
                          style={{
                            border: `1px solid ${darkMode ? "#475569" : "#CBD5E1"}`,
                            background: darkMode ? "#1e293b" : "#FFFFFF",
                            color: darkMode ? "#E2E8F0" : "#334155",
                            borderRadius: "9px",
                            padding: "8px 10px",
                            cursor: "pointer",
                            fontWeight: "700",
                            fontSize: "12px"
                          }}
                        >
                          Buka
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: darkMode ? "#0F172A" : "#FFFFFF",
                  border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
                  borderRadius: "20px",
                  padding: "22px"
                }}
              >
                <h3 style={{ margin: "0 0 14px", color: darkMode ? "#F8FAFC" : "#0F172A" }}>
                   Jika Anda bingung
                </h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  {[
                    ["Saya baru pertama kali menggunakan ZenAI", "Mulai dari Ceritakan Usaha. Masukkan konteks usaha terlebih dahulu agar analisis berikutnya memiliki dasar.", "capture"],
                    ["Saya sudah punya profil usaha, lalu apa?", "Jalankan Kondisi Usaha untuk melihat gambaran dan prioritas, lalu lanjutkan ke Diagnosis.", "pulse"],
                    ["Apa fungsi Perspektif Bisnis?", "Fitur ini memperkaya analisis dengan informasi eksternal yang relevan. Tavily hanya menjadi sumber di belakang layar.", "market"],
                    ["Saya sudah mendapat strategi, lalu bagaimana?", "Jadikan strategi sebagai tindakan dan lanjutkan ke Growth Loop untuk menjalankan serta mengevaluasi hasilnya.", "autopilot"],
                    ["Saya ingin melihat atau mencatat keuangan", "Buka Laporan Keuangan untuk mencatat transaksi dan melihat ringkasan keuangan.", "finance"],
                    ["Sistem terasa bermasalah", "Buka System Health untuk memeriksa layanan dan menjalankan pemeriksaan sistem/AI.", "health"]
                  ].map(([question, answer, target]) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => setTab(target)}
                      style={{
                        textAlign: "left",
                        border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
                        background: darkMode ? "#111827" : "#F8FAFC",
                        color: darkMode ? "#E2E8F0" : "#334155",
                        borderRadius: "12px",
                        padding: "14px",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ fontWeight: "800", marginBottom: "5px" }}>{question}</div>
                      <div style={{ fontSize: "13px", lineHeight: 1.55, color: darkMode ? "#94A3B8" : "#64748B" }}>{answer}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: darkMode ? "#111827" : "#F8FAFC",
                  border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
                  borderRadius: "16px",
                  padding: "15px 18px",
                  fontSize: "12px",
                  color: darkMode ? "#94A3B8" : "#64748B",
                  lineHeight: 1.55
                }}
              >
                <strong style={{ color: darkMode ? "#CBD5E1" : "#475569" }}>Catatan:</strong> Panduan ini mengikuti alur dan fitur yang tersedia di aplikasi. Data usaha, hasil analisis, strategi, dan tindakan menentukan langkah yang relevan berikutnya.
              </div>
            </div>
          );
        })()}

        {/* =========================
            DASHBOARD
        ========================== */}

        {tab === "home" && (
          <div>
            {!business ? (
              <div
                style={{
                  background: darkMode ? "#111827" : "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "20px",
                  padding: "40px",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px"
                  }}
                >
                  
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px"
                  }}
                >
                  Mulai Kenali Usaha Anda
                </h3>

                <p
                  style={{
                    color: darkMode ? "#CBD5E1" : "#64748B",
                    maxWidth: "500px",
                    margin:
                      "12px auto 24px",
                    lineHeight: "1.6"
                  }}
                >
                  Ceritakan usaha Anda kepada ZENAI.
                  Anda bisa menulis, mengirim gambar,
                  atau menggunakan rekaman suara.
                </p>

                <button
                  onClick={() =>
                    setTab("capture")
                  }
                  style={{
                    border: "none",
                    background: darkMode ? "#2563EB" : "#2563EB",
                    color: "#FFFFFF",
                    padding: "13px 22px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "700"
                  }}
                >
                  Mulai Analisis →
                </button>
              </div>
            ) : (
              <>
                {/* PROFIL USAHA */}
                <div
                  style={{
                    background: darkMode ? "#111827" : "#FFFFFF",
                    border:
                      "1px solid #E2E8F0",
                    borderRadius: "18px",
                    padding: "24px",
                    marginBottom: "24px"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                      gap: "20px"
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: darkMode ? "#CBD5E1" : "#64748B",
                          marginBottom: "6px",
                          textTransform:
                            "uppercase",
                          letterSpacing: "1px"
                        }}
                      >
                        PROFIL USAHA
                      </div>

                      <h3
                        style={{
                          margin: 0,
                          fontSize: "24px"
                        }}
                      >
                        {business.name ||
                          business.product ||
                          "Usaha Anda"}
                      </h3>

                      <p
                        style={{
                          margin:
                            "10px 0 0",
                          color: darkMode ? "#CBD5E1" : "#64748B",
                          lineHeight: "1.6"
                        }}
                      >
                        {business.description ||
                          business.summary ||
                          "Profil usaha telah dianalisis oleh ZENAI."}
                      </p>
                    </div>

                    <button
                      onClick={resetAnalysis}
                      style={{
                        border:
                          "1px solid #E2E8F0",
                        background: darkMode ? "#111827" : "#FFFFFF",
                        padding:
                          "10px 14px",
                        borderRadius:
                          "10px",
                        cursor: "pointer",
                        whiteSpace:
                          "nowrap"
                      }}
                    >
                       Reset
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "16px",
                      marginTop: "24px"
                    }}
                  >
                    <div
                      style={{
                        background: darkMode ? "#0B1120" : "#F8FAFC",
                        padding: "16px",
                        borderRadius:
                          "12px"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: darkMode ? "#CBD5E1" : "#64748B"
                        }}
                      >
                        Produk / Layanan
                      </div>

                      <strong
                        style={{
                          display: "block",
                          marginTop: "6px"
                        }}
                      >
                        {business.product ||
                          "-"}
                      </strong>
                    </div>

                    <div
                      style={{
                        background: darkMode ? "#0B1120" : "#F8FAFC",
                        padding: "16px",
                        borderRadius:
                          "12px"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: darkMode ? "#CBD5E1" : "#64748B"
                        }}
                      >
                        Target Pasar
                      </div>

                      <strong
                        style={{
                          display: "block",
                          marginTop: "6px"
                        }}
                      >
                        {business.targetMarket ||
                          "-"}
                      </strong>
                    </div>

                    <div
                      style={{
                        background: darkMode ? "#0B1120" : "#F8FAFC",
                        padding: "16px",
                        borderRadius:
                          "12px"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: darkMode ? "#CBD5E1" : "#64748B"
                        }}
                      >
                        Lokasi
                      </div>

                      <strong
                        style={{
                          display: "block",
                          marginTop: "6px"
                        }}
                      >
                        {business.location ||
                          "-"}
                      </strong>
                    </div>
                  </div>
                </div>


                {/* AKSI CEPAT */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px"
                  }}
                >
                  <button
                    onClick={() =>
                      runPulse()
                    }
                    style={{
                      textAlign: "left",
                      padding: "22px",
                      border:
                        "1px solid #E2E8F0",
                      borderRadius:
                        "16px",
                      background: darkMode ? "#111827" : "#FFFFFF",
                      cursor: "pointer"
                    }}
                  >
                    <div
                      style={{
                        fontSize: "28px",
                        marginBottom: "12px"
                      }}
                    >
                      
                    </div>

                    <strong>
                      Lihat Kondisi Usaha
                    </strong>

                    <p
                      style={{
                        margin:
                          "8px 0 0",
                        fontSize: "13px",
                        color: darkMode ? "#CBD5E1" : "#64748B",
                        lineHeight: "1.5"
                      }}
                    >
                      Ketahui hal penting yang
                      perlu diperhatikan dari
                      usaha Anda.
                    </p>
                  </button>


                  <button
                    onClick={() =>
                      runDiagnosis()
                    }
                    style={{
                      textAlign: "left",
                      padding: "22px",
                      border:
                        "1px solid #E2E8F0",
                      borderRadius:
                        "16px",
                      background: darkMode ? "#111827" : "#FFFFFF",
                      cursor: "pointer"
                    }}
                  >
                    <div
                      style={{
                        fontSize: "28px",
                        marginBottom: "12px"
                      }}
                    >
                      
                    </div>

                    <strong>
                      Diagnosis Usaha
                    </strong>

                    <p
                      style={{
                        margin:
                          "8px 0 0",
                        fontSize: "13px",
                        color: darkMode ? "#CBD5E1" : "#64748B",
                        lineHeight: "1.5"
                      }}
                    >
                      Temukan masalah,
                      kekuatan, peluang, dan
                      prioritas perbaikan.
                    </p>
                  </button>


                  <button
                    onClick={() =>
                      runAutopilot()
                    }
                    style={{
                      textAlign: "left",
                      padding: "22px",
                      border:
                        "1px solid #E2E8F0",
                      borderRadius:
                        "16px",
                      background: darkMode ? "#111827" : "#FFFFFF",
                      cursor: "pointer"
                    }}
                  >
                    <div
                      style={{
                        fontSize: "28px",
                        marginBottom: "12px"
                      }}
                    >
                      
                    </div>

                    <strong>
                      Strategi & Tindakan
                    </strong>

                    <p
                      style={{
                        margin:
                          "8px 0 0",
                        fontSize: "13px",
                        color: darkMode ? "#CBD5E1" : "#64748B",
                        lineHeight: "1.5"
                      }}
                    >
                      Dapatkan langkah
                      prioritas berdasarkan
                      kondisi usaha Anda.
                    </p>
                  </button>
                </div>


                {/* RIWAYAT ANALISIS */}
                {analysisHistory.length > 0 && (
                  <div
                    style={{
                      background: darkMode ? "#111827" : "#FFFFFF",
                      border:
                        "1px solid #E2E8F0",
                      borderRadius:
                        "18px",
                      padding: "24px"
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0
                      }}
                    >
                      Aktivitas Analisis
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        flexDirection:
                          "column",
                        gap: "12px"
                      }}
                    >
                      {analysisHistory.map(
                        (item, index) => (
                          <div
                            key={index}
                            style={{
                              padding:
                                "14px",
                              border:
                                "1px solid #F1F5F9",
                              borderRadius:
                                "12px"
                            }}
                          >
                            <strong>
                              {item.type}
                            </strong>

                                                        <p
                              style={{
                                margin:
                                  "6px 0",
                                color: darkMode ? "#94A3B8" : "#64748B",
                                fontSize:
                                  "13px"
                              }}
                            >
                              {item.description}
                            </p>

                            <span
                              style={{
                                fontSize:
                                  "12px",
                                color: darkMode ? "#CBD5E1" : "#94A3B8"
                              }}
                            >
                              {item.date}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}


        {/* =========================
            CERITAKAN USAHA
        ========================== */}

        {tab === "capture" && (
          <div
            style={{
              maxWidth: "850px"
            }}
          >
            <div
              style={{
                background: darkMode ? "#111827" : "#FFFFFF",
                border:
                  "1px solid #E2E8F0",
                borderRadius: "20px",
                padding: "28px"
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  fontSize: "22px"
                }}
              >
                Ceritakan usaha Anda
              </h3>

              <p
                style={{
                  color: darkMode ? "#CBD5E1" : "#64748B",
                  lineHeight: "1.6",
                  marginBottom: "24px"
                }}
              >
                Jelaskan usaha Anda dengan
                bahasa biasa. Semakin lengkap
                informasi yang diberikan,
                semakin baik ZENAI memahami
                kondisi usaha Anda.
              </p>


              {/* TEXT INPUT */}
              <textarea
                value={text}
                onChange={(event) =>
                  setText(
                    event.target.value
                  )
                }
                placeholder="Contoh: Saya memiliki usaha kuliner di Pekalongan. Saya menjual ayam geprek dan minuman. Penjualan akhir-akhir ini menurun, terutama pada hari kerja..."
                style={{
                  width: "100%",
                  minHeight: "180px",
                  padding: "16px",
                  border:
                    "1px solid #CBD5E1",
                  borderRadius: "12px",
                  resize: "vertical",
                  boxSizing:
                    "border-box",
                  fontFamily:
                    "inherit",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  outline: "none"
                }}
              />


              {/* GAMBAR */}
              <div
                style={{
                  marginTop: "20px"
                }}
              >
                <label
                  style={{
                    display:
                      "inline-block",
                    border:
                      "1px dashed #94A3B8",
                    padding:
                      "12px 16px",
                    borderRadius:
                      "10px",
                    cursor:
                      "pointer",
                    fontSize:
                      "14px"
                  }}
                >
                  ️ Tambahkan Foto

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageUpload
                    }
                    style={{
                      display: "none"
                    }}
                  />
                </label>

                {image && (
                  <div
                    style={{
                      marginTop: "14px"
                    }}
                  >
                    <img
                      src={image}
                      alt="Preview usaha"
                      style={{
                        width: "100%",
                        maxWidth:
                          "400px",
                        borderRadius:
                          "12px",
                        border:
                          "1px solid #E2E8F0"
                      }}
                    />

                    <div>
                      <button
                        onClick={() =>
                          setImage("")
                        }
                        style={{
                          marginTop:
                            "8px",
                          border:
                            "none",
                          background:
                            "transparent",
                          color:
                            "#e11d48",
                          cursor:
                            "pointer"
                        }}
                      >
                        Hapus Foto
                      </button>
                    </div>
                  </div>
                )}
              </div>


              {/* AUDIO */}
              <div
                style={{
                  marginTop: "24px",
                  padding: "20px",
                  background: darkMode ? "#0B1120" : "#F8FAFC",
                  borderRadius: "14px"
                }}
              >
                <strong>
                  ️ Ceritakan dengan suara
                </strong>

                <p
                  style={{
                    margin:
                      "8px 0 16px",
                    color: darkMode ? "#CBD5E1" : "#64748B",
                    fontSize: "13px"
                  }}
                >
                  Rekam langsung atau upload
                  file audio.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    alignItems: "center"
                  }}
                >
                  {!isRecording ? (
                    <button
                      onClick={
                        startRecording
                      }
                      style={{
                        border: "none",
                        background:
                          "#e11d48",
                        color: "#FFFFFF",
                        padding:
                          "11px 16px",
                        borderRadius:
                          "10px",
                        cursor:
                          "pointer"
                      }}
                    >
                       Mulai Rekam
                    </button>
                  ) : (
                    <button
                      onClick={
                        stopRecording
                      }
                      style={{
                        border: "none",
                        background:
                          "#0F172A",
                        color: "#FFFFFF",
                        padding:
                          "11px 16px",
                        borderRadius:
                          "10px",
                        cursor:
                          "pointer"
                      }}
                    >
                       Stop (
                      {recordingTime}s)
                    </button>
                  )}

                  <label
                    style={{
                      border:
                        "1px solid #CBD5E1",
                      background: darkMode ? "#111827" : "#FFFFFF",
                      padding:
                        "10px 14px",
                      borderRadius:
                        "10px",
                      cursor:
                        "pointer"
                    }}
                  >
                     Upload Audio

                    <input
                      type="file"
                      accept="audio/*"
                      onChange={
                        handleAudioUpload
                      }
                      style={{
                        display: "none"
                      }}
                    />
                  </label>

                  {audio && (
                    <button
                      onClick={
                        clearAudio
                      }
                      style={{
                        border:
                          "1px solid #fda4af",
                        background: darkMode ? "#111827" : "#FFFFFF",
                        color:
                          "#e11d48",
                        padding:
                          "10px 14px",
                        borderRadius:
                          "10px",
                        cursor:
                          "pointer"
                      }}
                    >
                      Hapus Audio
                    </button>
                  )}
                </div>

                {audio && (
                  <div
                    style={{
                      marginTop: "16px"
                    }}
                  >
                    {audioName && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: darkMode ? "#CBD5E1" : "#64748B"
                        }}
                      >
                        {audioName}
                      </p>
                    )}

                    <audio
                      controls
                      src={audio}
                      style={{
                        width: "100%"
                      }}
                    />
                  </div>
                )}
              </div>


              {/* BUTTON ANALISIS */}
              <div
                style={{
                  marginTop: "28px",
                  display: "flex",
                  justifyContent:
                    "flex-end"
                }}
              >
                <button
                  onClick={
                    analyzeBusiness
                  }
                  disabled={busy}
                  style={{
                    border: "none",
                    background:
                      busy
                        ? "#94A3B8"
                        : "#2563EB",
                    color: "#FFFFFF",
                    padding:
                      "14px 22px",
                    borderRadius:
                      "10px",
                    cursor:
                      busy
                        ? "not-allowed"
                        : "pointer",
                    fontWeight: "700",
                    fontSize: "14px"
                  }}
                >
                  {busy
                    ? "ZENAI sedang menganalisis..."
                    : " Analisis Usaha Saya"}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* =========================
            KONDISI USAHA / PULSE
        ========================== */}

        {tab === "pulse" && (
          <div
            style={{
              maxWidth: "1000px"
            }}
          >
            {pulseData && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
                <button type="button" onClick={exportPulsePdf} style={{ border: "1px solid #2563EB", background: darkMode ? "#172554" : "#EFF6FF", color: darkMode ? "#BFDBFE" : "#1D4ED8", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}> Ekspor PDF</button>
              </div>
            )}
            {!pulseData ? (
              <div
                style={{
                  background: darkMode ? "#111827" : "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "20px",
                  padding: "40px",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px"
                  }}
                >
                  
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px"
                  }}
                >
                  Lihat Kondisi Usaha Anda
                </h3>

                <p
                  style={{
                    color: darkMode ? "#CBD5E1" : "#64748B",
                    maxWidth: "550px",
                    margin: "12px auto 24px",
                    lineHeight: "1.6"
                  }}
                >
                  ZENAI akan membaca kondisi usaha Anda
                  dan menunjukkan hal yang berjalan baik,
                  hal yang perlu diperhatikan, serta
                  langkah prioritas.
                </p>

                <button
                  onClick={() => runPulse()}
                  disabled={busy}
                  style={{
                    border: "none",
                    background: busy
                      ? "#94A3B8"
                      : "#2563EB",
                    color: "#FFFFFF",
                    padding: "14px 22px",
                    borderRadius: "10px",
                    cursor: busy
                      ? "not-allowed"
                      : "pointer",
                    fontWeight: "700"
                  }}
                >
                  {busy
                    ? "ZENAI sedang membaca kondisi..."
                    : " Analisis Kondisi Usaha"}
                </button>
              </div>
            ) : (
              <>
                {/* RINGKASAN PULSE */}
                <div
                  style={{
                    background: darkMode ? "#111827" : "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "20px",
                    padding: "28px",
                    marginBottom: "20px"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "20px",
                      flexWrap: "wrap"
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        minWidth: "250px"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: darkMode ? "#CBD5E1" : "#64748B",
                          letterSpacing: "1px",
                          marginBottom: "8px"
                        }}
                      >
                        KONDISI SAAT INI
                      </div>

                      <h3
                        style={{
                          margin: 0,
                          fontSize: "24px"
                        }}
                      >
                        {renderStatus(
                          pulseData.status
                        )}
                      </h3>

                      <p
                        style={{
                          color: darkMode ? "#CBD5E1" : "#64748B",
                          lineHeight: "1.7",
                          marginTop: "14px",
                          marginBottom: 0
                        }}
                      >
                        {pulseData.summary ||
                          "Analisis kondisi usaha telah selesai."}
                      </p>
                    </div>

                  </div>
                </div>


                {/* HAL POSITIF */}
                {Array.isArray(
                  pulseData.positive
                ) &&
                  pulseData.positive.length > 0 && (
                    <div
                      style={{
                        background: darkMode ? "#111827" : "#FFFFFF",
                        border:
                          "1px solid #E2E8F0",
                        borderRadius:
                          "18px",
                        padding: "24px",
                        marginBottom: "20px"
                      }}
                    >
                      <h3
                        style={{
                          marginTop: 0
                        }}
                      >
                         Hal yang berjalan baik
                      </h3>

                      <div
                        style={{
                          display: "grid",
                          gap: "12px"
                        }}
                      >
                        {pulseData.positive.map(
                          (item, index) => (
                            <div
                              key={index}
                              style={{
                                background:
                                  darkMode ? "#172554" : "#EFF6FF",
                                border:
                                  darkMode ? "1px solid #1D4ED8" : "1px solid #BFDBFE",
                                padding:
                                  "16px",
                                borderRadius:
                                  "12px"
                              }}
                            >
                              <strong>
                                {item.title ||
                                  "Hal Positif"}
                              </strong>

                              <p
                                style={{
                                  margin:
                                    "8px 0 0",
                                  color:
                                    darkMode ? "#D1FAE5" : "#475569",
                                  lineHeight:
                                    "1.6"
                                }}
                              >
                                {item.description ||
                                  "-"}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}


                {/* HAL YANG PERLU DIPERHATIKAN */}
                {Array.isArray(
                  pulseData.attention
                ) &&
                  pulseData.attention.length > 0 && (
                    <div
                      style={{
                        background: darkMode ? "#111827" : "#FFFFFF",
                        border:
                          "1px solid #E2E8F0",
                        borderRadius:
                          "18px",
                        padding: "24px",
                        marginBottom: "20px"
                      }}
                    >
                      <h3
                        style={{
                          marginTop: 0
                        }}
                      >
                         Perlu Perhatian
                      </h3>

                      <div
                        style={{
                          display: "grid",
                          gap: "12px"
                        }}
                      >
                        {pulseData.attention.map(
                          (item, index) => (
                            <div
                              key={index}
                              style={{
                                border:
                                  "1px solid #FDE68A",
                                background:
                                  "#FFFFFFbeb",
                                padding:
                                  "16px",
                                borderRadius:
                                  "12px"
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    "flex",
                                  justifyContent:
                                    "space-between",
                                  gap: "12px",
                                  alignItems:
                                    "flex-start"
                                }}
                              >
                                <strong>
                                  {item.title ||
                                    "Perlu Perhatian"}
                                </strong>

                                {item.status && (
                                  <span
                                    style={{
                                      fontSize:
                                        "12px",
                                      whiteSpace:
                                        "nowrap"
                                    }}
                                  >
                                    {renderStatus(
                                      item.status
                                    )}
                                  </span>
                                )}
                              </div>

                              <p
                                style={{
                                  margin:
                                    "8px 0 0",
                                  color:
                                    darkMode ? "#d1fae5" : "#475569",
                                  lineHeight:
                                    "1.6"
                                }}
                              >
                                {item.description ||
                                  "-"}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}


                {/* PRIORITAS */}
                {Array.isArray(
                  pulseData.priority
                ) &&
                  pulseData.priority.length > 0 && (
                    <div
                      style={{
                        background: darkMode ? "#111827" : "#FFFFFF",
                        border:
                          "1px solid #E2E8F0",
                        borderRadius:
                          "18px",
                        padding: "24px",
                        marginBottom: "20px"
                      }}
                    >
                      <h3
                        style={{
                          marginTop: 0
                        }}
                      >
                         Prioritas Sekarang
                      </h3>

                      <div
                        style={{
                          display: "grid",
                          gap: "12px"
                        }}
                      >
                        {pulseData.priority.map(
                          (item, index) => (
                            <div
                              key={index}
                              style={{
                                border:
                                  "1px solid #E2E8F0",
                                padding:
                                  "18px",
                                borderRadius:
                                  "12px"
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    "flex",
                                  gap: "12px"
                                }}
                              >
                                <div
                                  style={{
                                    minWidth:
                                      "28px",
                                    height:
                                      "28px",
                                    borderRadius:
                                      "50%",
                                    background:
                                      "#EFF6FF",
                                    color: darkMode ? "#60A5FA" : "#2563EB",
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "center",
                                    fontWeight:
                                      "700"
                                  }}
                                >
                                  {index + 1}
                                </div>

                                <div>
                                  <strong>
                                    {item.title ||
                                      "Prioritas"}
                                  </strong>

                                  <p
                                    style={{
                                      margin:
                                        "8px 0",
                                      color: darkMode ? "#CBD5E1" : "#475569",
                                      lineHeight:
                                        "1.6"
                                    }}
                                  >
                                    {item.action ||
                                      "-"}
                                  </p>

                                  {item.impact && (
                                    <div
                                      style={{
                                        fontSize:
                                          "13px",
                                        color: darkMode ? "#94A3B8" : "#64748B"
                                      }}
                                    >
                                      Dampak:{" "}
                                      {item.impact}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}


                {/* NEXT STEP */}
{pulseData.nextStep && (
  <div
    style={{
      background: darkMode ? "#172033" : "#EFF6FF",
      border: `1px solid ${
        darkMode ? "#60A5FA" : "#BFDBFE"
      }`,
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "24px"
    }}
  >
    <strong
      style={{
        color: darkMode ? "#F8FAFC" : "#0F172A"
      }}
    >
       Langkah Berikutnya
    </strong>

    <p
      style={{
        margin: "8px 0 0",
        lineHeight: "1.6",
        color: darkMode ? "#CBD5E1" : "#334155"
      }}
    >
      {pulseData.nextStep}
    </p>
  </div>
)}
                {/* UPDATE USAHA */}
                <div
                  style={{
                    background: darkMode ? "#111827" : "#FFFFFF",
                    border:
                      "1px solid #E2E8F0",
                    borderRadius: "18px",
                    padding: "24px"
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0
                    }}
                  >
                     Ada perubahan pada usaha?
                  </h3>

                  <p
                    style={{
                      color: darkMode ? "#CBD5E1" : "#64748B",
                      fontSize: "14px",
                      lineHeight: "1.6"
                    }}
                  >
                    Ceritakan perubahan terbaru.
                    ZENAI akan memperbarui kondisi,
                    diagnosis, dan strategi Anda.
                  </p>

                  <textarea
  value={updateText}
  onChange={(event) =>
    setUpdateText(
      event.target.value
    )
  }
  placeholder="Contoh: Penjualan minggu ini turun, saya baru menaikkan harga, ada pesaing baru, atau saya menambah produk..."
  style={{
    width: "100%",
    minHeight: "110px",
    padding: "14px",
    border: "1px solid #CBD5E1",
    borderRadius: "10px",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: "1.6"
  }}
/>

                  <div
                    style={{
                      marginTop: "14px",
                      display: "flex",
                      justifyContent:
                        "flex-end"
                    }}
                  >
                    <button
  onClick={addBusinessUpdate}
  disabled={busy}
  style={{
    border: "none",
    background:
      busy
        ? "#94A3B8"
        : "#0F172A",
    color: "#FFFFFF",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor:
      busy
        ? "not-allowed"
        : "pointer",
    fontWeight: "700"
  }}
>
  {busy
    ? "Memperbarui..."
    : "Perbarui Analisis →"}
</button>
                  </div>


                  {businessUpdates.length > 0 && (
                    <div
                      style={{
                        marginTop: "24px",
                        paddingTop: "20px",
                        borderTop:
                          "1px solid #E2E8F0"
                      }}
                    >
                      <h4>
                        Riwayat Pembaruan
                      </h4>

                      <div
                        style={{
                          display: "grid",
                          gap: "10px"
                        }}
                      >
                        {businessUpdates.map(
                          (item) => (
                            <div
                              key={item.id}
                              style={{
                                background: darkMode ? "#0B1120" : "#F8FAFC",
                                padding:
                                  "14px",
                                borderRadius:
                                  "10px"
                              }}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  lineHeight:
                                    "1.6"
                                }}
                              >
                                {item.text}
                              </p>

                              <div
                                style={{
                                  marginTop:
                                    "8px",
                                  fontSize:
                                    "12px",
                                  color: darkMode ? "#CBD5E1" : "#94A3B8"
                                }}
                              >
                                {item.date}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        {/* =========================
            DIAGNOSIS USAHA
        ========================== */}

        {tab === "diagnosis" && (
          <div
            style={{
              maxWidth: "1000px"
            }}
          >
            {diagnosis && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
                <button type="button" onClick={exportDiagnosisPdf} style={{ border: "1px solid #2563EB", background: darkMode ? "#172554" : "#EFF6FF", color: darkMode ? "#BFDBFE" : "#1D4ED8", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}> Ekspor PDF</button>
              </div>
            )}
            {!diagnosis ? (
              <div
                style={{
                  background: darkMode ? "#111827" : "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "20px",
                  padding: "40px",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px"
                  }}
                >
                  
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px"
                  }}
                >
                  Diagnosis Usaha
                </h3>

                <p
                  style={{
                    color: darkMode ? "#CBD5E1" : "#64748B",
                    maxWidth: "550px",
                    margin: "12px auto 24px",
                    lineHeight: "1.6"
                  }}
                >
                  ZENAI akan menganalisis kekuatan,
                  masalah, peluang, dan risiko usaha Anda
                  untuk menentukan area yang paling perlu
                  diperbaiki.
                </p>

                <button
                  onClick={() => runDiagnosis()}
                  disabled={busy}
                  style={{
                    border: "none",
                    background: busy
                      ? "#94A3B8"
                      : "#2563EB",
                    color: "#FFFFFF",
                    padding: "14px 22px",
                    borderRadius: "10px",
                    cursor: busy
                      ? "not-allowed"
                      : "pointer",
                    fontWeight: "700"
                  }}
                >
                  {busy
                    ? "ZENAI sedang mendiagnosis..."
                    : " Mulai Diagnosis"}
                </button>
              </div>
            ) : (
              <>
                {/* RINGKASAN */}
                <div
                  style={{
                    background: darkMode ? "#111827" : "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "20px",
                    padding: "28px",
                    marginBottom: "20px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: darkMode ? "#CBD5E1" : "#64748B",
                      letterSpacing: "1px",
                      marginBottom: "8px"
                    }}
                  >
                    HASIL DIAGNOSIS
                  </div>

                  {diagnosis.status && (
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        marginBottom: "12px"
                      }}
                    >
                      {renderStatus(
                        diagnosis.status
                      )}
                    </div>
                  )}

                  <p
                    style={{
                      margin: 0,
                      color: darkMode ? "#E2E8F0" : "#475569",
                      lineHeight: "1.7",
                      fontSize: "15px"
                    }}
                  >
                    {diagnosis.summary ||
                      "Diagnosis usaha telah selesai."}
                  </p>

                  {diagnosis.mainProblem && (
                    <div
                      style={{
                        marginTop: "20px",
                        background: darkMode ? "#422006" : "#FFFBEB",
                        border:
                          darkMode ? "1px solid #9A3412" : "1px solid #FDE68A",
                        padding: "18px",
                        borderRadius: "12px"
                      }}
                    >
                      <strong>
                         Masalah Utama
                      </strong>

                      <p
                        style={{
                          margin:
                            "8px 0 0",
                          lineHeight: "1.6",
                          color: darkMode ? "#E2E8F0" : "#475569"
                        }}
                      >
                        {diagnosis.mainProblem}
                      </p>
                    </div>
                  )}
                </div>


                {/* KEKUATAN */}
                {Array.isArray(
                  diagnosis.strengths
                ) &&
                  diagnosis.strengths.length > 0 && (
                    <div
                      style={{
                        background: darkMode ? "#111827" : "#FFFFFF",
                        border:
                          "1px solid #E2E8F0",
                        borderRadius:
                          "18px",
                        padding: "24px",
                        marginBottom: "20px"
                      }}
                    >
                      <h3
                        style={{
                          marginTop: 0
                        }}
                      >
                         Kekuatan Usaha
                      </h3>

                      <div
                        style={{
                          display: "grid",
                          gap: "12px"
                        }}
                      >
                        {diagnosis.strengths.map(
                          (item, index) => (
                            <div
                              key={index}
                              style={{
                                background:
                                  "#EFF6FF",
                                border:
                                  "1px solid #BFDBFE",
                                padding:
                                  "16px",
                                borderRadius:
                                  "12px"
                              }}
                            >
                              <strong>
                                {item.title ||
                                  "Kekuatan"}
                              </strong>

                              <p
                                style={{
                                  margin:
                                    "8px 0 0",
                                  color: darkMode ? "#CBD5E1" : "#475569",
                                  lineHeight:
                                    "1.6"
                                }}
                              >
                                {item.description ||
                                  "-"}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}


                {/* MASALAH */}
                {Array.isArray(
                  diagnosis.problems
                ) &&
                  diagnosis.problems.length > 0 && (
                    <div
                      style={{
                        background: darkMode ? "#111827" : "#FFFFFF",
                        border:
                          "1px solid #E2E8F0",
                        borderRadius:
                          "18px",
                        padding: "24px",
                        marginBottom: "20px"
                      }}
                    >
                      <h3
                        style={{
                          marginTop: 0
                        }}
                      >
                        ️ Masalah yang Ditemukan
                      </h3>

                      <div
                        style={{
                          display: "grid",
                          gap: "14px"
                        }}
                      >
                        {diagnosis.problems.map(
                          (item, index) => (
                            <div
                              key={index}
                              style={{
                                border:
                                  darkMode ? "1px solid #881337" : "1px solid #fda4af",
                                background:
                                  darkMode ? "#3B1212" : "#FFF1F2",
                                padding:
                                  "18px",
                                borderRadius:
                                  "12px"
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    "flex",
                                  justifyContent:
                                    "space-between",
                                  gap: "12px",
                                  alignItems:
                                    "flex-start"
                                }}
                              >
                                <strong>
                                  {item.title ||
                                    "Masalah"}
                                </strong>

                                {item.priority && (
                                  <span
                                    style={{
                                      fontSize:
                                        "12px",
                                      padding:
                                        "4px 8px",
                                      borderRadius:
                                        "999px",
                                      background: darkMode ? "#111827" : "#FFFFFF",
                                      whiteSpace:
                                        "nowrap"
                                    }}
                                  >
                                    {renderStatus(
                                      item.priority
                                    )}
                                  </span>
                                )}
                              </div>

                              <p
                                style={{
                                  margin:
                                    "10px 0 0",
                                  color: darkMode ? "#CBD5E1" : "#475569",
                                  lineHeight:
                                    "1.6"
                                }}
                              >
                                {item.description ||
                                  "-"}
                              </p>

                              {item.impact && (
                                <div
                                  style={{
                                    marginTop:
                                      "10px",
                                    fontSize:
                                      "13px",
                                    color: darkMode ? "#94A3B8" : "#64748B"
                                  }}
                                >
                                  <strong>
                                    Dampak:
                                  </strong>{" "}
                                  {item.impact}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}


                {/* PELUANG */}
                {Array.isArray(
                  diagnosis.opportunities
                ) &&
                  diagnosis.opportunities.length > 0 && (
                    <div
                      style={{
                        background: darkMode ? "#111827" : "#FFFFFF",
                        border:
                          "1px solid #E2E8F0",
                        borderRadius:
                          "18px",
                        padding: "24px",
                        marginBottom: "20px"
                      }}
                    >
                      <h3
                        style={{
                          marginTop: 0
                        }}
                      >
                         Peluang yang Bisa Dimanfaatkan
                      </h3>

                      <div
                        style={{
                          display: "grid",
                          gap: "12px"
                        }}
                      >
                        {diagnosis.opportunities.map(
                          (item, index) => (
                            <div
                              key={index}
                              style={{
                                border:
                                  darkMode ? "1px solid #1D4ED8" : "1px solid #BFDBFE",
                                background:
                                  darkMode ? "#172033" : "#EFF6FF",
                                padding:
                                  "16px",
                                borderRadius:
                                  "12px"
                              }}
                            >
                              <strong>
                                {item.title ||
                                  "Peluang"}
                              </strong>

                              <p
                                style={{
                                  margin:
                                    "8px 0 0",
                                  color: darkMode ? "#CBD5E1" : "#475569",
                                  lineHeight:
                                    "1.6"
                                }}
                              >
                                {item.description ||
                                  "-"}
                              </p>

                              {item.potential && (
                                <div
                                  style={{
                                    marginTop:
                                      "10px",
                                    fontSize:
                                      "13px",
                                    color: darkMode ? "#60A5FA" : "#2563EB"
                                  }}
                                >
                                  Potensi:{" "}
                                  {item.potential}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}


                                {/* REKOMENDASI */}
                {Array.isArray(
                  diagnosis.recommendations
                ) &&
                  diagnosis.recommendations.length > 0 && (
                    <div
                      style={{
                        background: darkMode ? "#111827" : "#FFFFFF",
                        border:
                          "1px solid #E2E8F0",
                        borderRadius:
                          "18px",
                        padding: "24px",
                        marginBottom: "20px"
                      }}
                    >
                      <h3
                        style={{
                          marginTop: 0
                        }}
                      >
                         Rekomendasi Prioritas
                      </h3>

                      <div
                        style={{
                          display: "grid",
                          gap: "12px"
                        }}
                      >
                        {diagnosis.recommendations.map(
                          (item, index) => (
                            <div
                              key={index}
                              style={{
                                border:
                                  "1px solid #E2E8F0",
                                padding:
                                  "18px",
                                borderRadius:
                                  "12px"
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    "flex",
                                  gap: "14px"
                                }}
                              >
                                <div
                                  style={{
                                    minWidth:
                                      "30px",
                                    height:
                                      "30px",
                                    borderRadius:
                                      "50%",
                                    background:
                                      "#EFF6FF",
                                    color: darkMode ? "#60A5FA" : "#2563EB",
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "center",
                                    fontWeight:
                                      "700"
                                  }}
                                >
                                  {index + 1}
                                </div>

                                <div
                                  style={{
                                    flex: 1
                                  }}
                                >
                                  {item.priority && (
                                    <div
                                      style={{
                                        fontSize:
                                          "12px",
                                        color: darkMode ? "#94A3B8" : "#64748B",
                                        marginBottom:
                                          "6px"
                                      }}
                                    >
                                      Prioritas:{" "}
                                      {renderStatus(
                                        item.priority
                                      )}
                                    </div>
                                  )}

                                  <strong>
                                    {item.action ||
                                      "Tindakan"}
                                  </strong>

                                  {item.reason && (
                                    <p
                                      style={{
                                        margin:
                                          "8px 0 0",
                                        color: darkMode ? "#94A3B8" : "#64748B",
                                        lineHeight:
                                          "1.6"
                                      }}
                                    >
                                      {item.reason}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

{/* LANGKAH BERIKUTNYA */}
{diagnosis.nextStep && (
  <div
    style={{
      background: darkMode ? "#172033" : "#EFF6FF",
      border: `1px solid ${
        darkMode ? "#60A5FA" : "#BFDBFE"
      }`,
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "24px"
    }}
  >
    <strong
      style={{
        color: darkMode ? "#F8FAFC" : "#0F172A"
      }}
    >
       Langkah Berikutnya
    </strong>

    <p
      style={{
        margin: "8px 0 0",
        color: darkMode ? "#CBD5E1" : "#334155",
        lineHeight: "1.6"
      }}
    >
      {diagnosis.nextStep}
    </p>
  </div>
)}

                {/* ACTION */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap"
                  }}
                >
                  <button
                    onClick={() =>
                      runDiagnosis()
                    }
                    disabled={busy}
                    style={{
                      border:
                        "1px solid #CBD5E1",
                      background: darkMode ? "#111827" : "#FFFFFF",
                      color:
                        "#334155",
                      padding:
                        "12px 18px",
                      borderRadius:
                        "10px",
                      cursor:
                        busy
                          ? "not-allowed"
                          : "pointer",
                      fontWeight:
                        "600"
                    }}
                  >
                     Analisis Ulang
                  </button>

                  <button
                    onClick={() =>
                      runAutopilot()
                    }
                    disabled={busy}
                    style={{
                      border: "none",
                      background:
                        busy
                          ? "#94A3B8"
                          : "#2563EB",
                      color: "#FFFFFF",
                      padding:
                        "12px 18px",
                      borderRadius:
                        "10px",
                      cursor:
                        busy
                          ? "not-allowed"
                          : "pointer",
                      fontWeight:
                        "700"
                    }}
                  >
                     Buat Strategi & Tindakan
                  </button>
                </div>
              </>
            )}
          </div>
        )}
{/* =========================
    PERSPEKTIF BISNIS
========================= */}

{tab === "market" && (
  <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
    {marketData && (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
        <button type="button" onClick={exportMarketPdf} style={{ border: "1px solid #2563EB", background: darkMode ? "#172554" : "#EFF6FF", color: darkMode ? "#BFDBFE" : "#1D4ED8", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}> Ekspor PDF</button>
      </div>
    )}
    {!marketData && !marketLoading && !marketError && (
      <div
        style={{
          background: darkMode ? "#111827" : "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "22px",
          padding: "44px 36px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)"
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "12px" }}></div>
        <h3 style={{ margin: 0, fontSize: "26px" }}>Perspektif Bisnis</h3>
        <p
          style={{
            color: darkMode ? "#CBD5E1" : "#64748B",
            maxWidth: "650px",
            margin: "12px auto 24px",
            lineHeight: "1.7",
            fontSize: "15px"
          }}
        >
          ZenAI menggabungkan kondisi usaha Anda dengan informasi pasar terbaru untuk menghasilkan perspektif, peluang, risiko, dan implikasi strategis yang relevan.
        </p>
        <button
          onClick={runMarketInsight}
          style={{
            border: "none",
            background: darkMode ? "#2563EB" : "#2563EB",
            color: "#FFFFFF",
            padding: "14px 24px",
            borderRadius: "11px",
            cursor: "pointer",
            fontWeight: "700"
          }}
        >
           Analisis Perspektif Bisnis
        </button>
        <div
          style={{
            marginTop: "18px",
            fontSize: "12px",
            color: darkMode ? "#94A3B8" : "#94A3B8"
          }}
        >
          Informasi eksternal digunakan sebagai bahan analisis, bukan sekadar daftar hasil pencarian.
        </div>
      </div>
    )}

    {marketLoading && (
      <div
        style={{
          background: "#EFF6FF",
          border: "1px solid #BFDBFE",
          borderRadius: "22px",
          padding: "44px",
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: "42px", marginBottom: "14px" }}></div>
        <h3 style={{ margin: "0 0 8px" }}>ZenAI sedang menyusun perspektif bisnis...</h3>
        <p style={{ color: darkMode ? "#CBD5E1" : "#64748B", lineHeight: "1.6", margin: 0 }}>
          ZenAI mengumpulkan informasi eksternal, menyaring sumber, lalu menghubungkannya dengan konteks usaha Anda.
        </p>
      </div>
    )}

    {!marketLoading && marketError && (
      <div
        style={{
          background: "#FFF1F2",
          border: "1px solid #fda4af",
          borderRadius: "20px",
          padding: "28px"
        }}
      >
        <h3 style={{ marginTop: 0, color: "#9f1239" }}>Perspektif Bisnis belum dapat diperbarui</h3>
        <p style={{ color: "#9f1239", lineHeight: "1.6" }}>{marketError}</p>
        <button
          onClick={runMarketInsight}
          style={{ border: "none", background: "#9f1239", color: "#FFFFFF", padding: "11px 18px", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}
        >
          Coba Lagi
        </button>
      </div>
    )}

    {!marketLoading && !marketError && marketData && (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "18px"
          }}
        >
          <div>
            <div style={{ fontSize: "12px", fontWeight: "800", color: darkMode ? "#60A5FA" : "#2563EB", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "5px" }}>
              Business Intelligence
            </div>
            <h3 style={{ margin: 0, fontSize: "24px" }}> Perspektif Bisnis</h3>
            <p style={{ margin: "6px 0 0", color: darkMode ? "#CBD5E1" : "#64748B", lineHeight: "1.5" }}>
              Insight pasar yang sudah dianalisis dan dikaitkan dengan usaha Anda.
            </p>
          </div>
          <button
            onClick={runMarketInsight}
            disabled={marketLoading}
            style={{
              border: `1px solid ${darkMode ? "#34D399" : "#059669"}`,
              background: darkMode ? "#064E3B" : "#ECFDF5",
              color: darkMode ? "#D1FAE5" : "#065F46",
              padding: "10px 16px",
              borderRadius: "10px",
              cursor: marketLoading ? "not-allowed" : "pointer",
              fontWeight: "700",
              transition: "all 0.2s ease"
            }}
          >
             Perbarui Perspektif
          </button>
        </div>

        {marketData.analysis && (
  <div
    style={{
      display: "grid",
      gap: "14px",
      marginBottom: "22px"
    }}
  >
    {/* PERSPEKTIF UTAMA */}
    <div
      style={{
        background: darkMode ? "#111827" : "#FFFFFF",
        border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
        borderRadius: "18px",
        padding: "22px",
        boxShadow: darkMode
          ? "0 8px 24px rgba(0, 0, 0, 0.20)"
          : "0 8px 24px rgba(37, 99, 235, 0.06)"
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: "800",
          color: darkMode ? "#93C5FD" : "#2563EB",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "8px"
        }}
      >
         Perspektif Utama
      </div>

      <p
        style={{
          margin: 0,
          fontSize: "16px",
          lineHeight: "1.75",
          color: darkMode ? "#F8FAFC" : "#0F172A"
        }}
      >
        {marketData.analysis.businessPerspective ||
          marketData.analysis.summary ||
          "Belum tersedia."}
      </p>
    </div>

    {/* KONDISI PASAR + SINYAL PERMINTAAN */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "14px"
      }}
    >
      {/* KONDISI PASAR */}
      <div
        style={{
          background: darkMode ? "#172033" : "#FFFFFF",
          border: `1px solid ${
            darkMode ? "#334155" : "#E2E8F0"
          }`,
          borderRadius: "16px",
          padding: "20px"
        }}
      >
        <div
          style={{
            fontWeight: "800",
            marginBottom: "8px",
            color: darkMode ? "#F8FAFC" : "#0F172A"
          }}
        >
           Kondisi Pasar
        </div>

        <p
          style={{
            margin: 0,
            color: darkMode ? "#CBD5E1" : "#475569",
            lineHeight: "1.65"
          }}
        >
          {marketData.analysis.marketCondition ||
            "Belum tersedia."}
        </p>
      </div>

      {/* SINYAL PERMINTAAN */}
      <div
        style={{
          background: darkMode ? "#172033" : "#FFFFFF",
          border: `1px solid ${
            darkMode ? "#334155" : "#E2E8F0"
          }`,
          borderRadius: "16px",
          padding: "20px"
        }}
      >
        <div
          style={{
            fontWeight: "800",
            marginBottom: "8px",
            color: darkMode ? "#F8FAFC" : "#0F172A"
          }}
        >
           Sinyal Permintaan
        </div>

        <p
          style={{
            margin: "0 0 6px",
            fontWeight: "800",
            color: darkMode ? "#F8FAFC" : "#0F172A"
          }}
        >
          {marketData.analysis.demandSignal?.status ||
            "Tidak pasti"}
        </p>

        <p
          style={{
            margin: 0,
            color: darkMode ? "#CBD5E1" : "#475569",
            lineHeight: "1.65"
          }}
        >
          {marketData.analysis.demandSignal?.reason ||
            "Belum tersedia."}
        </p>
      </div>
    </div>

    {/* PELUANG + RISIKO */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "14px"
      }}
    >
      {/* PELUANG */}
      <div
        style={{
          background: darkMode ? "#052E1B" : "#F0FDF4",
          border: `1px solid ${
            darkMode ? "#22C55E" : "#BBF7D0"
          }`,
          borderRadius: "16px",
          padding: "20px"
        }}
      >
        <div
          style={{
            fontWeight: "800",
            color: darkMode ? "#86EFAC" : "#15803D",
            marginBottom: "10px"
          }}
        >
           Peluang
        </div>

        {Array.isArray(
          marketData.analysis.opportunities
        ) &&
        marketData.analysis.opportunities.length > 0 ? (
          <ul
            style={{
              margin: 0,
              paddingLeft: "20px",
              lineHeight: "1.7",
              color: darkMode ? "#DCFCE7" : "#166534"
            }}
          >
            {marketData.analysis.opportunities.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
        ) : (
          <p
            style={{
              margin: 0,
              color: darkMode ? "#CBD5E1" : "#475569"
            }}
          >
            Belum tersedia.
          </p>
        )}
      </div>

      {/* RISIKO */}
      <div
        style={{
          background: darkMode ? "#4C0519" : "#FFF1F2",
          border: `1px solid ${
            darkMode ? "#FB7185" : "#FECDD3"
          }`,
          borderRadius: "16px",
          padding: "20px"
        }}
      >
        <div
          style={{
            fontWeight: "800",
            color: darkMode ? "#FDA4AF" : "#BE123C",
            marginBottom: "10px"
          }}
        >
           Risiko Utama
        </div>

        {Array.isArray(
          marketData.analysis.risks
        ) &&
        marketData.analysis.risks.length > 0 ? (
          <ul
            style={{
              margin: 0,
              paddingLeft: "20px",
              lineHeight: "1.7",
              color: darkMode ? "#FFE4E6" : "#9F1239"
            }}
          >
            {marketData.analysis.risks.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
        ) : (
          <p
            style={{
              margin: 0,
              color: darkMode ? "#CBD5E1" : "#475569"
            }}
          >
            Belum tersedia.
          </p>
        )}
      </div>
    </div>

    {/* IMPLIKASI STRATEGIS */}
    <div
      style={{
        background: darkMode ? "#0B1120" : "#F8FAFC",
        border: `1px solid ${
          darkMode ? "#334155" : "#E2E8F0"
        }`,
        borderRadius: "18px",
        padding: "22px"
      }}
    >
      <div
        style={{
          fontWeight: "800",
          marginBottom: "8px",
          color: darkMode ? "#F8FAFC" : "#0F172A"
        }}
      >
         Implikasi Strategis
      </div>

      <p
        style={{
          margin: 0,
          color: darkMode ? "#CBD5E1" : "#334155",
          lineHeight: "1.75"
        }}
      >
        {marketData.analysis.strategicImplication ||
          "Belum tersedia."}
      </p>
    </div>
  </div>
)}
      </>
    )}
        </div>
      )}
        {/* =========================
            LAPORAN KEUANGAN
        ========================== */}

        {tab === "finance" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
              <button type="button" onClick={exportFinancePdf} style={{ border: "1px solid #2563EB", background: darkMode ? "#172554" : "#EFF6FF", color: darkMode ? "#BFDBFE" : "#1D4ED8", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}> Ekspor PDF</button>
            </div>
            <div
              style={{
                background: darkMode ? "#111827" : "#FFFFFF",
                border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
                borderRadius: "18px",
                padding: "20px",
                marginBottom: "18px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap"
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "20px"
                    }}
                  >
                    Laporan Keuangan
                  </h3>

                  <p
                    style={{
                      margin: "6px 0 0",
                      color: darkMode ? "#CBD5E1" : "#64748B"
                    }}
                  >
                    Catat transaksi dan lihat laporan keuangan berdasarkan periode.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(180px, 1fr))", gap: "10px", width: isMobile ? "100%" : "430px" }}>
                  {[
                    ["Bulan Asal", financePeriod, setFinancePeriod],
                    ["Bulan Pembanding", financeComparisonPeriod, setFinanceComparisonPeriod]
                  ].map(([label, value, setter]) => (
                    <label key={label} style={{ display: "block", fontSize: "11px", fontWeight: "800", color: darkMode ? "#CBD5E1" : "#475569" }}>
                      <span style={{ display: "block", marginBottom: "6px" }}>{label}</span>
                      <input
                        type="month"
                        value={value}
                        onChange={(event) => { setter(event.target.value); setDecisionResult(null); }}
                        style={{ width: "100%", border: `1px solid ${darkMode ? "#475569" : "#CBD5E1"}`, borderRadius: "10px", padding: "10px 12px", background: darkMode ? "#111827" : "#FFFFFF", color: darkMode ? "#F8FAFC" : "#0F172A", fontWeight: "700" }}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginTop: "18px"
                }}
              >
                {[
                  ["summary", "Ikhtisar Keuangan"],
                  ["transactions", "Transaksi"],
                  ["profit", "Laporan Laba Rugi"],
                  ["cashflow", "Laporan Arus Kas"],
                  ["balance", "Laporan Posisi Keuangan"]
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFinanceView(value)}
                    style={{
                      border:
                        financeView === value
                          ? "1px solid #2563EB"
                          : "1px solid #E2E8F0",
                      background:
                        financeView === value
                          ? "#EFF6FF"
                          : "#FFFFFF",
                      color:
                        financeView === value
                          ? "#2563EB"
                          : "#475569",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      fontWeight:
                        financeView === value
                          ? "700"
                          : "600"
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {financeMessage && (
              <div
                style={{
                  background: darkMode ? "#172033" : "#EFF6FF",
                  border: "1px solid #86efac",
                  color: darkMode ? "#93C5FD" : "#1D4ED8",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  marginBottom: "18px",
                  fontSize: "14px"
                }}
              >
                 {financeMessage}
              </div>
            )}

            {financeView === "summary" && (
              <>
                <div className="finance-cards">
                  {[
                    [
                      "Pendapatan",
                      financeCurrentTotals.income,
                      financeChange(
                        financeCurrentTotals.income,
                        financePreviousTotals.income
                      )
                    ],
                    [
                      "Laba Bersih",
                      financeCurrentTotals.netProfit,
                      financeChange(
                        financeCurrentTotals.netProfit,
                        financePreviousTotals.netProfit
                      )
                    ],
                    [
                      "Kas & Bank",
                      financeCurrentTotals.cashTotal,
                      financeChange(
                        financeCurrentTotals.cashTotal,
                        financePreviousTotals.cashTotal
                      )
                    ],
                    [
                      "Utang",
                      financeCurrentTotals.debt,
                      financeChange(
                        financeCurrentTotals.debt,
                        financePreviousTotals.debt
                      )
                    ]
                  ].map(([label, value, change]) => (
                    <article
                      key={label}
                      style={{
                        background: darkMode ? "#111827" : "#FFFFFF",
                        border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
                        borderRadius: "16px",
                        padding: "20px"
                      }}
                    >
                      <div
                        style={{
                          color: darkMode ? "#CBD5E1" : "#64748B",
                          fontSize: "13px",
                          fontWeight: "600"
                        }}
                      >
                        {label}
                      </div>

                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "800",
                          marginTop: "8px"
                        }}
                      >
                        {formatRupiah(value)}
                      </div>

                      <div
                        style={{
                          color:
                            change === null
                              ? "#64748B"
                              : change >= 0
                              ? "#2563EB"
                              : "#e11d48",
                          fontSize: "13px",
                          marginTop: "6px"
                        }}
                      >
                        {change === null
                          ? "Belum ada pembanding"
                          : `${change >= 0 ? "↑" : "↓"} ${Math.abs(change).toFixed(1)}% vs periode sebelumnya`}
                      </div>
                    </article>
                  ))}
                </div>

                <section
                  style={{
                    marginTop: "18px",
                    background: darkMode ? "#111827" : "#FFFFFF",
                    border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
                    borderRadius: "18px",
                    padding: "22px"
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "0.08em", color: "#2563EB" }}>
                    ZENAI FINANCIAL INTELLIGENCE
                  </div>
                  <h3 style={{ margin: "6px 0 8px" }}>
                    {financeInsight.headline}
                  </h3>
                  <p style={{ margin: 0, color: darkMode ? "#CBD5E1" : "#475569", lineHeight: "1.7" }}>
                    {financeInsight.summary}
                  </p>

                  {financeInsight.points.length > 0 && (
                    <div style={{ display: "grid", gap: "10px", marginTop: "16px" }}>
                      {financeInsight.points.map((point, index) => (
                        <div
                          key={index}
                          style={{
                            padding: "12px 14px",
                            borderRadius: "12px",
                            background: darkMode ? "#0B1120" : "#F8FAFC",
                            color: darkMode ? "#E2E8F0" : "#334155",
                            lineHeight: "1.6",
                            fontSize: "14px"
                          }}
                        >
                          <strong style={{ marginRight: "6px" }}>{index + 1}.</strong>{point}
                        </div>
                      ))}
                    </div>
                  )}

                  {financeInsight.linkedAnalysis.length > 0 && (
                    <div
                      style={{
                        marginTop: "18px",
                        padding: "16px",
                        borderRadius: "14px",
                        background: darkMode ? "#172033" : "#EFF6FF",
                        border: `1px solid ${darkMode ? "#1D4ED8" : "#BFDBFE"}`
                      }}
                    >
                      <strong> Terhubung dengan Analisis ZENAI</strong>
                      <div style={{ display: "grid", gap: "8px", marginTop: "10px" }}>
                        {financeInsight.linkedAnalysis.map((item, index) => (
                          <div key={index} style={{ fontSize: "14px", lineHeight: "1.6", color: darkMode ? "#DBEAFE" : "#1E3A8A" }}>
                            • {item}
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "10px", fontSize: "12px", color: darkMode ? "#94A3B8" : "#64748B" }}>
                        Penjelasan ini mengikuti state analisis terbaru. Saat Kondisi Usaha/Diagnosis diperbarui, bagian ini ikut berubah otomatis.
                      </div>
                    </div>
                  )}
                </section>
              </>
            )}

            {financeView === "transactions" && (
              <>
                <section
                  id="finance-transaction-form"
                  style={{
                    background: darkMode ? "#111827" : "#FFFFFF",
                    border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
                    borderRadius: "18px",
                    padding: "22px",
                    marginBottom: "18px"
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>
                    {editingFinanceId
                      ? "Edit Transaksi"
                      : "Tambah Transaksi"}
                  </h3>

                  <form
                    onSubmit={handleFinanceSubmit}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                      gap: "14px"
                    }}
                  >
                    <label style={{ fontSize: "14px", fontWeight: "600" }}>
                      Apa yang terjadi?
                      <input
                        type="text"
                        value={financeForm.description}
                        onChange={(event) =>
                          setFinanceForm((current) => ({
                            ...current,
                            description: event.target.value
                          }))
                        }
                        placeholder="Contoh: Penjualan produk"
                        style={{
                          display: "block",
                          width: "100%",
                          marginTop: "7px",
                          padding: "12px",
                          border: `1px solid ${darkMode ? "#475569" : "#CBD5E1"}`,
                          borderRadius: "10px"
                        }}
                      />
                    </label>

                    <label style={{ fontSize: "14px", fontWeight: "600" }}>
                      Nominal
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={financeForm.amount}
                        onChange={(event) =>
                          setFinanceForm((current) => ({
                            ...current,
                            amount: event.target.value
                          }))
                        }
                        placeholder="2500000"
                        style={{
                          display: "block",
                          width: "100%",
                          marginTop: "7px",
                          padding: "12px",
                          border: `1px solid ${darkMode ? "#475569" : "#CBD5E1"}`,
                          borderRadius: "10px"
                        }}
                      />
                    </label>

                    <label style={{ fontSize: "14px", fontWeight: "600" }}>
                      Jenis transaksi
                      <select
                        value={financeForm.type}
                        onChange={(event) =>
                          setFinanceForm((current) => ({
                            ...current,
                            type: event.target.value
                          }))
                        }
                        style={{
                          display: "block",
                          width: "100%",
                          marginTop: "7px",
                          padding: "12px",
                          border: `1px solid ${darkMode ? "#475569" : "#CBD5E1"}`,
                          borderRadius: "10px",
                          background: darkMode ? "#111827" : "#FFFFFF"
                        }}
                      >
                        {financeTypes.map((item) => (
                          <option
                            key={item.value}
                            value={item.value}
                          >
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label style={{ fontSize: "14px", fontWeight: "600" }}>
                      Uang melalui
                      <select
                        value={financeForm.account}
                        onChange={(event) =>
                          setFinanceForm((current) => ({
                            ...current,
                            account: event.target.value
                          }))
                        }
                        style={{
                          display: "block",
                          width: "100%",
                          marginTop: "7px",
                          padding: "12px",
                          border: `1px solid ${darkMode ? "#475569" : "#CBD5E1"}`,
                          borderRadius: "10px",
                          background: darkMode ? "#111827" : "#FFFFFF"
                        }}
                      >
                        {financeAccounts.map((item) => (
                          <option
                            key={item.value}
                            value={item.value}
                          >
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label style={{ fontSize: "14px", fontWeight: "600" }}>
                      Tanggal
                      <input
                        type="date"
                        value={financeForm.date}
                        onChange={(event) =>
                          setFinanceForm((current) => ({
                            ...current,
                            date: event.target.value
                          }))
                        }
                        style={{
                          display: "block",
                          width: "100%",
                          marginTop: "7px",
                          padding: "12px",
                          border: `1px solid ${darkMode ? "#475569" : "#CBD5E1"}`,
                          borderRadius: "10px"
                        }}
                      />
                    </label>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "end"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          width: "100%"
                        }}
                      >
                        <button
                          type="submit"
                          className="primary"
                          style={{
                            width: "100%"
                          }}
                        >
                          {editingFinanceId
                            ? "Simpan Perubahan"
                            : "+ Simpan Transaksi"}
                        </button>

                        {editingFinanceId && (
                          <button
                            type="button"
                            onClick={cancelFinanceEdit}
                            style={{
                              width: "auto",
                              padding: "10px 14px",
                              border: `1px solid ${darkMode ? "#475569" : "#CBD5E1"}`,
                              background: darkMode ? "#111827" : "#FFFFFF",
                              borderRadius: "10px",
                              cursor: "pointer",
                              whiteSpace: "nowrap"
                            }}
                          >
                            Batal
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </section>

                <section
                  style={{
                    background: darkMode ? "#111827" : "#FFFFFF",
                    border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
                    borderRadius: "18px",
                    padding: "22px"
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>
                    Transaksi {financePeriodLabel(financePeriod)}
                  </h3>
                  {financeCurrent.length === 0 && (
                    <div style={{ marginTop: "10px", padding: "10px 12px", borderRadius: "10px", background: darkMode ? "#172033" : "#F8FAFC", color: darkMode ? "#CBD5E1" : "#64748B", fontSize: "13px", lineHeight: 1.5 }}>
                      Tidak ada transaksi pada periode ini. Laporan tetap aman ditampilkan dan tidak menganggap bulan kosong sebagai penurunan kinerja.
                    </div>
                  )}

                  {financeCurrent.length === 0 ? (
                    <p>
                      Belum ada transaksi pada periode ini.
                    </p>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          minWidth: "620px"
                        }}
                      >
                        <thead>
                          <tr>
                            {[
                              "Tanggal",
                              "Keterangan",
                              "Jenis",
                              "Nominal",
                              ""
                            ].map((heading) => (
                              <th
                                key={heading}
                                style={{
                                  textAlign: "left",
                                  padding: "12px 8px",
                                  borderBottom:
                                    "1px solid #E2E8F0",
                                  color: darkMode ? "#CBD5E1" : "#64748B",
                                  fontSize: "13px"
                                }}
                              >
                                {heading}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {financeCurrent.map((item) => (
                            <tr key={item.id}>
                              <td
                                style={{
                                  padding: "12px 8px",
                                  borderBottom:
                                    "1px solid #F1F5F9"
                                }}
                              >
                                {new Date(
                                  `${item.date}T00:00:00`
                                ).toLocaleDateString("id-ID")}
                              </td>

                              <td
                                style={{
                                  padding: "12px 8px",
                                  borderBottom:
                                    "1px solid #F1F5F9"
                                }}
                              >
                                {item.description}
                              </td>

                              <td
                                style={{
                                  padding: "12px 8px",
                                  borderBottom:
                                    "1px solid #F1F5F9"
                                }}
                              >
                                {
                                  financeTypes.find(
                                    (type) =>
                                      type.value ===
                                      item.type
                                  )?.label ||
                                  item.type
                                }
                              </td>

                              <td
                                style={{
                                  padding: "12px 8px",
                                  borderBottom:
                                    "1px solid #F1F5F9",
                                  fontWeight: "700"
                                }}
                              >
                                {formatRupiah(item.amount)}
                              </td>

                              <td
                                style={{
                                  padding: "12px 8px",
                                  borderBottom:
                                    "1px solid #F1F5F9"
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "8px",
                                    alignItems: "center"
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      editFinanceTransaction(item)
                                    }
                                    style={{
                                      color: darkMode ? "#93C5FD" : "#1D4ED8",
                                      background: darkMode ? "#172033" : "#EFF6FF",
                                      padding: "8px 10px",
                                      borderRadius: "8px",
                                      fontSize: "12px"
                                    }}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteFinanceTransaction(
                                        item.id
                                      )
                                    }
                                    style={{
                                      color: "#e11d48",
                                      background: darkMode ? "#3B121D" : "#FFF1F2",
                                      padding: "8px 10px",
                                      borderRadius: "8px",
                                      fontSize: "12px"
                                    }}
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </>
            )}

            {financeView === "profit" && (
              <section
                style={{
                  background: darkMode ? "#111827" : "#FFFFFF",
                  border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
                  borderRadius: "18px",
                  padding: "22px"
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  Laporan Laba Rugi — {financePeriodLabel(financePeriod)}
                </h3>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "720px" }}>
                    <thead>
                      <tr>
                        {["Komponen", "Periode Ini", "Periode Sebelumnya", "Perubahan", "Arah"].map((heading) => (
                          <th key={heading} style={{ textAlign: heading === "Komponen" ? "left" : "right", padding: "10px 8px", borderBottom: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`, color: darkMode ? "#CBD5E1" : "#64748B", fontSize: "12px" }}>
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Pendapatan", financeCurrentTotals.income, financePreviousTotals.income, false],
                        ["HPP", financeCurrentTotals.hpp, financePreviousTotals.hpp, true],
                        ["Laba Kotor", financeCurrentTotals.grossProfit, financePreviousTotals.grossProfit, false],
                        ["Beban Operasional", financeCurrentTotals.expense, financePreviousTotals.expense, true],
                        ["Laba Bersih", financeCurrentTotals.netProfit, financePreviousTotals.netProfit, false]
                      ].map(([label, value, previousValue, inverse]) => {
                        const { delta, percentage } = financeDelta(value, previousValue);
                        const better = inverse ? delta < 0 : delta > 0;
                        return (
                          <tr key={label}>
                            <td style={{ padding: "13px 8px", borderBottom: `1px solid ${darkMode ? "#334155" : "#F1F5F9"}`, fontWeight: label === "Laba Bersih" ? "800" : "500" }}>{label}</td>
                            <td style={{ padding: "13px 8px", textAlign: "right", borderBottom: `1px solid ${darkMode ? "#334155" : "#F1F5F9"}`, fontWeight: label === "Laba Bersih" ? "800" : "600" }}>{formatRupiah(value)}</td>
                            <td style={{ padding: "13px 8px", textAlign: "right", borderBottom: `1px solid ${darkMode ? "#334155" : "#F1F5F9"}`, color: darkMode ? "#94A3B8" : "#64748B" }}>{formatRupiah(previousValue)}</td>
                            <td style={{ padding: "13px 8px", textAlign: "right", borderBottom: `1px solid ${darkMode ? "#334155" : "#F1F5F9"}` }}>{delta === 0 ? "—" : `${delta >= 0 ? "+" : "-"}${formatRupiah(Math.abs(delta))}`}</td>
                            <td style={{ padding: "13px 8px", textAlign: "right", borderBottom: `1px solid ${darkMode ? "#334155" : "#F1F5F9"}`, color: delta === 0 ? "#64748B" : better ? "#2563EB" : "#e11d48", fontWeight: "700" }}>
                              {Number(previousValue) === 0 ? "—" : `${delta >= 0 ? "↑" : "↓"} ${Math.abs(percentage || 0).toFixed(1)}%`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: "18px", padding: "16px", borderRadius: "14px", background: darkMode ? "#0B1120" : "#F8FAFC" }}>
                  <strong> Cara membaca periode ini</strong>
                  <p style={{ margin: "8px 0 0", color: darkMode ? "#CBD5E1" : "#475569", lineHeight: "1.7" }}>
                    {financeChangeLabel(financeCurrentTotals.netProfit, financePreviousTotals.netProfit)}
                    {" "}Laba bersih periode ini sebesar {formatRupiah(financeCurrentTotals.netProfit)} setelah memperhitungkan HPP {formatRupiah(financeCurrentTotals.hpp)} dan beban operasional {formatRupiah(financeCurrentTotals.expense)}.
                  </p>
                </div>
              </section>
            )}

            {financeView === "cashflow" && (
              <section
                style={{
                  background: darkMode ? "#111827" : "#FFFFFF",
                  border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
                  borderRadius: "18px",
                  padding: "22px"
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  Laporan Arus Kas — {financePeriodLabel(financePeriod)}
                </h3>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "720px" }}>
                    <thead>
                      <tr>
                        {["Komponen", "Periode Ini", "Periode Sebelumnya", "Perubahan", "Arah"].map((heading) => (
                          <th key={heading} style={{ textAlign: heading === "Komponen" ? "left" : "right", padding: "10px 8px", borderBottom: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`, color: darkMode ? "#CBD5E1" : "#64748B", fontSize: "12px" }}>{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Kas Masuk", financeCurrentTotals.cashIn, financePreviousTotals.cashIn, false],
                        ["Kas Keluar", financeCurrentTotals.cashOut, financePreviousTotals.cashOut, true],
                        ["Perubahan Kas", financeCurrentTotals.cashChange, financePreviousTotals.cashChange, false],
                        ["Kas & Bank", financeCurrentTotals.cashTotal, financePreviousTotals.cashTotal, false]
                      ].map(([label, value, previousValue, inverse]) => {
                        const { delta, percentage } = financeDelta(value, previousValue);
                        const better = inverse ? delta < 0 : delta > 0;
                        return (
                          <tr key={label}>
                            <td style={{ padding: "13px 8px", borderBottom: `1px solid ${darkMode ? "#334155" : "#F1F5F9"}`, fontWeight: label === "Kas & Bank" ? "800" : "500" }}>{label}</td>
                            <td style={{ padding: "13px 8px", textAlign: "right", borderBottom: `1px solid ${darkMode ? "#334155" : "#F1F5F9"}`, fontWeight: label === "Kas & Bank" ? "800" : "600" }}>{formatRupiah(value)}</td>
                            <td style={{ padding: "13px 8px", textAlign: "right", borderBottom: `1px solid ${darkMode ? "#334155" : "#F1F5F9"}`, color: darkMode ? "#94A3B8" : "#64748B" }}>{formatRupiah(previousValue)}</td>
                            <td style={{ padding: "13px 8px", textAlign: "right", borderBottom: `1px solid ${darkMode ? "#334155" : "#F1F5F9"}` }}>{delta === 0 ? "—" : `${delta >= 0 ? "+" : "-"}${formatRupiah(Math.abs(delta))}`}</td>
                            <td style={{ padding: "13px 8px", textAlign: "right", borderBottom: `1px solid ${darkMode ? "#334155" : "#F1F5F9"}`, color: delta === 0 ? "#64748B" : better ? "#2563EB" : "#e11d48", fontWeight: "700" }}>{Number(previousValue) === 0 ? "—" : `${delta >= 0 ? "↑" : "↓"} ${Math.abs(percentage || 0).toFixed(1)}%`}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: "18px", padding: "16px", borderRadius: "14px", background: darkMode ? "#0B1120" : "#F8FAFC" }}>
                  <strong> Analisis arus kas</strong>
                  <p style={{ margin: "8px 0 0", color: darkMode ? "#CBD5E1" : "#475569", lineHeight: "1.7" }}>
                    Kas masuk {financeCurrentTotals.cashIn >= financePreviousTotals.cashIn ? "lebih tinggi" : "lebih rendah"} dibanding periode sebelumnya, sementara kas keluar {financeCurrentTotals.cashOut >= financePreviousTotals.cashOut ? "lebih tinggi" : "lebih rendah"}. Saldo kas dan bank saat ini {formatRupiah(financeCurrentTotals.cashTotal)}.
                  </p>
                </div>
              </section>
            )}

            {financeView === "balance" && (
              <section
                style={{
                  background: darkMode ? "#111827" : "#FFFFFF",
                  border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
                  borderRadius: "18px",
                  padding: "22px"
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  Laporan Posisi Keuangan — {financePeriodLabel(financePeriod)}
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, minmax(0, 1fr))",
                    gap: "24px"
                  }}
                >
                  <div>
                    <h4>Yang Dimiliki</h4>
                    {[
                      ["Kas & Bank", financeCurrentTotals.cashTotal],
                      ["Piutang", financeCurrentTotals.receivable],
                      ["Persediaan", financeCurrentTotals.inventory]
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "12px 0",
                          borderBottom:
                            "1px solid #F1F5F9"
                        }}
                      >
                        <span>{label}</span>
                        <strong>{formatRupiah(value)}</strong>
                      </div>
                    ))}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "14px 0",
                        fontWeight: "800"
                      }}
                    >
                      <span>Total Aset</span>
                      <span>
                        {formatRupiah(
                          financeCurrentTotals.totalAssets
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4>Utang & Modal</h4>

                    {[
                      ["Liabilitas", financeCurrentTotals.debt],
                      [
                        "Modal + Laba",
                        financeCurrentTotals.totalEquity
                      ]
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "12px 0",
                          borderBottom:
                            "1px solid #F1F5F9"
                        }}
                      >
                        <span>{label}</span>
                        <strong>{formatRupiah(value)}</strong>
                      </div>
                    ))}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "14px 0",
                        fontWeight: "800"
                      }}
                    >
                      <span>Total</span>
                      <span>
                        {formatRupiah(
                          financeCurrentTotals.debt +
                          financeCurrentTotals.totalEquity
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    padding: "16px",
                    borderRadius: "14px",
                    background: darkMode ? "#0B1120" : "#F8FAFC"
                  }}
                >
                  <strong> Perubahan posisi keuangan</strong>
                  <div style={{ display: "grid", gap: "8px", marginTop: "10px" }}>
                    {[
                      ["Total Aset", financeCurrentTotals.totalAssets, financePreviousTotals.totalAssets],
                      ["Liabilitas", financeCurrentTotals.debt, financePreviousTotals.debt],
                      ["Modal + Laba", financeCurrentTotals.totalEquity, financePreviousTotals.totalEquity]
                    ].map(([label, value, previousValue]) => {
                      const { delta, percentage } = financeDelta(value, previousValue);
                      return (
                        <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "14px" }}>
                          <span>{label}</span>
                          <span style={{ fontWeight: "700" }}>
                            {formatRupiah(value)}{" "}
                            <span style={{ color: delta > 0 ? "#2563EB" : delta < 0 ? "#e11d48" : "#64748B" }}>
                              {delta === 0 ? "(stabil)" : `(${delta > 0 ? "↑" : "↓"} ${Math.abs(delta).toFixed(1)}%)`}
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    padding: "14px",
                    borderRadius: "12px",
                    background:
                      Math.abs(
                        financeCurrentTotals.totalAssets -
                        (
                          financeCurrentTotals.debt +
                          financeCurrentTotals.totalEquity
                        )
                      ) < 1
                        ? "#EFF6FF"
                        : "#FFFFFFbeb",
                    color:
                      Math.abs(
                        financeCurrentTotals.totalAssets -
                        (
                          financeCurrentTotals.debt +
                          financeCurrentTotals.totalEquity
                        )
                      ) < 1
                        ? "#1D4ED8"
                        : "#9a3412",
                    fontSize: "13px"
                  }}
                >
                  {Math.abs(
                    financeCurrentTotals.totalAssets -
                    (
                      financeCurrentTotals.debt +
                      financeCurrentTotals.totalEquity
                    )
                  ) < 1
                    ? " Posisi keuangan seimbang."
                    : "️ Data belum seimbang. Periksa transaksi modal, utang, atau aset."}
                </div>
              </section>
            )}
          </div>
        )}

        {tab === "advancedAnalysis" && (() => {
          const inputStyle = {
            width: "100%", marginTop: "6px", minHeight: "44px", boxSizing: "border-box",
            border: `1px solid ${darkMode ? "#475569" : "#CBD5E1"}`, borderRadius: "10px",
            padding: "0 11px", background: darkMode ? "#0F172A" : "#FFFFFF",
            color: darkMode ? "#F8FAFC" : "#0F172A", fontWeight: "700"
          };
          const field = (key, label, suffix = "", placeholder = "") => (
            <label key={key} style={{ display: "block", fontSize: "12px", fontWeight: "700" }}>
              {label}{suffix ? ` (${suffix})` : ""}
              <input
                type="number"
                step="0.1"
                value={decisionScenario[key] ?? ""}
                onChange={(event) => { setDecisionScenario((prev) => ({ ...prev, [key]: event.target.value })); setDecisionResult(null); }}
                placeholder={placeholder}
                style={inputStyle}
              />
            </label>
          );

          const typeInfo = {
            pricing: { title: "Perubahan harga", description: "Uji apakah perubahan harga tetap layak ketika volume penjualan ikut berubah." },
            sales: { title: "Perubahan penjualan", description: "Uji dampak kenaikan atau penurunan volume penjualan terhadap laba dan kas." },
            cost: { title: "Perubahan biaya", description: "Uji seberapa besar perubahan HPP dan beban dapat ditanggung oleh struktur usaha saat ini." },
            investment: { title: "Pengeluaran atau investasi", description: "Uji apakah uang yang dikeluarkan dapat ditutup oleh pendapatan tambahan yang diharapkan." },
            custom: { title: "Skenario khusus", description: "Uji perubahan pendapatan, HPP, dan beban yang Anda tentukan sendiri." }
          }[decisionType] || { title: "Skenario khusus", description: "Tentukan perubahan yang ingin diuji." };

          const renderAssumptionFields = () => {
            if (decisionType === "pricing") return (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "13px" }}>
                {field("currentPrice", "Harga saat ini", "Rp", "Contoh: 25000")}
                {field("plannedPrice", "Harga rencana", "Rp", "Contoh: 28000")}
                {field("volumeChange", "Perubahan volume penjualan", "%", "Contoh: -10")}
                {field("hppChange", "Perubahan HPP per unit", "%", "Contoh: 0")}
                {field("expenseChange", "Perubahan beban operasional", "%", "Contoh: 0")}
              </div>
            );
            if (decisionType === "sales") return (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "13px" }}>
                {field("volumeChange", "Perubahan volume penjualan", "%", "Contoh: 15")}
                {field("hppChange", "Perubahan HPP", "%", "Contoh: 5")}
                {field("expenseChange", "Perubahan beban", "%", "Contoh: 3")}
              </div>
            );
            if (decisionType === "cost") return (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "13px" }}>
                {field("revenueChange", "Perubahan pendapatan", "%", "Contoh: 0")}
                {field("hppChange", "Perubahan HPP", "%", "Contoh: 8")}
                {field("expenseChange", "Perubahan beban", "%", "Contoh: 5")}
              </div>
            );
            if (decisionType === "investment") return (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "13px" }}>
                {field("investmentAmount", "Nilai investasi / pengeluaran", "Rp", "Contoh: 5000000")}
                {field("expectedRevenue", "Tambahan pendapatan yang diharapkan", "Rp", "Contoh: 8000000")}
                {field("incrementalHppRate", "HPP atas tambahan penjualan", "%", "Contoh: 40")}
                {field("incrementalExpense", "Beban tambahan", "Rp", "Contoh: 500000")}
              </div>
            );
            return (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "13px" }}>
                {field("revenueChange", "Perubahan pendapatan", "%", "Contoh: -15")}
                {field("hppChange", "Perubahan HPP", "%", "Contoh: 5")}
                {field("expenseChange", "Perubahan beban", "%", "Contoh: 3")}
              </div>
            );
          };

          return (
            <div style={{ maxWidth: "1040px", margin: "0 auto", width: "100%" }}>
              <section style={{ background: darkMode ? "#0F172A" : "#FFFFFF", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`, borderRadius: "22px", padding: isMobile ? "18px" : "30px", boxShadow: "0 12px 35px rgba(15,23,42,0.06)" }}>
                <div style={{ maxWidth: "780px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "1.4px", color: darkMode ? "#93C5FD" : "#2563EB", marginBottom: "8px" }}>ANALISIS LANJUTAN</div>
                  <h2 style={{ margin: 0, fontSize: isMobile ? "26px" : "36px", lineHeight: 1.12 }}>Uji keputusan sebelum diterapkan.</h2>
                  <p style={{ margin: "11px 0 0", color: darkMode ? "#CBD5E1" : "#64748B", lineHeight: 1.65 }}>
                    Pilih satu keputusan nyata yang sedang dipertimbangkan. ZENAI menghitung konsekuensinya menggunakan data keuangan periode dasar, bukan sekadar memberikan rekomendasi umum.
                  </p>
                </div>

                <div style={{ marginTop: "24px", padding: "18px", borderRadius: "18px", background: darkMode ? "#111827" : "#F8FAFC", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}` }}>
                  <div style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "0.5px", marginBottom: "12px" }}>DATA YANG MENJADI DASAR</div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "800" }}>Periode Dasar<input type="month" value={financePeriod} onChange={(event) => { setFinancePeriod(event.target.value); setDecisionResult(null); }} style={inputStyle} /></label>
                    <label style={{ fontSize: "12px", fontWeight: "800" }}>Periode Pembanding<input type="month" value={financeComparisonPeriod} onChange={(event) => { setFinanceComparisonPeriod(event.target.value); setDecisionResult(null); }} style={inputStyle} /></label>
                  </div>
                  <div style={{ marginTop: "10px", fontSize: "11px", color: darkMode ? "#94A3B8" : "#64748B", lineHeight: 1.6 }}>
                    Periode dasar menjadi titik awal simulasi. Periode pembanding hanya digunakan untuk membaca konteks historis dan tidak otomatis dianggap sebagai bulan sebelumnya.
                  </div>
                </div>

                <div style={{ marginTop: "20px", padding: "18px", borderRadius: "18px", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}` }}>
                  <div style={{ fontSize: "12px", fontWeight: "800", marginBottom: "10px" }}>KEPUTUSAN YANG DIUJI</div>
                  <textarea value={decisionText} onChange={(event) => { setDecisionText(event.target.value); setDecisionResult(null); }} placeholder="Contoh: Saya ingin menaikkan harga produk dari Rp25.000 menjadi Rp28.000 karena biaya bahan meningkat." rows={3} style={{ width: "100%", resize: "vertical", minHeight: "82px", boxSizing: "border-box", border: `1px solid ${darkMode ? "#475569" : "#CBD5E1"}`, borderRadius: "12px", padding: "12px 13px", background: darkMode ? "#0F172A" : "#FFFFFF", color: darkMode ? "#F8FAFC" : "#0F172A", lineHeight: 1.5 }} />

                  <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px", alignItems: "end" }}>
                    <label style={{ fontSize: "12px", fontWeight: "800" }}>Jenis Keputusan
                      <select value={decisionType} onChange={(event) => { setDecisionType(event.target.value); setDecisionResult(null); }} style={inputStyle}>
                        <option value="pricing">Perubahan harga</option>
                        <option value="sales">Perubahan penjualan</option>
                        <option value="cost">Perubahan biaya / HPP</option>
                        <option value="investment">Pengeluaran atau investasi</option>
                        <option value="custom">Skenario khusus</option>
                      </select>
                    </label>
                    <div style={{ padding: "11px 13px", borderRadius: "10px", background: darkMode ? "#172033" : "#F8FAFC", color: darkMode ? "#CBD5E1" : "#475569", fontSize: "11px", lineHeight: 1.55 }}>
                      <strong>{typeInfo.title}</strong><br />{typeInfo.description}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "16px", padding: "18px", borderRadius: "18px", background: darkMode ? "#111827" : "#FAFAFA", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}` }}>
                  <div style={{ fontSize: "12px", fontWeight: "800", marginBottom: "4px" }}>ASUMSI KEPUTUSAN</div>
                  <div style={{ fontSize: "11px", color: darkMode ? "#94A3B8" : "#64748B", marginBottom: "14px" }}>Isi asumsi yang benar-benar Anda perkirakan. Tidak ada skenario angka yang dipilih otomatis oleh ZENAI.</div>
                  {renderAssumptionFields()}
                </div>

                {financeMessage && <div style={{ marginTop: "14px", padding: "12px 14px", borderRadius: "11px", border: "1px solid #FCA5A5", background: darkMode ? "#3B121D" : "#FEF2F2", color: darkMode ? "#FECACA" : "#991B1B", fontSize: "13px" }}>{financeMessage}</div>}

                <div style={{ marginTop: "18px", display: "flex", justifyContent: "flex-end", gap: "10px", flexWrap: "wrap" }}>
                  <button type="button" onClick={() => { setDecisionResult(null); setFinanceMessage(""); setDecisionScenario({ currentPrice: "", plannedPrice: "", volumeChange: "", hppChange: "", expenseChange: "", investmentAmount: "", expectedRevenue: "", incrementalHppRate: "", incrementalExpense: "", revenueChange: "", cashImpact: "" }); }} style={{ border: `1px solid ${darkMode ? "#475569" : "#CBD5E1"}`, background: "transparent", color: darkMode ? "#F8FAFC" : "#0F172A", padding: "11px 16px", borderRadius: "11px", fontWeight: "800", cursor: "pointer" }}>Atur Ulang</button>
                  <button type="button" onClick={() => runDecisionSimulation()} disabled={decisionRunning || !decisionText.trim()} style={{ border: "none", background: "#0F172A", color: "#FFFFFF", padding: "11px 18px", borderRadius: "11px", cursor: decisionRunning ? "wait" : "pointer", fontWeight: "800", opacity: decisionRunning || !decisionText.trim() ? 0.55 : 1 }}>
                    {decisionRunning ? "Menghitung dampak..." : "Hitung Dampak"}
                  </button>
                </div>

                {decisionResult && (
                  <div style={{ marginTop: "26px", display: "grid", gap: "14px" }}>
                    <section style={{ padding: "21px", borderRadius: "18px", background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}` }}>
                      <div style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "1px", color: darkMode ? "#93C5FD" : "#2563EB" }}>KEPUTUSAN YANG DIUJI</div>
                      <h3 style={{ margin: "8px 0 7px", fontSize: "21px" }}>{decisionResult.decision}</h3>
                      <div style={{ fontSize: "12px", color: darkMode ? "#94A3B8" : "#64748B" }}>{decisionResult.basePeriod} dibandingkan dengan {decisionResult.comparisonPeriod}</div>
                    </section>

                    <section style={{ padding: "18px", borderRadius: "18px", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}` }}>
                      <div style={{ fontSize: "12px", fontWeight: "800", marginBottom: "12px" }}>ASUMSI YANG DIUJI</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {Object.entries(decisionResult.assumptions).filter(([, value]) => value !== null && value !== 0).map(([key, value]) => {
                          const labels = { currentPrice: "Harga saat ini", plannedPrice: "Harga rencana", volumeChange: "Perubahan volume", hppChange: "Perubahan HPP", expenseChange: "Perubahan beban", investmentAmount: "Investasi/pengeluaran", expectedRevenue: "Pendapatan tambahan", incrementalHppRate: "HPP tambahan", incrementalExpense: "Beban tambahan", revenueChange: "Perubahan pendapatan", cashImpact: "Penyesuaian kas" };
                          const isPercent = ["volumeChange", "hppChange", "expenseChange", "incrementalHppRate", "revenueChange"].includes(key);
                          return <div key={key} style={{ padding: "8px 10px", borderRadius: "9px", background: darkMode ? "#172033" : "#F8FAFC", fontSize: "11px" }}><strong>{labels[key]}</strong>: {isPercent ? `${Number(value).toFixed(1)}%` : formatRupiah(value)}</div>;
                        })}
                      </div>
                      <p style={{ margin: "12px 0 0", color: darkMode ? "#CBD5E1" : "#475569", fontSize: "12px", lineHeight: 1.65 }}>{decisionResult.modelExplanation}</p>
                    </section>

                    <section style={{ padding: "18px", borderRadius: "18px", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}` }}>
                      <div style={{ fontSize: "12px", fontWeight: "800", marginBottom: "12px" }}>DAMPAK TERHADAP KEUANGAN</div>
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "10px" }}>
                        {[ ["Pendapatan", decisionResult.baseline.income, decisionResult.simulated.income], ["HPP", decisionResult.baseline.hpp, decisionResult.simulated.hpp], ["Laba Bersih", decisionResult.baseline.profit, decisionResult.simulated.profit], ["Kas", decisionResult.baseline.cash, decisionResult.simulated.cash] ].map(([label, before, after]) => (
                          <div key={label} style={{ padding: "13px", borderRadius: "12px", background: darkMode ? "#111827" : "#F8FAFC" }}>
                            <div style={{ fontSize: "11px", color: darkMode ? "#94A3B8" : "#64748B" }}>{label}</div>
                            <div style={{ marginTop: "5px", fontWeight: "800", fontSize: "15px" }}>{formatRupiah(after)}</div>
                            <div style={{ marginTop: "4px", fontSize: "10px", color: darkMode ? "#94A3B8" : "#64748B" }}>sebelum {formatRupiah(before)}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "13px", padding: "12px", borderRadius: "11px", background: darkMode ? "#172033" : "#F8FAFC", fontSize: "12px", lineHeight: 1.8 }}>
                        Perubahan laba: <strong>{decisionResult.deltas.profit >= 0 ? "+" : "-"}{formatRupiah(Math.abs(decisionResult.deltas.profit))}</strong> · Perubahan kas: <strong>{decisionResult.deltas.cash >= 0 ? "+" : "-"}{formatRupiah(Math.abs(decisionResult.deltas.cash))}</strong> · Margin: <strong>{decisionResult.baseline.margin.toFixed(1)}% → {decisionResult.simulated.margin.toFixed(1)}%</strong>
                      </div>
                    </section>

                    <section style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "14px" }}>
                      <div style={{ padding: "18px", borderRadius: "18px", background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}` }}>
                        <div style={{ fontSize: "11px", fontWeight: "800", color: darkMode ? "#93C5FD" : "#2563EB", letterSpacing: "0.7px" }}>PENILAIAN</div>
                        <div style={{ marginTop: "7px", fontSize: "25px", fontWeight: "850" }}>{decisionResult.assessment}</div>
                        <p style={{ margin: "10px 0 0", color: darkMode ? "#CBD5E1" : "#475569", lineHeight: 1.7, fontSize: "13px" }}>{decisionResult.interpretation}</p>
                      </div>
                      <div style={{ padding: "18px", borderRadius: "18px", background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}` }}>
                        <div style={{ fontSize: "11px", fontWeight: "800", color: darkMode ? "#93C5FD" : "#2563EB", letterSpacing: "0.7px" }}>BATAS KEPUTUSAN</div>
                        {decisionResult.boundary.value !== null ? <>
                          <div style={{ marginTop: "8px", fontSize: "18px", fontWeight: "800" }}>{decisionResult.boundary.label}: {decisionResult.boundary.unit === "Rp" ? formatRupiah(decisionResult.boundary.value) : `${decisionResult.boundary.value.toFixed(1)}%`}</div>
                          <p style={{ margin: "9px 0 0", color: darkMode ? "#CBD5E1" : "#475569", lineHeight: 1.65, fontSize: "12px" }}>{decisionResult.boundary.explanation}</p>
                        </> : <p style={{ margin: "9px 0 0", color: darkMode ? "#CBD5E1" : "#475569", lineHeight: 1.65, fontSize: "12px" }}>Batas keputusan belum dapat dihitung dari struktur data yang tersedia.</p>}
                      </div>
                    </section>

                    <section style={{ padding: "18px", borderRadius: "18px", background: darkMode ? "#0F172A" : "#F8FAFC", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}` }}>
                      <div style={{ fontSize: "11px", fontWeight: "800", marginBottom: "7px" }}>KONTEKS PERIODE</div>
                      <div style={{ fontSize: "12px", color: darkMode ? "#CBD5E1" : "#475569", lineHeight: 1.65 }}>{decisionResult.comparisonText}</div>
                    </section>

                    {decisionResult.linked.length > 0 && <details style={{ padding: "15px 18px", borderRadius: "16px", border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}` }}><summary style={{ cursor: "pointer", fontWeight: "800", fontSize: "12px" }}>Konteks usaha yang digunakan</summary><div style={{ marginTop: "10px", fontSize: "11px", lineHeight: 1.6, color: darkMode ? "#CBD5E1" : "#475569" }}>{decisionResult.linked.map((item) => <div key={item} style={{ marginTop: "5px" }}>{item}</div>)}</div></details>}

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button type="button" onClick={() => setDecisionResult(null)} style={{ border: `1px solid ${darkMode ? "#475569" : "#CBD5E1"}`, background: darkMode ? "#111827" : "#FFFFFF", color: darkMode ? "#F8FAFC" : "#0F172A", padding: "10px 15px", borderRadius: "10px", fontWeight: "800", cursor: "pointer" }}>Perubahan Asumsi</button>
                    </div>
                  </div>
                )}

                {!decisionResult && <div style={{ marginTop: "20px", padding: "22px", textAlign: "center", borderRadius: "18px", border: `1px dashed ${darkMode ? "#475569" : "#CBD5E1"}`, color: darkMode ? "#CBD5E1" : "#64748B" }}>
                  <strong style={{ display: "block", color: darkMode ? "#F8FAFC" : "#0F172A" }}>Belum ada hasil simulasi.</strong>
                  <span style={{ display: "block", marginTop: "5px", fontSize: "12px" }}>Tentukan keputusan dan asumsi spesifiknya, lalu ZENAI akan menghitung konsekuensinya.</span>
                </div>}
              </section>
            </div>
          );
        })()}

        {tab === "autopilot" && (
          <div
            style={{
              maxWidth: "1000px"
            }}
          >
            {autopilotData && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
                <button type="button" onClick={exportAutopilotPdf} style={{ border: "1px solid #2563EB", background: darkMode ? "#172554" : "#EFF6FF", color: darkMode ? "#BFDBFE" : "#1D4ED8", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}> Ekspor PDF</button>
              </div>
            )}
            {!autopilotData ? (
              <div
                style={{
                  background: darkMode ? "#111827" : "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "20px",
                  padding: "40px",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px"
                  }}
                >
                  
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px"
                  }}
                >
                  Buat Strategi untuk Usaha Anda
                </h3>

                <p
                  style={{
                    color: darkMode ? "#CBD5E1" : "#64748B",
                    maxWidth: "550px",
                    margin: "12px auto 24px",
                    lineHeight: "1.6"
                  }}
                >
                  ZENAI akan mengubah kondisi dan
                  diagnosis usaha menjadi langkah
                  nyata yang bisa Anda prioritaskan.
                </p>

                <button
                  onClick={() => runAutopilot()}
                  disabled={busy}
                  style={{
                    border: "none",
                    background: busy
                      ? "#94A3B8"
                      : "#2563EB",
                    color: "#FFFFFF",
                    padding: "14px 22px",
                    borderRadius: "10px",
                    cursor: busy
                      ? "not-allowed"
                      : "pointer",
                    fontWeight: "700"
                  }}
                >
                  {busy
                    ? "ZENAI sedang membuat strategi..."
                    : " Buat Strategi"}
                </button>
              </div>
            ) : (
              <>
                {/* RINGKASAN STRATEGI */}
                <div
                  style={{
                    background: darkMode ? "#111827" : "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "20px",
                    padding: "28px",
                    marginBottom: "20px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: darkMode ? "#CBD5E1" : "#64748B",
                      letterSpacing: "1px",
                      marginBottom: "8px"
                    }}
                  >
                    STRATEGI USAHA
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      fontSize: "24px"
                    }}
                  >
                    {autopilotData.priority ||
                      "Prioritas Tindakan"}
                  </h3>

                  <p
                    style={{
                      margin: "14px 0 0",
                      color: darkMode ? "#E2E8F0" : "#475569",
                      lineHeight: "1.7"
                    }}
                  >
                    {autopilotData.summary ||
                      "ZENAI telah membuat strategi berdasarkan kondisi usaha Anda."}
                  </p>
                </div>
{/* bagian strategi/autopilot yang sudah ada */}

<BusinessGrowthLoop
  strategies={
    Array.isArray(autopilotData?.plan7)
      ? autopilotData.plan7
      : []
  }
  actions={growthActions}
  onActionsChange={setGrowthActions}
  evaluating={growthEvaluating}
darkMode={darkMode}
  onEvaluate={async (action) => {
    setGrowthEvaluating(true);

    try {
      const evaluationText = [
        `Tindakan yang sudah dilakukan: ${action.title}`,
        `Status hasil: ${action.evaluation?.outcome || ""}`,
        action.evaluation?.note
          ? `Catatan hasil: ${action.evaluation.note}`
          : "Catatan hasil: tidak ada",
      ].join("\n");

      setBusinessUpdates((previous) => [
        {
          id: `growth-${Date.now()}`,
          text: evaluationText,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          pulse: null,
          source: "Business Growth Loop",
        },
        ...previous,
      ]);

      const latestContext = {
        ...(getBusinessContext() || {}),
        updates: [
          ...(businessUpdates || []),
          {
            id: `growth-${Date.now()}`,
            text: evaluationText,
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            pulse: null,
            source: "Business Growth Loop",
          },
        ].map((item) => ({
          id: item.id,
          text: item.text,
          date: item.date || null,
          createdAt: item.createdAt || item.date || null,
          pulse: item.pulse || null,
        })),
      };

      const latestPulse = await runPulse(
        latestContext,
        { silent: true, goToTab: false }
      );

      const latestDiagnosis = await runDiagnosis(
        latestContext,
        { silent: true, goToTab: false }
      );

      await runAutopilot(
        latestContext,
        {
          diagnosisOverride: latestDiagnosis,
          pulseOverride: latestPulse,
          silent: true,
          goToTab: false,
        }
      );

      setTab("pulse");
    } catch (error) {
      console.error("GROWTH LOOP EVALUATION ERROR:", error);
      alert(
        formatError(error) ||
        "Evaluasi selesai, tetapi analisis lanjutan gagal dibuat."
      );
    } finally {
      setGrowthEvaluating(false);
    }
  }}
/>

                {/* RENCANA 7 HARI */}
                {Array.isArray(
                  autopilotData.plan7
                ) &&
                  autopilotData.plan7.length > 0 && (
                    <div
                      style={{
                        background: darkMode ? "#111827" : "#FFFFFF",
                        border:
                          "1px solid #E2E8F0",
                        borderRadius:
                          "18px",
                        padding: "24px",
                        marginBottom: "20px"
                      }}
                    >
                      <h3
                        style={{
                          marginTop: 0
                        }}
                      >
                         Rencana 7 Hari
                      </h3>

                      <div
                        style={{
                          display: "grid",
                          gap: "12px"
                        }}
                      >
                        {autopilotData.plan7.map(
                          (item, index) => (
                            <div
                              key={index}
                              style={{
                                border:
                                  "1px solid #E2E8F0",
                                padding:
                                  "18px",
                                borderRadius:
                                  "12px"
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    "flex",
                                  gap: "14px",
                                  alignItems:
                                    "flex-start"
                                }}
                              >
                                <div
                                  style={{
                                    minWidth:
                                      "42px",
                                    height:
                                      "42px",
                                    borderRadius:
                                      "10px",
                                    background:
                                      "#EFF6FF",
                                    color: darkMode ? "#60A5FA" : "#2563EB",
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "center",
                                    fontWeight:
                                      "700",
                                    fontSize:
                                      "12px",
                                    textAlign:
                                      "center"
                                  }}
                                >
                                  {item.day ||
                                    `Hari ${index + 1}`}
                                </div>

                                <div
                                  style={{
                                    flex: 1
                                  }}
                                >
                                  <strong>
                                    {item.title ||
                                      "Tindakan"}
                                  </strong>

                                  <p
                                    style={{
                                      margin:
                                        "8px 0 0",
                                      color: darkMode ? "#CBD5E1" : "#475569",
                                      lineHeight:
                                        "1.6"
                                    }}
                                  >
                                    {item.action ||
                                      "-"}
                                  </p>

                                  {item.purpose && (
                                    <div
                                      style={{
                                        marginTop:
                                          "10px",
                                        fontSize:
                                          "13px",
                                        color: darkMode ? "#94A3B8" : "#64748B"
                                      }}
                                    >
                                      Tujuan:{" "}
                                      {item.purpose}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}


                {/* RENCANA 14 HARI */}
                {Array.isArray(
                  autopilotData.plan14
                ) &&
                  autopilotData.plan14.length > 0 && (
                    <div
                      style={{
                        background: darkMode ? "#111827" : "#FFFFFF",
                        border:
                          "1px solid #E2E8F0",
                        borderRadius:
                          "18px",
                        padding: "24px",
                        marginBottom: "20px"
                      }}
                    >
                      <h3
                        style={{
                          marginTop: 0
                        }}
                      >
                        ️ Rencana 14 Hari
                      </h3>

                      <div
                        style={{
                          display: "grid",
                          gap: "12px"
                        }}
                      >
                        {autopilotData.plan14.map(
                          (item, index) => (
                            <div
                              key={index}
                              style={{
                                background: darkMode ? "#0B1120" : "#F8FAFC",
                                padding:
                                  "18px",
                                borderRadius:
                                  "12px"
                              }}
                            >
                              {item.phase && (
                                <div
                                  style={{
                                    fontSize:
                                      "12px",
                                    color: darkMode ? "#94A3B8" : "#64748B",
                                    marginBottom:
                                      "6px"
                                  }}
                                >
                                  {item.phase}
                                </div>
                              )}

                              <strong>
                                {item.title ||
                                  "Strategi"}
                              </strong>

                              <p
                                style={{
                                  margin:
                                    "8px 0 0",
                                  color: darkMode ? "#CBD5E1" : "#475569",
                                  lineHeight:
                                    "1.6"
                                }}
                              >
                                {item.action ||
                                  "-"}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}


                {/* RENCANA 30 HARI */}
                {Array.isArray(
                  autopilotData.plan30
                ) &&
                  autopilotData.plan30.length > 0 && (
                    <div
                      style={{
                        background: darkMode ? "#111827" : "#FFFFFF",
                        border:
                          "1px solid #E2E8F0",
                        borderRadius:
                          "18px",
                        padding: "24px",
                        marginBottom: "20px"
                      }}
                    >
                      <h3
                        style={{
                          marginTop: 0
                        }}
                      >
                         Rencana 30 Hari
                      </h3>

                      <div
                        style={{
                          display: "grid",
                          gap: "12px"
                        }}
                      >
                        {autopilotData.plan30.map(
                          (item, index) => (
                            <div
                              key={index}
                              style={{
                                border:
                                  "1px solid #E2E8F0",
                                padding:
                                  "18px",
                                borderRadius:
                                  "12px"
                              }}
                            >
                              {item.phase && (
                                <div
                                  style={{
                                    fontSize:
                                      "12px",
                                    color: darkMode ? "#94A3B8" : "#64748B",
                                    marginBottom:
                                      "6px"
                                  }}
                                >
                                  {item.phase}
                                </div>
                              )}

                              <strong>
                                {item.title ||
                                  "Langkah Strategis"}
                              </strong>

                              <p
                                style={{
                                  margin:
                                    "8px 0 0",
                                  color: darkMode ? "#CBD5E1" : "#475569",
                                  lineHeight:
                                    "1.6"
                                }}
                              >
                                {item.action ||
                                  "-"}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}


                {/* RENCANA UTAMA */}
                {Array.isArray(
                  autopilotData.plan
                ) &&
                  autopilotData.plan.length > 0 && (
                    <div
                      style={{
                        background: darkMode ? "#111827" : "#FFFFFF",
                        border:
                          "1px solid #E2E8F0",
                        borderRadius:
                          "18px",
                        padding: "24px",
                        marginBottom: "20px"
                      }}
                    >
                      <h3
                        style={{
                          marginTop: 0
                        }}
                      >
                         Langkah Prioritas
                      </h3>

                      <div
                        style={{
                          display: "grid",
                          gap: "12px"
                        }}
                      >
                        {autopilotData.plan.map(
                          (item, index) => (
                            <div
                              key={index}
                              style={{
                                display:
                                  "flex",
                                gap: "14px",
                                padding:
                                  "16px",
                                background: darkMode ? "#0B1120" : "#F8FAFC",
                                borderRadius:
                                  "12px"
                              }}
                            >
                              <div
                                style={{
                                  minWidth:
                                    "32px",
                                  height:
                                    "32px",
                                  borderRadius:
                                    "50%",
                                  background: darkMode ? "#2563EB" : "#2563EB",
                                  color:
                                    "#FFFFFF",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  fontWeight:
                                    "700"
                                }}
                              >
                                {item.step ||
                                  index + 1}
                              </div>

                              <div>
                                <strong>
                                  {item.action ||
                                    "Tindakan"}
                                </strong>

                                {item.purpose && (
                                  <p
                                    style={{
                                      margin:
                                        "8px 0 0",
                                      color: darkMode ? "#94A3B8" : "#64748B",
                                      lineHeight:
                                        "1.6"
                                    }}
                                  >
                                    {item.purpose}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}


                {/* PERINGATAN */}
{autopilotData.warning && (
  <div
    style={{
      background: darkMode ? "#422006" : "#FFFBEB",
      border: darkMode ? "1px solid #B45309" : "1px solid #FDE68A",
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "24px"
    }}
  >
                    <strong style={{
  color: darkMode ? "#FCD34D" : "#92400E"
}}>
  ️ Hal yang Perlu Diwaspadai
</strong>

                    <p
                      style={{
                        margin: "8px 0 0",
                        color: darkMode ? "#E2E8F0" : "#475569",
                        lineHeight: "1.6"
                      }}
                    >
                      {autopilotData.warning}
                    </p>
                  </div>
                )}


                {/* LANGKAH SELANJUTNYA */}
{autopilotData.nextStep && (
  <div
    style={{
      background: darkMode ? "#422006" : "#FFFBEB",
      border: darkMode ? "1px solid #B45309" : "1px solid #FDE68A",
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "24px"
    }}
  >
    <strong
      style={{
        color: darkMode ? "#FDE68A" : "#0F172A",
        display: "block",
        marginBottom: "8px"
      }}
    >
       Langkah Berikutnya
    </strong>

    <p
      style={{
        margin: 0,
        color: darkMode ? "#FEF3C7" : "#334155",
        lineHeight: "1.6"
      }}
    >
      {autopilotData.nextStep}
    </p>
  </div>
)}
                {/* TOMBOL AKSI */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap"
                  }}
                >
                  <button
                    onClick={() =>
                      runAutopilot()
                    }
                    disabled={busy}
                    style={{
                      border:
                        "1px solid #CBD5E1",
                      background: darkMode ? "#111827" : "#FFFFFF",
                      color:
                        "#334155",
                      padding:
                        "12px 18px",
                      borderRadius:
                        "10px",
                      cursor:
                        busy
                          ? "not-allowed"
                          : "pointer",
                      fontWeight:
                        "600"
                    }}
                  >
                     Buat Ulang Strategi
                  </button>

                  <button
                    onClick={() =>
                      setTab("pulse")
                    }
                    style={{
                      border: "none",
                      background: darkMode ? "#2563EB" : "#2563EB",
                      color:
                        "#FFFFFF",
                      padding:
                        "12px 18px",
                      borderRadius:
                        "10px",
                      cursor:
                        "pointer",
                      fontWeight:
                        "700"
                    }}
                  >
                     Lihat Kondisi Usaha
                  </button>
                </div>
              </>
            )}
          </div>
        )}


      <style>{`
.zenai-dark { background:#0B1120 !important; color:#F8FAFC !important; color-scheme:dark; }
.zenai-dark .zenai-content { background:#0B1120 !important; color:#F8FAFC !important; }
.zenai-dark .zenai-sidebar { background:#111827 !important; border-color:#334155 !important; }
.zenai-dark h1,.zenai-dark h2,.zenai-dark h3,.zenai-dark h4,.zenai-dark h5,.zenai-dark h6 { color:#F8FAFC !important; }
.zenai-dark strong { color:#F8FAFC !important; }
.zenai-dark p,.zenai-dark span,.zenai-dark label { color:#CBD5E1; }
.zenai-dark input,.zenai-dark textarea,.zenai-dark select { background:#0F172A !important; color:#F8FAFC !important; border-color:#475569 !important; color-scheme:dark; }
.zenai-dark input::placeholder,.zenai-dark textarea::placeholder { color:#94A3B8 !important; }
.zenai-dark option { background:#0F172A; color:#F8FAFC; }

/* Neutral surfaces */
.zenai-dark [style*="#FFFFFF"] { background:#111827 !important; color:#F8FAFC !important; }
.zenai-dark [style*="#F8FAFC"] { background:#0F172A !important; }
.zenai-dark [style*="#F1F5F9"] { background:#172033 !important; }

/* Semantic surfaces: these rules come AFTER neutral rules so they cannot be overwritten. */
.zenai-dark [style*="#EFF6FF"] { background:#172554 !important; color:#D1FAE5 !important; border-color:#166534 !important; }
.zenai-dark [style*="#EFF6FF"] p,.zenai-dark [style*="#EFF6FF"] span,.zenai-dark [style*="#EFF6FF"] label { color:#D1FAE5 !important; }
.zenai-dark [style*="#FFFFFF1f2"],.zenai-dark [style*="#FFFFFF1F2"] { background:#3B121D !important; color:#FFE4E6 !important; border-color:#9F1239 !important; }
.zenai-dark [style*="#FFFFFF1f2"] p,.zenai-dark [style*="#FFFFFF1f2"] span,.zenai-dark [style*="#FFFFFF1f2"] label { color:#FECDD3 !important; }
.zenai-dark [style*="#FFFFFFbeb"],.zenai-dark [style*="#FFFFFFBEB"] { background:#422006 !important; color:#FEF3C7 !important; border-color:#B45309 !important; }
.zenai-dark [style*="#FFFFFFbeb"] p,.zenai-dark [style*="#FFFFFFbeb"] span,.zenai-dark [style*="#FFFFFFbeb"] label { color:#FDE68A !important; }

/* Other common semantic light surfaces */
.zenai-dark [style*="#FFF1F2"] { background:#3B121D !important; color:#FFE4E6 !important; border-color:#9F1239 !important; }
.zenai-dark [style*="#F0FDF4"],.zenai-dark [style*="#F0FDF4"] { background:#172554 !important; color:#D1FAE5 !important; border-color:#166534 !important; }
.zenai-dark [style*="#FFFBEB"],.zenai-dark [style*="#FFFBEB"] { background:#422006 !important; color:#FEF3C7 !important; border-color:#B45309 !important; }

/* Semantic text colors */
.zenai-dark [style*="#2563EB"],.zenai-dark [style*="#1D4ED8"],.zenai-dark [style*="#064e3b"] { color:#60A5FA !important; }
.zenai-dark [style*="#e11d48"],.zenai-dark [style*="#be123c"],.zenai-dark [style*="#9f1239"] { color:#FB7185 !important; }
.zenai-dark [style*="#d97706"],.zenai-dark [style*="#b45309"],.zenai-dark [style*="#a16207"] { color:#FBBF24 !important; }
.zenai-dark [style*="#0891B2"],.zenai-dark [style*="#0e7490"] { color:#22D3EE !important; }

/* Borders */
.zenai-dark [style*="#E2E8F0"],.zenai-dark [style*="#e8edf3"],.zenai-dark [style*="#CBD5E1"] { border-color:#334155 !important; }

/* Active sidebar: emerald, never royal blue */
.zenai-dark .zenai-sidebar button { }

/* Buttons remain readable */
.zenai-dark button { color:#E5E7EB; }
.zenai-dark button[style*="#2563EB"],.zenai-dark button[style*="#2563EB"] { color:#FFFFFF !important; }

/* Sidebar tidak memakai scroll; ukuran elemen mengikuti tinggi viewport. */
.zenai-sidebar-nav { overflow-y:auto !important; overflow-x:hidden !important; flex:1 1 auto !important; min-height:0 !important; scrollbar-width:thin !important; -webkit-overflow-scrolling:touch !important; }

@media (max-width: 768px) {
  .zenai-app {
    width: 100vw !important;
    max-width: 100vw !important;
    min-height: 100dvh !important;
    overflow-x: hidden !important;
  }

  .zenai-sidebar {
    width: min(82vw, 300px) !important;
    min-width: min(82vw, 300px) !important;
    height: 100dvh !important;
    max-height: 100dvh !important;
    padding: 10px 8px !important;
    box-shadow: 12px 0 36px rgba(15, 23, 42, 0.18) !important;
    transition: transform 0.2s ease !important;
  }

  .zenai-sidebar.closed {
    transform: translateX(-105%) !important;
  }

  .zenai-sidebar-nav {
    min-height: 0 !important;
    flex: 1 1 auto !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch !important;
    overscroll-behavior: contain !important;
    scrollbar-width: thin !important;
  }

  .zenai-content, .zenai-sidebar.open ~ .zenai-content {
    min-width: 0 !important;
    overflow-x: hidden !important;
    overflow-y: visible !important;
    margin-left: 0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
}

/* Layar pendek: otomatis mengecilkan elemen atas agar menu bawah tetap muat. */
@media (min-width: 769px) and (max-height: 720px) {
  .zenai-sidebar {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
  }

  .zenai-sidebar-nav {
    gap: 5px !important;
  }

  .zenai-sidebar-nav button {
    min-height: 39px !important;
    padding-top: 7px !important;
    padding-bottom: 7px !important;
  }
}
`}</style>

    </section>

    </main>
  );
}
