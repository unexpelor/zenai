"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "../lib/supabase/client";
import BusinessGrowthLoop from "../components/BusinessGrowthLoop";
export default function Home() {
  const supabase = createClient();
  const [authReady, setAuthReady] = useState(false);
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState("login");
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
  const checkScreen = () => {
    setIsMobile(window.innerWidth <= 768);
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
        if (active) {
          setSession(null);
          setAuthReady(true);
          setCloudLoaded(false);
        }
        return;
      }

      if (active) setSession(currentSession);

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
    const [year, month] =
      String(period).split("-");

    const date = new Date(
      Number(year),
      Number(month) - 1,
      1
    );

    return date.toLocaleDateString(
      "id-ID",
      {
        month: "long",
        year: "numeric"
      }
    );
  };

  const financeCurrent = financeTransactions.filter(
    (item) =>
      item.date &&
      item.date.slice(0, 7) === financePeriod
  );

  const financePreviousPeriod = (() => {
    const [year, month] =
      financePeriod.split("-").map(Number);

    const date = new Date(
      year,
      month - 2,
      1
    );

    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
  })();

  const financePrevious =
    financeTransactions.filter(
      (item) =>
        item.date &&
        item.date.slice(0, 7) ===
          financePreviousPeriod
    );

  const calculateFinance = (items) => {
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
      cashOut: 0
    };

    items.forEach((item) => {
      const amount =
        Math.max(0, Number(item.amount) || 0);

      if (item.type === "income") {
        result.income += amount;

        if (item.account === "cash") {
          result.cash += amount;
          result.cashIn += amount;
        } else if (item.account === "bank") {
          result.bank += amount;
          result.cashIn += amount;
        } else if (item.account === "receivable") {
          result.receivable += amount;
        }
      }

      if (item.type === "expense") {
        result.expense += amount;

        if (item.account === "cash") {
          result.cash -= amount;
          result.cashOut += amount;
        } else {
          result.bank -= amount;
          result.cashOut += amount;
        }
      }

      if (item.type === "hpp") {
        result.hpp += amount;

        if (item.account === "cash") {
          result.cash -= amount;
          result.cashOut += amount;
        } else {
          result.bank -= amount;
          result.cashOut += amount;
        }
      }

      if (item.type === "capital") {
        result.capital += amount;

        if (item.account === "cash") {
          result.cash += amount;
          result.cashIn += amount;
        } else {
          result.bank += amount;
          result.cashIn += amount;
        }
      }

      if (item.type === "withdrawal") {
        result.withdrawal += amount;

        if (item.account === "cash") {
          result.cash -= amount;
          result.cashOut += amount;
        } else {
          result.bank -= amount;
          result.cashOut += amount;
        }
      }

      if (item.type === "receivable") {
        result.receivable -= amount;

        if (item.account === "cash") {
          result.cash += amount;
          result.cashIn += amount;
        } else {
          result.bank += amount;
          result.cashIn += amount;
        }
      }

      if (item.type === "loan") {
        result.loan += amount;
        result.debt += amount;

        if (item.account === "cash") {
          result.cash += amount;
          result.cashIn += amount;
        } else {
          result.bank += amount;
          result.cashIn += amount;
        }
      }
    });

    result.grossProfit =
      result.income - result.hpp;

    result.netProfit =
      result.grossProfit - result.expense;

    result.cashTotal =
      result.cash + result.bank;

    result.totalAssets =
      result.cashTotal +
      result.receivable +
      result.inventory;

    result.totalEquity =
      result.capital +
      result.netProfit -
      result.withdrawal;

    return result;
  };

  const financeCurrentTotals =
    calculateFinance(financeCurrent);

  const financePreviousTotals =
    calculateFinance(financePrevious);

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

  const financeInsight = (() => {
    const current =
      financeCurrentTotals;

    const previous =
      financePreviousTotals;

    if (
      current.income === 0 &&
      current.expense === 0 &&
      current.hpp === 0
    ) {
      return "Belum ada transaksi pada periode ini. Tambahkan transaksi untuk mendapatkan laporan dan insight ZenAI.";
    }

    const profitChange =
      financeChange(
        current.netProfit,
        previous.netProfit
      );

    if (
      current.netProfit < 0
    ) {
      return "Periode ini mencatat rugi. Periksa HPP dan biaya usaha, lalu gunakan rincian transaksi untuk menemukan pengeluaran terbesar.";
    }

    if (
      profitChange !== null &&
      profitChange > 0
    ) {
      return `Laba bersih meningkat ${Math.abs(profitChange).toFixed(1)}% dibanding ${financePeriodLabel(financePreviousPeriod)}. Pertahankan pertumbuhan pendapatan sambil mengendalikan biaya.`;
    }

    if (
      profitChange !== null &&
      profitChange < 0
    ) {
      return `Laba bersih menurun ${Math.abs(profitChange).toFixed(1)}% dibanding ${financePeriodLabel(financePreviousPeriod)}. Periksa perubahan HPP dan biaya usaha.`;
    }

    return "Keuangan periode ini sudah tercatat. Bandingkan dengan periode sebelumnya untuk melihat arah perkembangan usaha.";
  })();

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
      critical: "🔴 Kritis",
      high: "🟠 Tinggi",
      medium: "🟡 Sedang",
      low: "🟢 Rendah",

      urgent: "🔴 Mendesak",

      warning: "🟠 Perlu Perhatian",

      attention: "🟠 Perlu Perhatian",

      good: "🟢 Baik",
      healthy: "🟢 Sehat",
      positive: "🟢 Positif",

      stable: "🔵 Stabil",
      normal: "🔵 Normal",

      success: "🟢 Berhasil",
      completed: "🟢 Selesai",

      pending: "🟡 Menunggu",

      unknown: "⚪ Tidak diketahui"
    };

    return (
      statusMap[normalized] ||
      (status
        ? String(status)
        : "⚪ Belum diketahui")
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
  "score": 0,

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

- score harus angka 0 sampai 100.
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

      const raw =
        await askAI({
          prompt,

          system: `
Anda adalah Business Autopilot ZENAI.

Tugas Anda adalah mengubah kondisi usaha
TERBARU menjadi tindakan nyata.

Jika ada pembaruan usaha, strategi harus
menyesuaikan pembaruan tersebut.

Gunakan bahasa Indonesia yang mudah dipahami.

Prioritaskan tindakan yang realistis,
sederhana, dan dapat dilakukan.

Jangan mengarang data.

Balas JSON valid.
`
        });

      const result =
        extractJson(raw);

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
        <div style={{ color: darkMode ? "#cbd5e1" : "#64748b" }}>Memuat ZenAI...</div>
      </main>
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

        background: darkMode ? "#0b1120" : "#f8fafc",
        color: darkMode ? "#f8fafc" : "#0f172a",
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
            background: darkMode ? "#111827" : "#ffffff",
            color: darkMode ? "#f8fafc" : "#0f172a",
            border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
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
                color: darkMode ? "#93c5fd" : "#2563eb"
              }}
            >
              Know More Grow More
            </div>
          </div>

          <div
            style={{
              color: darkMode ? "#cbd5e1" : "#64748b",
              marginBottom: "24px",
              lineHeight: "1.5",
              textAlign: "center"
            }}
          >
            {authMode === "login"
              ? "Masuk untuk menyimpan data bisnis dan hasil AI secara permanen."
              : "Buat akun ZENAI agar data tersimpan di cloud."}
          </div>

          <label style={{ display: "block", fontWeight: "600", marginBottom: "7px", color: darkMode ? "#f8fafc" : "#0f172a" }}>
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
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              marginBottom: "14px",
              boxSizing: "border-box"
            }}
          />

          <label style={{ display: "block", fontWeight: "600", marginBottom: "7px", color: darkMode ? "#f8fafc" : "#0f172a" }}>
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
              border: "1px solid #cbd5e1",
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
              background: "#2563eb",
              color: "#fff",
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
                color: darkMode ? "#e2e8f0" : "#475569",
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
              color: "#2563eb",
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
        background: "#f8fafc",
        color: "#0f172a",
        display: "flex",
        fontFamily: "Arial, sans-serif"
      }}
    >
     {/* SIDEBAR */}
<aside
  className={`zenai-sidebar ${sidebarOpen ? "open" : "closed"}`}
  style={{
    width: isMobile ? (sidebarOpen ? "220px" : "64px") : (sidebarOpen ? "280px" : "72px"),
    minWidth: isMobile ? (sidebarOpen ? "220px" : "64px") : (sidebarOpen ? "280px" : "72px"),
    height: "100vh",
    background: "#ffffff",
    borderRight: "1px solid #e2e8f0",
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
    ☰
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
        width: sidebarOpen ? (isMobile ? "105px" : "110px") : (isMobile ? "42px" : "46px"),
        height: sidebarOpen ? (isMobile ? "105px" : "110px") : (isMobile ? "42px" : "46px"),
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
          color: darkMode ? "#cbd5e1" : "#64748b",
          whiteSpace: "nowrap"
        }}
      >
        AI Business Assistant
      </div>
    )}
  </div>

  {/* NAVIGASI UTAMA */}
  <nav
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "7px",
      flexShrink: 0
    }}
  >
    {[
      ["home", "🏠", "Dashboard"],
      ["capture", "✨", "Ceritakan Usaha"],
      ["pulse", "📊", "Kondisi Usaha"],
      ["diagnosis", "🔎", "Diagnosis"],
      ["market", "⚖", "Perspektif Bisnis"],
      ["autopilot", "⚡", "Strategi & Tindakan"],
      ["finance", "💰", "Laporan Keuangan"],
      ["health", "♥", "System Health"],
      ["guide", "❓", "Panduan"]
    ].map(([key, icon, label]) => (
      <button
        key={key}
        onClick={() => {
          if ((key === "market" || key === "autopilot") && !business) {
            alert("Ceritakan usaha terlebih dahulu.");
            setTab("capture");
            return;
          }
          setTab(key);
        }}
        title={sidebarOpen ? "" : label}
        style={{
          width: "100%",
          minHeight: "43px",
          border: tab === key
            ? `1px solid ${darkMode ? "#047857" : "#A7F3D0"}`
            : `1px solid ${darkMode ? "#334155" : "#e8edf3"}`,
          padding: "10px 12px",
          borderRadius: "10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "flex-start" : "center",
          gap: sidebarOpen ? "9px" : "0",
          textAlign: sidebarOpen ? "left" : "center",
          background: tab === key
            ? (darkMode ? "#12372F" : "#ECFDF5")
            : (darkMode ? "#111827" : "#ffffff"),
          color: tab === key
            ? (darkMode ? "#34D399" : "#047857")
            : (darkMode ? "#E5E7EB" : "#475569"),
          fontWeight: tab === key ? "700" : "500",
          boxShadow: tab === key
            ? (darkMode ? "0 3px 12px rgba(16, 185, 129, 0.12)" : "0 3px 10px rgba(16, 185, 129, 0.08)")
            : "0 1px 2px rgba(15, 23, 42, 0.03)",
          fontSize: "13px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          flexShrink: 0
        }}
      >
        <span style={{ fontSize: "17px", lineHeight: 1, flexShrink: 0 }}>{icon}</span>
        {sidebarOpen && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>}
      </button>
    ))}
  </nav>

  {/* AREA BAWAH SIDEBAR */}
  <div
    style={{
      marginTop: "auto",
      paddingTop: "10px",
      flexShrink: 0
    }}
  >
    <div
      style={{
        height: "1px",
        background: darkMode ? "#334155" : "#e2e8f0",
        margin: "0 2px 9px"
      }}
    />

    {business && (
      <div style={{ display: "grid", gap: "7px", marginBottom: "7px" }}>
        <button
          type="button"
          onClick={() => {
            const ok = window.confirm("Reset Analisis? Profil perusahaan dan laporan keuangan tetap disimpan.");
            if (ok) resetAnalysis();
          }}
          title={sidebarOpen ? "" : "Reset Analisis"}
          style={{
            width: "100%",
            minHeight: "41px",
            border: `1px solid ${darkMode ? "#7F1D1D" : "#fecaca"}`,
            background: darkMode ? "#2A1111" : "#ffffff",
            color: darkMode ? "#FCA5A5" : "#dc2626",
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
          <span style={{ fontSize: "17px", flexShrink: 0 }}>↻</span>
          {sidebarOpen && <span>Reset Analisis</span>}
        </button>

        <button
          type="button"
          onClick={resetCompanyTotal}
          title={sidebarOpen ? "" : "Reset Perusahaan Total"}
          style={{
            width: "100%",
            minHeight: "41px",
            border: `1px solid ${darkMode ? "#7F1D1D" : "#fee2e2"}`,
            background: darkMode ? "#3B1212" : "#fef2f2",
            color: darkMode ? "#FCA5A5" : "#991b1b",
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
          <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠</span>
          {sidebarOpen && <span>Reset Perusahaan Total</span>}
        </button>
      </div>
    )}

    <div style={{ display: "grid", gap: "7px" }}>
      <button
        type="button"
        onClick={() => setDarkMode((current) => !current)}
        title={sidebarOpen ? "" : (darkMode ? "Tema Terang" : "Tema Gelap")}
        aria-label={darkMode ? "Gunakan Tema Terang" : "Gunakan Tema Gelap"}
        style={{
          width: "100%",
          minHeight: "41px",
          border: `1px solid ${darkMode ? "#334155" : "#cbd5e1"}`,
          background: darkMode ? "#111827" : "#ffffff",
          color: darkMode ? "#E5E7EB" : "#334155",
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
        <span style={{ fontSize: "16px", flexShrink: 0 }}>{darkMode ? "☀️" : "🌙"}</span>
        {sidebarOpen && <span>{darkMode ? "Tema Terang" : "Tema Gelap"}</span>}
      </button>

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
          border: "1px solid #fecaca",
          background: "#ffffff",
          color: "#dc2626",
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
        <span style={{ fontSize: "16px", flexShrink: 0 }}>↪</span>
        {sidebarOpen && <span>Keluar</span>}
      </button>
    </div>
  </div>
</aside>

      {/* KONTEN UTAMA */}
      <section
  className="zenai-content"
  style={{
    flex: 1,
    minWidth: 0,
    marginLeft: isMobile ? 0 : (sidebarOpen ? "280px" : "72px"),
    width: isMobile ? "100%" : `calc(100% - ${sidebarOpen ? "280px" : "72px"})`,
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
            color: darkMode ? "#f8fafc" : "#0f172a",
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
                color: darkMode ? "#ffffff" : "#0f172a",
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

              {tab === "health" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div style={{ padding: "22px", borderRadius: "18px", border: `1px solid ${darkMode ? "#334155" : "#dcfce7"}`, background: darkMode ? "#0f172a" : "#f0fdf4" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                      <div><div style={{ fontSize: "20px", fontWeight: "800", color: darkMode ? "#f8fafc" : "#14532d" }}>Live System Verification</div><div style={{ marginTop: "6px", color: darkMode ? "#cbd5e1" : "#166534", fontSize: "14px", lineHeight: 1.5 }}>Pemeriksaan dilakukan saat tombol dijalankan dan hasil diberi timestamp.</div></div>
                      <button type="button" onClick={runLiveHealthCheck} disabled={healthLoading} style={{ border: "none", borderRadius: "10px", padding: "11px 16px", background: "#16a34a", color: "#fff", fontWeight: "800", cursor: healthLoading ? "wait" : "pointer" }}>{healthLoading ? "Memeriksa..." : "Run Live Health Check"}</button>
                    </div>
                  </div>
                  {healthError && <div style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid #fecaca", background: "#fef2f2", color: "#991b1b", fontSize: "14px" }}>{healthError}</div>}
                  {healthData && <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
                      {(healthData.services || []).map((service) => <div key={service.name} style={{ padding: "18px", borderRadius: "14px", border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, background: darkMode ? "#111827" : "#fff" }}><div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><strong>{service.name}</strong><span style={{ fontWeight: "800", color: service.status === "operational" ? "#15803d" : service.status === "configured" ? "#b45309" : "#b91c1c" }}>{service.status === "operational" ? "● OPERATIONAL" : service.status === "configured" ? "● CONFIGURED" : "● DOWN"}</span></div><div style={{ marginTop: "8px", color: darkMode ? "#cbd5e1" : "#64748b", fontSize: "13px", lineHeight: 1.5 }}>{service.detail}</div>{service.latencyMs != null && <div style={{ marginTop: "8px", fontSize: "12px", color: darkMode ? "#94a3b8" : "#64748b" }}>Latency: {service.latencyMs} ms</div>}</div>)}
                    </div>
                    {healthData.liveAiSmokeTest && <div style={{ padding: "18px", borderRadius: "14px", border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, background: darkMode ? "#111827" : "#fff" }}><div style={{ display: "flex", justifyContent: "space-between" }}><strong>Live AI Smoke Test</strong><span style={{ color: "#15803d", fontWeight: "800" }}>● OPERATIONAL</span></div><div style={{ marginTop: "8px", fontSize: "13px", color: darkMode ? "#cbd5e1" : "#64748b" }}>Provider: {healthData.liveAiSmokeTest.provider} · Latency: {healthData.liveAiSmokeTest.latencyMs} ms · Response: {healthData.liveAiSmokeTest.response || "—"}</div></div>}
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap", padding: "16px", borderRadius: "14px", background: darkMode ? "#0f172a" : "#f8fafc" }}><div><strong>{healthData.summary?.operational ?? 0}/{healthData.summary?.total ?? 0} layanan operational</strong><div style={{ marginTop: "4px", fontSize: "12px", color: darkMode ? "#94a3b8" : "#64748b" }}>Checked: {healthData.checkedAt ? new Date(healthData.checkedAt).toLocaleString("id-ID") : "—"}</div></div><button type="button" onClick={runLiveAiSmokeTest} disabled={healthLoading} style={{ border: `1px solid ${darkMode ? "#475569" : "#cbd5e1"}`, borderRadius: "10px", padding: "10px 14px", background: darkMode ? "#111827" : "#fff", color: darkMode ? "#f8fafc" : "#0f172a", fontWeight: "700", cursor: healthLoading ? "wait" : "pointer" }}>{healthLoading ? "Menguji AI..." : "Run AI Smoke Test"}</button></div>
                  </div>}
                </div>
              )}

              {tab === "finance" &&
                "Laporan Keuangan"}

{tab === "market" &&
  "Perspektif Bisnis"}
            </h2>

            <p
              style={{
                margin: "8px 0 0",
                color: darkMode ? "#dbeafe" : "#64748b",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              {tab === "health"
                ? "Verifikasi kondisi layanan ZenAI secara langsung."
                : provider
                  ? `AI aktif: ${provider}`
                  : "Gunakan AI untuk memahami kondisi usaha Anda."}
            </p>
          </div>

          {busy && (
            <div
              style={{
                background: "#eff6ff",
                color: "#2563eb",
                padding: "10px 16px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: "600"
              }}
            >
              ✨ AI sedang menganalisis...
            </div>
          )}
        </header>
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
              icon: "✨",
              done: hasBusiness,
              text: "Masukkan cerita, profil, kondisi, produk, pelanggan, dan informasi penting usaha Anda. Ini menjadi konteks utama ZenAI.",
              action: "Buka Ceritakan Usaha",
              canOpen: true
            },
            {
              key: "pulse",
              title: "Kondisi Usaha",
              icon: "📊",
              done: hasPulse,
              text: "Gunakan Business Pulse untuk melihat gambaran kondisi dan prioritas usaha berdasarkan konteks yang sudah diberikan.",
              action: "Buka Kondisi Usaha",
              canOpen: hasBusiness
            },
            {
              key: "diagnosis",
              title: "Diagnosis",
              icon: "🔎",
              done: hasDiagnosis,
              text: "Gunakan Diagnosis untuk memahami masalah, kekuatan, peluang, rekomendasi, dan langkah berikutnya.",
              action: "Buka Diagnosis",
              canOpen: hasBusiness
            },
            {
              key: "market",
              title: "Perspektif Bisnis",
              icon: "⚖",
              done: hasMarket,
              text: "ZenAI memperkaya analisis dengan informasi eksternal yang relevan. Tavily bekerja di belakang layar sebagai sumber informasi, kemudian AI mengolahnya menjadi perspektif bisnis.",
              action: "Buka Perspektif Bisnis",
              canOpen: hasBusiness
            },
            {
              key: "autopilot",
              title: "Strategi & Tindakan",
              icon: "⚡",
              done: hasAutopilot,
              text: "Ubah hasil analisis menjadi strategi dan tindakan yang dapat dijalankan. Pilih durasi yang sesuai dengan kebutuhan usaha.",
              action: "Buka Strategi & Tindakan",
              canOpen: hasBusiness
            },
            {
              key: "growth",
              title: "Growth Loop",
              icon: "🔄",
              done: hasGrowth,
              text: "Jadikan strategi sebagai tindakan, mulai, selesaikan, catat hasil, dan evaluasi. Hasil evaluasi digunakan sebagai konteks untuk analisis berikutnya.",
              action: "Buka Strategi & Tindakan",
              canOpen: hasAutopilot
            },
            {
              key: "finance",
              title: "Laporan Keuangan",
              icon: "💰",
              done: hasFinance,
              text: "Catat transaksi dan gunakan ringkasan keuangan untuk memahami pendapatan, HPP, biaya, laba, arus kas, dan posisi keuangan.",
              action: "Buka Laporan Keuangan",
              canOpen: true
            },
            {
              key: "health",
              title: "System Health",
              icon: "♥",
              done: false,
              text: "Gunakan menu ini untuk memeriksa kondisi layanan dan melakukan pemeriksaan sistem/AI ketika diperlukan.",
              action: "Buka System Health",
              canOpen: true
            }
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
                  background: darkMode ? "#0f172a" : "#ffffff",
                  border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
                  borderRadius: "20px",
                  padding: "26px"
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: "800", color: darkMode ? "#93c5fd" : "#2563eb", letterSpacing: "0.04em" }}>
                  PANDUAN INTERAKTIF
                </div>
                <h3 style={{ margin: "7px 0 8px", fontSize: "25px", color: darkMode ? "#f8fafc" : "#0f172a" }}>
                  Bingung harus mulai dari mana?
                </h3>
                <p style={{ margin: 0, color: darkMode ? "#cbd5e1" : "#64748b", lineHeight: 1.65, maxWidth: "760px" }}>
                  ZenAI akan membimbing Anda sesuai kondisi data yang sudah ada. Tidak perlu membuka semua menu sekaligus.
                  Ikuti langkah berikut dan gunakan tombol tindakan untuk melanjutkan.
                </p>
              </div>

              <div
                style={{
                  background: darkMode ? "#172554" : "#eff6ff",
                  border: `1px solid ${darkMode ? "#1e40af" : "#bfdbfe"}`,
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
                  <div style={{ fontSize: "12px", fontWeight: "800", color: darkMode ? "#93c5fd" : "#2563eb", marginBottom: "5px" }}>
                    LANGKAH BERIKUTNYA
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: darkMode ? "#ffffff" : "#0f172a" }}>
                    {nextStep.icon} {nextStep.title}
                  </div>
                  <div style={{ marginTop: "6px", color: darkMode ? "#dbeafe" : "#475569", lineHeight: 1.55 }}>
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
                    background: nextStep.canOpen ? "#2563eb" : "#94a3b8",
                    color: "#ffffff",
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
                  background: darkMode ? "#0f172a" : "#ffffff",
                  border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
                  borderRadius: "20px",
                  padding: "22px"
                }}
              >
                <h3 style={{ margin: "0 0 15px", color: darkMode ? "#f8fafc" : "#0f172a" }}>
                  🧭 Alur utama ZenAI
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
                        border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
                        background: step.done
                          ? (darkMode ? "#052e16" : "#f0fdf4")
                          : (darkMode ? "#111827" : "#f8fafc")
                      }}
                    >
                      <div style={{ width: "28px", textAlign: "center", fontWeight: "800", color: step.done ? "#16a34a" : "#64748b" }}>
                        {step.done ? "✓" : index + 1}
                      </div>
                      <div style={{ fontSize: "17px" }}>{step.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "800", color: darkMode ? "#f8fafc" : "#0f172a" }}>
                          {step.title}
                        </div>
                        <div style={{ fontSize: "12px", color: darkMode ? "#94a3b8" : "#64748b", marginTop: "3px" }}>
                          {step.text}
                        </div>
                      </div>
                      {step.canOpen && (
                        <button
                          type="button"
                          onClick={() => openGuideStep(step)}
                          style={{
                            border: `1px solid ${darkMode ? "#475569" : "#cbd5e1"}`,
                            background: darkMode ? "#1e293b" : "#ffffff",
                            color: darkMode ? "#e2e8f0" : "#334155",
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
                  background: darkMode ? "#0f172a" : "#ffffff",
                  border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
                  borderRadius: "20px",
                  padding: "22px"
                }}
              >
                <h3 style={{ margin: "0 0 14px", color: darkMode ? "#f8fafc" : "#0f172a" }}>
                  ❓ Jika Anda bingung
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
                        border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
                        background: darkMode ? "#111827" : "#f8fafc",
                        color: darkMode ? "#e2e8f0" : "#334155",
                        borderRadius: "12px",
                        padding: "14px",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ fontWeight: "800", marginBottom: "5px" }}>{question}</div>
                      <div style={{ fontSize: "13px", lineHeight: 1.55, color: darkMode ? "#94a3b8" : "#64748b" }}>{answer}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: darkMode ? "#111827" : "#f8fafc",
                  border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
                  borderRadius: "16px",
                  padding: "15px 18px",
                  fontSize: "12px",
                  color: darkMode ? "#94a3b8" : "#64748b",
                  lineHeight: 1.55
                }}
              >
                <strong style={{ color: darkMode ? "#cbd5e1" : "#475569" }}>Catatan:</strong> Panduan ini mengikuti alur dan fitur yang tersedia di aplikasi. Data usaha, hasil analisis, strategi, dan tindakan menentukan langkah yang relevan berikutnya.
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
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
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
                  🚀
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
                    color: darkMode ? "#cbd5e1" : "#64748b",
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
                    background: "#2563eb",
                    color: "#ffffff",
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
                    background: "#ffffff",
                    border:
                      "1px solid #e2e8f0",
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
                          color: darkMode ? "#cbd5e1" : "#64748b",
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
                          color: darkMode ? "#cbd5e1" : "#64748b",
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
                          "1px solid #e2e8f0",
                        background:
                          "#ffffff",
                        padding:
                          "10px 14px",
                        borderRadius:
                          "10px",
                        cursor: "pointer",
                        whiteSpace:
                          "nowrap"
                      }}
                    >
                      ↻ Reset
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
                        background:
                          "#f8fafc",
                        padding: "16px",
                        borderRadius:
                          "12px"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: darkMode ? "#cbd5e1" : "#64748b"
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
                        background:
                          "#f8fafc",
                        padding: "16px",
                        borderRadius:
                          "12px"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: darkMode ? "#cbd5e1" : "#64748b"
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
                        background:
                          "#f8fafc",
                        padding: "16px",
                        borderRadius:
                          "12px"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: darkMode ? "#cbd5e1" : "#64748b"
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
                        "1px solid #e2e8f0",
                      borderRadius:
                        "16px",
                      background:
                        "#ffffff",
                      cursor: "pointer"
                    }}
                  >
                    <div
                      style={{
                        fontSize: "28px",
                        marginBottom: "12px"
                      }}
                    >
                      📊
                    </div>

                    <strong>
                      Lihat Kondisi Usaha
                    </strong>

                    <p
                      style={{
                        margin:
                          "8px 0 0",
                        fontSize: "13px",
                        color: darkMode ? "#cbd5e1" : "#64748b",
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
                        "1px solid #e2e8f0",
                      borderRadius:
                        "16px",
                      background:
                        "#ffffff",
                      cursor: "pointer"
                    }}
                  >
                    <div
                      style={{
                        fontSize: "28px",
                        marginBottom: "12px"
                      }}
                    >
                      🔍
                    </div>

                    <strong>
                      Diagnosis Usaha
                    </strong>

                    <p
                      style={{
                        margin:
                          "8px 0 0",
                        fontSize: "13px",
                        color: darkMode ? "#cbd5e1" : "#64748b",
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
                        "1px solid #e2e8f0",
                      borderRadius:
                        "16px",
                      background:
                        "#ffffff",
                      cursor: "pointer"
                    }}
                  >
                    <div
                      style={{
                        fontSize: "28px",
                        marginBottom: "12px"
                      }}
                    >
                      ⚡
                    </div>

                    <strong>
                      Strategi & Tindakan
                    </strong>

                    <p
                      style={{
                        margin:
                          "8px 0 0",
                        fontSize: "13px",
                        color: darkMode ? "#cbd5e1" : "#64748b",
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
                      background:
                        "#ffffff",
                      border:
                        "1px solid #e2e8f0",
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
                                "1px solid #f1f5f9",
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
                                color:
                                  "#64748b",
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
                                color:
                                  "#94a3b8"
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
                background: "#ffffff",
                border:
                  "1px solid #e2e8f0",
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
                  color: darkMode ? "#cbd5e1" : "#64748b",
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
                    "1px solid #cbd5e1",
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
                      "1px dashed #94a3b8",
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
                  🖼️ Tambahkan Foto

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
                          "1px solid #e2e8f0"
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
                            "#dc2626",
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
                  background: "#f8fafc",
                  borderRadius: "14px"
                }}
              >
                <strong>
                  🎙️ Ceritakan dengan suara
                </strong>

                <p
                  style={{
                    margin:
                      "8px 0 16px",
                    color: darkMode ? "#cbd5e1" : "#64748b",
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
                          "#dc2626",
                        color: "#ffffff",
                        padding:
                          "11px 16px",
                        borderRadius:
                          "10px",
                        cursor:
                          "pointer"
                      }}
                    >
                      🔴 Mulai Rekam
                    </button>
                  ) : (
                    <button
                      onClick={
                        stopRecording
                      }
                      style={{
                        border: "none",
                        background:
                          "#0f172a",
                        color: "#ffffff",
                        padding:
                          "11px 16px",
                        borderRadius:
                          "10px",
                        cursor:
                          "pointer"
                      }}
                    >
                      ⏹ Stop (
                      {recordingTime}s)
                    </button>
                  )}

                  <label
                    style={{
                      border:
                        "1px solid #cbd5e1",
                      background:
                        "#ffffff",
                      padding:
                        "10px 14px",
                      borderRadius:
                        "10px",
                      cursor:
                        "pointer"
                    }}
                  >
                    📁 Upload Audio

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
                          "1px solid #fecaca",
                        background:
                          "#ffffff",
                        color:
                          "#dc2626",
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
                          color: darkMode ? "#cbd5e1" : "#64748b"
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
                        ? "#94a3b8"
                        : "#2563eb",
                    color: "#ffffff",
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
                    : "✨ Analisis Usaha Saya"}
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
            {!pulseData ? (
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
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
                  📊
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
                    color: darkMode ? "#cbd5e1" : "#64748b",
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
                      ? "#94a3b8"
                      : "#2563eb",
                    color: "#ffffff",
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
                    : "📊 Analisis Kondisi Usaha"}
                </button>
              </div>
            ) : (
              <>
                {/* RINGKASAN PULSE */}
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
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
                          color: darkMode ? "#cbd5e1" : "#64748b",
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
                          color: darkMode ? "#cbd5e1" : "#64748b",
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
                        background: "#ffffff",
                        border:
                          "1px solid #e2e8f0",
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
                        🟢 Hal yang berjalan baik
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
                                  darkMode ? "#0B3B2E" : "#f0fdf4",
                                border:
                                  darkMode ? "1px solid #166534" : "1px solid #dcfce7",
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
                        background: "#ffffff",
                        border:
                          "1px solid #e2e8f0",
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
                        🟠 Perlu Perhatian
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
                                  "1px solid #fed7aa",
                                background:
                                  "#fff7ed",
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
                                    darkMode ? "#FECACA" : "#475569",
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
                        background: "#ffffff",
                        border:
                          "1px solid #e2e8f0",
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
                        🎯 Prioritas Sekarang
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
                                  "1px solid #e2e8f0",
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
                                      "#eff6ff",
                                    color:
                                      "#2563eb",
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
                                      color:
                                        "#475569",
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
                                        color:
                                          "#64748b"
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
                      background: "#eff6ff",
                      border:
                        "1px solid #bfdbfe",
                      borderRadius:
                        "16px",
                      padding: "20px",
                      marginBottom: "24px"
                    }}
                  >
                    <strong>
                      💡 Langkah Berikutnya
                    </strong>

                    <p
                      style={{
                        margin:
                          "8px 0 0",
                        lineHeight: "1.6",
                        color: "#334155"
                      }}
                    >
                      {pulseData.nextStep}
                    </p>
                  </div>
                )}


                {/* UPDATE USAHA */}
                <div
                  style={{
                    background: "#ffffff",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "24px"
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0
                    }}
                  >
                    🔄 Ada perubahan pada usaha?
                  </h3>

                  <p
                    style={{
                      color: darkMode ? "#cbd5e1" : "#64748b",
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
    border: "1px solid #cbd5e1",
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
        ? "#94a3b8"
        : "#0f172a",
    color: "#ffffff",
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
                          "1px solid #e2e8f0"
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
                                background:
                                  "#f8fafc",
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
                                  color:
                                    "#94a3b8"
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
            {!diagnosis ? (
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
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
                  🔍
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
                    color: darkMode ? "#cbd5e1" : "#64748b",
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
                      ? "#94a3b8"
                      : "#2563eb",
                    color: "#ffffff",
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
                    : "🔍 Mulai Diagnosis"}
                </button>
              </div>
            ) : (
              <>
                {/* RINGKASAN */}
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "20px",
                    padding: "28px",
                    marginBottom: "20px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: darkMode ? "#cbd5e1" : "#64748b",
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
                      color: darkMode ? "#e2e8f0" : "#475569",
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
                        background: "#fff7ed",
                        border:
                          "1px solid #fed7aa",
                        padding: "18px",
                        borderRadius: "12px"
                      }}
                    >
                      <strong>
                        🎯 Masalah Utama
                      </strong>

                      <p
                        style={{
                          margin:
                            "8px 0 0",
                          lineHeight: "1.6",
                          color: darkMode ? "#e2e8f0" : "#475569"
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
                        background: "#ffffff",
                        border:
                          "1px solid #e2e8f0",
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
                        💪 Kekuatan Usaha
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
                                  "#f0fdf4",
                                border:
                                  "1px solid #dcfce7",
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
                                  color:
                                    darkMode ? "#DBEAFE" : "#475569",
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
                        background: "#ffffff",
                        border:
                          "1px solid #e2e8f0",
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
                        ⚠️ Masalah yang Ditemukan
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
                                  darkMode ? "1px solid #7F1D1D" : "1px solid #fecaca",
                                background:
                                  darkMode ? "#3B1212" : "#fef2f2",
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
                                      background:
                                        "#ffffff",
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
                                  color:
                                    "#475569",
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
                                    color:
                                      "#64748b"
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
                        background: "#ffffff",
                        border:
                          "1px solid #e2e8f0",
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
                        🚀 Peluang yang Bisa Dimanfaatkan
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
                                  darkMode ? "1px solid #1D4ED8" : "1px solid #bfdbfe",
                                background:
                                  darkMode ? "#172554" : "#eff6ff",
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
                                  color:
                                    "#475569",
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
                                    color:
                                      "#2563eb"
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
                        background: "#ffffff",
                        border:
                          "1px solid #e2e8f0",
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
                        📌 Rekomendasi Prioritas
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
                                  "1px solid #e2e8f0",
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
                                      "#eff6ff",
                                    color:
                                      "#2563eb",
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
                                        color:
                                          "#64748b",
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
                                        color:
                                          "#64748b",
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
                      background: "#eff6ff",
                      border:
                        "1px solid #bfdbfe",
                      borderRadius:
                        "16px",
                      padding: "20px",
                      marginBottom: "24px"
                    }}
                  >
                    <strong>
                      💡 Langkah Berikutnya
                    </strong>

                    <p
                      style={{
                        margin:
                          "8px 0 0",
                        color:
                          "#334155",
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
                        "1px solid #cbd5e1",
                      background:
                        "#ffffff",
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
                    🔄 Analisis Ulang
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
                          ? "#94a3b8"
                          : "#2563eb",
                      color: "#ffffff",
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
                    ⚡ Buat Strategi & Tindakan
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
    {!marketData && !marketLoading && !marketError && (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "22px",
          padding: "44px 36px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)"
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>⚖</div>
        <h3 style={{ margin: 0, fontSize: "26px" }}>Perspektif Bisnis</h3>
        <p
          style={{
            color: darkMode ? "#cbd5e1" : "#64748b",
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
            background: darkMode ? "#059669" : "#2563eb",
            color: "#ffffff",
            padding: "14px 24px",
            borderRadius: "11px",
            cursor: "pointer",
            fontWeight: "700"
          }}
        >
          ⚖ Analisis Perspektif Bisnis
        </button>
        <div
          style={{
            marginTop: "18px",
            fontSize: "12px",
            color: darkMode ? "#94a3b8" : "#94a3b8"
          }}
        >
          Informasi eksternal digunakan sebagai bahan analisis, bukan sekadar daftar hasil pencarian.
        </div>
      </div>
    )}

    {marketLoading && (
      <div
        style={{
          background: darkMode ? "#172554" : "#eff6ff",
          border: `1px solid ${darkMode ? "#1D4ED8" : "#bfdbfe"}`,
          borderRadius: "22px",
          padding: "44px",
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: "42px", marginBottom: "14px" }}>⚖</div>
        <h3 style={{ margin: "0 0 8px" }}>ZenAI sedang menyusun perspektif bisnis...</h3>
        <p style={{ color: darkMode ? "#cbd5e1" : "#64748b", lineHeight: "1.6", margin: 0 }}>
          ZenAI mengumpulkan informasi eksternal, menyaring sumber, lalu menghubungkannya dengan konteks usaha Anda.
        </p>
      </div>
    )}

    {!marketLoading && marketError && (
      <div
        style={{
          background: darkMode ? "#3B1212" : "#fef2f2",
          border: `1px solid ${darkMode ? "#7F1D1D" : "#fecaca"}`,
          borderRadius: "20px",
          padding: "28px"
        }}
      >
        <h3 style={{ marginTop: 0, color: darkMode ? "#FCA5A5" : "#991b1b" }}>Perspektif Bisnis belum dapat diperbarui</h3>
        <p style={{ color: darkMode ? "#FECACA" : "#991b1b", lineHeight: "1.6" }}>{marketError}</p>
        <button
          onClick={runMarketInsight}
          style={{ border: "none", background: "#991b1b", color: "#ffffff", padding: "11px 18px", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}
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
            <div style={{ fontSize: "12px", fontWeight: "800", color: darkMode ? "#60A5FA" : "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "5px" }}>
              Business Intelligence
            </div>
            <h3 style={{ margin: 0, fontSize: "24px" }}>⚖ Perspektif Bisnis</h3>
            <p style={{ margin: "6px 0 0", color: darkMode ? "#cbd5e1" : "#64748b", lineHeight: "1.5" }}>
              Insight pasar yang sudah dianalisis dan dikaitkan dengan usaha Anda.
            </p>
          </div>
          <button
            onClick={runMarketInsight}
            disabled={marketLoading}
            style={{
              border: "1px solid #cbd5e1",
              background: darkMode ? "#1F2937" : "#ffffff",
              color: darkMode ? "#F8FAFC" : "#334155",
              padding: "10px 16px",
              borderRadius: "10px",
              cursor: marketLoading ? "not-allowed" : "pointer",
              fontWeight: "700"
            }}
          >
            🔄 Perbarui Perspektif
          </button>
        </div>

        {marketData.analysis && (
          <div style={{ display: "grid", gap: "14px", marginBottom: "22px" }}>
            <div style={{ background: darkMode ? "#111827" : "#ffffff", border: `1px solid ${darkMode ? "#334155" : "#dbeafe"}`, borderRadius: "18px", padding: "22px", boxShadow: "0 8px 24px rgba(37, 99, 235, 0.06)" }}>
              <div style={{ fontSize: "12px", fontWeight: "800", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>🎯 Perspektif Utama</div>
              <p style={{ margin: 0, fontSize: "16px", lineHeight: "1.75", color: darkMode ? "#f8fafc" : "#0f172a" }}>
                {marketData.analysis.businessPerspective || marketData.analysis.summary || "Belum tersedia."}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
              <div style={{ background: darkMode ? "#172033" : "#ffffff", border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, borderRadius: "16px", padding: "20px" }}>
                <div style={{ fontWeight: "800", marginBottom: "8px" }}>📈 Kondisi Pasar</div>
                <p style={{ margin: 0, color: darkMode ? "#cbd5e1" : "#64748b", lineHeight: "1.65" }}>{marketData.analysis.marketCondition || "Belum tersedia."}</p>
              </div>
              <div style={{ background: darkMode ? "#172033" : "#ffffff", border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, borderRadius: "16px", padding: "20px" }}>
                <div style={{ fontWeight: "800", marginBottom: "8px" }}>📊 Sinyal Permintaan</div>
                <p style={{ margin: "0 0 6px", fontWeight: "800" }}>{marketData.analysis.demandSignal?.status || "Tidak pasti"}</p>
                <p style={{ margin: 0, color: darkMode ? "#cbd5e1" : "#64748b", lineHeight: "1.65" }}>{marketData.analysis.demandSignal?.reason || "Belum tersedia."}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
              <div style={{ background: darkMode ? "#0B3B2E" : "#f0fdf4", border: `1px solid ${darkMode ? "#166534" : "#bbf7d0"}`, borderRadius: "16px", padding: "20px" }}>
                <div style={{ fontWeight: "800", color: "#15803d", marginBottom: "10px" }}>💡 Peluang</div>
                {Array.isArray(marketData.analysis.opportunities) && marketData.analysis.opportunities.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.7" }}>
                    {marketData.analysis.opportunities.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                ) : <p style={{ margin: 0 }}>Belum tersedia.</p>}
              </div>
              <div style={{ background: darkMode ? "#422006" : "#fff7ed", border: `1px solid ${darkMode ? "#9A3412" : "#fed7aa"}`, borderRadius: "16px", padding: "20px" }}>
                <div style={{ fontWeight: "800", color: "#c2410c", marginBottom: "10px" }}>⚠ Risiko Utama</div>
                {Array.isArray(marketData.analysis.risks) && marketData.analysis.risks.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.7" }}>
                    {marketData.analysis.risks.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                ) : <p style={{ margin: 0 }}>Belum tersedia.</p>}
              </div>
            </div>

            <div style={{ background: darkMode ? "#172033" : "#f8fafc", border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, borderRadius: "18px", padding: "22px" }}>
              <div style={{ fontWeight: "800", marginBottom: "8px" }}>🚀 Implikasi Strategis</div>
              <p style={{ margin: 0, color: darkMode ? "#e2e8f0" : "#334155", lineHeight: "1.75" }}>
                {marketData.analysis.strategicImplication || "Belum tersedia."}
              </p>
              {marketData.analysis.competitionInsight && (
                <p style={{ margin: "14px 0 0", color: darkMode ? "#cbd5e1" : "#64748b", lineHeight: "1.7" }}>
                  <strong>Persaingan:</strong> {marketData.analysis.competitionInsight}
                </p>
              )}
            </div>

            {marketData.analysis.scenarios && (
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "22px" }}>
                <div style={{ fontWeight: "800", marginBottom: "14px" }}>🧭 Skenario Bisnis</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                  <div style={{ padding: "15px", borderRadius: "12px", background: darkMode ? "#0B3B2E" : "#f0fdf4", color: darkMode ? "#D1FAE5" : "#0F172A" }}><strong>Optimistis</strong><p style={{ margin: "7px 0 0", lineHeight: "1.6" }}>{marketData.analysis.scenarios.optimistic || "-"}</p></div>
                  <div style={{ padding: "15px", borderRadius: "12px", background: darkMode ? "#172554" : "#eff6ff", color: darkMode ? "#DBEAFE" : "#0F172A" }}><strong>Realistis</strong><p style={{ margin: "7px 0 0", lineHeight: "1.6" }}>{marketData.analysis.scenarios.realistic || "-"}</p></div>
                  <div style={{ padding: "15px", borderRadius: "12px", background: darkMode ? "#422006" : "#fff7ed", color: darkMode ? "#FFEDD5" : "#0F172A" }}><strong>Risiko</strong><p style={{ margin: "7px 0 0", lineHeight: "1.6" }}>{marketData.analysis.scenarios.risk || "-"}</p></div>
                </div>
              </div>
            )}

            {marketData.analysis.limitations && (
              <div style={{ fontSize: "12px", color: darkMode ? "#94a3b8" : "#64748b", padding: "0 2px" }}>
                Keterbatasan: {marketData.analysis.limitations}
              </div>
            )}
          </div>
        )}

        {/* SUMBER — bukti, bukan tampilan utama */}
        <details style={{ background: darkMode ? "#172033" : "#ffffff", border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, borderRadius: "16px", padding: "16px 18px" }}>
          <summary style={{ cursor: "pointer", fontWeight: "800" }}>
            📚 Lihat sumber eksternal ({Array.isArray(marketData.sources) ? marketData.sources.length : 0})
          </summary>
          <div style={{ display: "grid", gap: "12px", marginTop: "14px" }}>
            {Array.isArray(marketData.sources) && marketData.sources.length > 0 ? (
              marketData.sources.map((item, index) => (
                <div key={item.url || index} style={{ background: darkMode ? "#111827" : "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "13px", padding: "16px" }}>
                  <h4 style={{ margin: "0 0 7px" }}>{item.title || "Informasi Terkini"}</h4>
                  {item.content && <p style={{ color: darkMode ? "#cbd5e1" : "#64748b", lineHeight: "1.65", margin: "0 0 10px" }}>{item.content}</p>}
                  {item.url && <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: "700", textDecoration: "none" }}>Buka sumber ↗</a>}
                </div>
              ))
            ) : (
              <div style={{ color: darkMode ? "#cbd5e1" : "#64748b", paddingTop: "10px" }}>Belum ditemukan sumber yang cukup relevan.</div>
            )}
          </div>
        </details>
      </>
    )}
  </div>
)}
        {/* =========================
            STRATEGI & TINDAKAN
        ========================== */}


        {/* =========================
            LAPORAN KEUANGAN
        ========================== */}

        {tab === "finance" && (
          <div>
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
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
                    Keuangan Usaha
                  </h3>

                  <p
                    style={{
                      margin: "6px 0 0",
                      color: darkMode ? "#cbd5e1" : "#64748b"
                    }}
                  >
                    Catat transaksi sederhana, ZenAI menyiapkan laporan.
                  </p>
                </div>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}
                >
                  Periode
                  <input
                    type="month"
                    value={financePeriod}
                    onChange={(event) =>
                      setFinancePeriod(event.target.value)
                    }
                    style={{
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      background: "#ffffff",
                      color: "#0f172a"
                    }}
                  />
                </label>
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
                  ["summary", "Ringkasan"],
                  ["transactions", "Input Transaksi"],
                  ["profit", "Laba Rugi"],
                  ["cashflow", "Arus Kas"],
                  ["balance", "Posisi Keuangan"]
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFinanceView(value)}
                    style={{
                      border:
                        financeView === value
                          ? `1px solid ${darkMode ? "#047857" : "#A7F3D0"}`
                          : `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
                      background:
                        financeView === value
                          ? (darkMode ? "#12372F" : "#ECFDF5")
                          : (darkMode ? "#111827" : "#ffffff"),
                      color:
                        financeView === value
                          ? (darkMode ? "#34D399" : "#047857")
                          : (darkMode ? "#E5E7EB" : "#475569"),
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
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  color: "#166534",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  marginBottom: "18px",
                  fontSize: "14px"
                }}
              >
                ✓ {financeMessage}
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
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "20px"
                      }}
                    >
                      <div
                        style={{
                          color: darkMode ? "#cbd5e1" : "#64748b",
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
                              ? "#64748b"
                              : change >= 0
                              ? "#16a34a"
                              : "#dc2626",
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
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "22px"
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>
                    🧠 Insight ZenAI
                  </h3>

                  <p
                    style={{
                      marginBottom: 0,
                      color: darkMode ? "#e2e8f0" : "#475569",
                      lineHeight: "1.7"
                    }}
                  >
                    {financeInsight}
                  </p>
                </section>
              </>
            )}

            {financeView === "transactions" && (
              <>
                <section
                  id="finance-transaction-form"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
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
                          border: "1px solid #cbd5e1",
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
                          border: "1px solid #cbd5e1",
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
                          border: "1px solid #cbd5e1",
                          borderRadius: "10px",
                          background: "#ffffff"
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
                          border: "1px solid #cbd5e1",
                          borderRadius: "10px",
                          background: "#ffffff"
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
                          border: "1px solid #cbd5e1",
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
                              border: "1px solid #cbd5e1",
                              background: "#ffffff",
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
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "22px"
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>
                    Transaksi {financePeriodLabel(financePeriod)}
                  </h3>

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
                                    "1px solid #e2e8f0",
                                  color: darkMode ? "#cbd5e1" : "#64748b",
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
                                    "1px solid #f1f5f9"
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
                                    "1px solid #f1f5f9"
                                }}
                              >
                                {item.description}
                              </td>

                              <td
                                style={{
                                  padding: "12px 8px",
                                  borderBottom:
                                    "1px solid #f1f5f9"
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
                                    "1px solid #f1f5f9",
                                  fontWeight: "700"
                                }}
                              >
                                {formatRupiah(item.amount)}
                              </td>

                              <td
                                style={{
                                  padding: "12px 8px",
                                  borderBottom:
                                    "1px solid #f1f5f9"
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
                                      color: "#1d4ed8",
                                      background: "#eff6ff",
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
                                      color: "#dc2626",
                                      background: "#fff1f2",
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
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "22px"
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  Laba Rugi — {financePeriodLabel(financePeriod)}
                </h3>

                {[
                  ["Pendapatan", financeCurrentTotals.income, true],
                  ["HPP", financeCurrentTotals.hpp, false],
                  ["Laba Kotor", financeCurrentTotals.grossProfit, true],
                  ["Biaya Usaha", financeCurrentTotals.expense, false],
                  ["Laba Bersih", financeCurrentTotals.netProfit, true]
                ].map(([label, value, emphasis]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "20px",
                      padding: "15px 0",
                      borderBottom: "1px solid #f1f5f9",
                      fontWeight:
                        emphasis ? "800" : "500",
                      fontSize:
                        label === "Laba Bersih"
                          ? "18px"
                          : "15px"
                    }}
                  >
                    <span>{label}</span>
                    <span>{formatRupiah(value)}</span>
                  </div>
                ))}
              </section>
            )}

            {financeView === "cashflow" && (
              <section
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "22px"
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  Arus Kas — {financePeriodLabel(financePeriod)}
                </h3>

                {[
                  ["Uang Masuk", financeCurrentTotals.income + financeCurrentTotals.capital + financeCurrentTotals.loan + Math.max(0, financeCurrentTotals.receivable), true],
                  ["Uang Keluar", financeCurrentTotals.hpp + financeCurrentTotals.expense + financeCurrentTotals.withdrawal, false],
                  ["Perubahan Kas", financeCurrentTotals.cashTotal, true],
                  ["Kas & Bank", financeCurrentTotals.cashTotal, true]
                ].map(([label, value, emphasis]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "20px",
                      padding: "15px 0",
                      borderBottom: "1px solid #f1f5f9",
                      fontWeight:
                        emphasis ? "800" : "500"
                    }}
                  >
                    <span>{label}</span>
                    <span>{formatRupiah(value)}</span>
                  </div>
                ))}
              </section>
            )}

            {financeView === "balance" && (
              <section
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "22px"
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  Posisi Keuangan — {financePeriodLabel(financePeriod)}
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
                            "1px solid #f1f5f9"
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
                      ["Utang", financeCurrentTotals.debt],
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
                            "1px solid #f1f5f9"
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
                        ? "#f0fdf4"
                        : "#fff7ed",
                    color:
                      Math.abs(
                        financeCurrentTotals.totalAssets -
                        (
                          financeCurrentTotals.debt +
                          financeCurrentTotals.totalEquity
                        )
                      ) < 1
                        ? "#166534"
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
                    ? "✓ Posisi keuangan seimbang."
                    : "⚠️ Data belum seimbang. Periksa transaksi modal, utang, atau aset."}
                </div>
              </section>
            )}
          </div>
        )}

        {tab === "autopilot" && (
          <div
            style={{
              maxWidth: "1000px"
            }}
          >
            {!autopilotData ? (
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
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
                  ⚡
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
                    color: darkMode ? "#cbd5e1" : "#64748b",
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
                      ? "#94a3b8"
                      : "#2563eb",
                    color: "#ffffff",
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
                    : "⚡ Buat Strategi"}
                </button>
              </div>
            ) : (
              <>
                {/* RINGKASAN STRATEGI */}
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "20px",
                    padding: "28px",
                    marginBottom: "20px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: darkMode ? "#cbd5e1" : "#64748b",
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
                      color: darkMode ? "#e2e8f0" : "#475569",
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
                        background: "#ffffff",
                        border:
                          "1px solid #e2e8f0",
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
                        📅 Rencana 7 Hari
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
                                  "1px solid #e2e8f0",
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
                                      "#eff6ff",
                                    color:
                                      "#2563eb",
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
                                      color:
                                        "#475569",
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
                                        color:
                                          "#64748b"
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
                        background: "#ffffff",
                        border:
                          "1px solid #e2e8f0",
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
                        🗓️ Rencana 14 Hari
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
                                background:
                                  "#f8fafc",
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
                                    color:
                                      "#64748b",
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
                                  color:
                                    "#475569",
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
                        background: "#ffffff",
                        border:
                          "1px solid #e2e8f0",
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
                        🚀 Rencana 30 Hari
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
                                  "1px solid #e2e8f0",
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
                                    color:
                                      "#64748b",
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
                                  color:
                                    "#475569",
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
                        background: "#ffffff",
                        border:
                          "1px solid #e2e8f0",
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
                        🎯 Langkah Prioritas
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
                                background:
                                  "#f8fafc",
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
                                  background:
                                    "#2563eb",
                                  color:
                                    "#ffffff",
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
                                      color:
                                        "#64748b",
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
                      background: "#fff7ed",
                      border:
                        "1px solid #fed7aa",
                      borderRadius:
                        "16px",
                      padding: "20px",
                      marginBottom: "20px"
                    }}
                  >
                    <strong>
                      ⚠️ Hal yang Perlu Diwaspadai
                    </strong>

                    <p
                      style={{
                        margin: "8px 0 0",
                        color: darkMode ? "#e2e8f0" : "#475569",
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
                      background: "#eff6ff",
                      border:
                        "1px solid #bfdbfe",
                      borderRadius:
                        "16px",
                      padding: "20px",
                      marginBottom: "24px"
                    }}
                  >
                    <strong>
                      💡 Langkah Berikutnya
                    </strong>

                    <p
                      style={{
                        margin: "8px 0 0",
                        color: "#334155",
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
                        "1px solid #cbd5e1",
                      background:
                        "#ffffff",
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
                    🔄 Buat Ulang Strategi
                  </button>

                  <button
                    onClick={() =>
                      setTab("pulse")
                    }
                    style={{
                      border: "none",
                      background:
                        "#2563eb",
                      color:
                        "#ffffff",
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
                    📊 Lihat Kondisi Usaha
                  </button>
                </div>
              </>
            )}
          </div>
        )}

            </section>

      <style>{`
        .zenai-dark {
          background: #0b1120 !important;
          color: #f8fafc !important;
          color-scheme: dark;
        }

        .zenai-dark .zenai-content {
          color: #f8fafc !important;
        }

        .zenai-dark .zenai-sidebar {
          background: #111827 !important;
          border-color: #334155 !important;
        }

        .zenai-dark h1,
        .zenai-dark h2,
        .zenai-dark h3,
        .zenai-dark h4,
        .zenai-dark h5,
        .zenai-dark h6,
        .zenai-dark strong {
          color: #f8fafc !important;
        }

        .zenai-dark .zenai-page-header p {
          color: #cbd5e1 !important;
        }

        .zenai-dark [style*="#ffffff"],
        .zenai-dark [style*="#fff"],
        .zenai-dark [style*="rgb(255, 255, 255)"] {
          background: #111827 !important;
          color: #f8fafc !important;
        }

        .zenai-dark [style*="#f8fafc"],
        .zenai-dark [style*="rgb(248, 250, 252)"] {
          background: #0b1120 !important;
        }

        .zenai-dark [style*="#f1f5f9"],
        .zenai-dark [style*="rgb(241, 245, 249)"] {
          background: #172033 !important;
        }

        .zenai-dark [style*="#eff6ff"],
        .zenai-dark [style*="rgb(239, 246, 255)"] {
          background: #172554 !important;
        }

        .zenai-dark [style*="#0f172a"],
        .zenai-dark [style*="rgb(15, 23, 42)"] {
          color: #f8fafc !important;
        }

        .zenai-dark [style*="#334155"],
        .zenai-dark [style*="rgb(51, 65, 85)"] {
          color: #f1f5f9 !important;
        }

        .zenai-dark [style*="#475569"],
        .zenai-dark [style*="rgb(71, 85, 105)"] {
          color: #e2e8f0 !important;
        }

        .zenai-dark [style*="#64748b"],
        .zenai-dark [style*="rgb(100, 116, 139)"] {
          color: #cbd5e1 !important;
        }

        .zenai-dark [style*="#94a3b8"],
        .zenai-dark [style*="rgb(148, 163, 184)"] {
          color: #cbd5e1 !important;
        }

        .zenai-dark [style*="#e2e8f0"],
        .zenai-dark [style*="rgb(226, 232, 240)"],
        .zenai-dark [style*="#e8edf3"],
        .zenai-dark [style*="#cbd5e1"],
        .zenai-dark [style*="rgb(203, 213, 225)"] {
          border-color: #334155 !important;
        }

        .zenai-dark input,
        .zenai-dark textarea,
        .zenai-dark select {
          background: #0f172a !important;
          color: #f8fafc !important;
          border-color: #475569 !important;
          color-scheme: dark;
        }

        .zenai-dark input::placeholder,
        .zenai-dark textarea::placeholder {
          color: #94a3b8 !important;
        }

        .zenai-dark option {
          background: #0f172a;
          color: #f8fafc;
        }

        @media (max-width: 768px) {
          .zenai-app {
            width: 100vw !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
          }

          .zenai-sidebar {
            flex-shrink: 0 !important;
            overflow: hidden !important;
          }

          .zenai-content {
            min-width: 0 !important;
            overflow-x: hidden !important;
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>

    </main>
  );
}
