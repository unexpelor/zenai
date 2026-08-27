"use client";

import { useEffect, useRef, useState } from "react";
export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

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

  const [businessUpdates, setBusinessUpdates] =
    useState([]);

  const [updateText, setUpdateText] =
    useState("");

  const [days, setDays] = useState(7);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

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


  const askAI = async ({
    prompt,
    system = ""
  }) => {
    const response = await fetch(
      "/api/ai",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
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
          "Content-Type":
            "application/json",
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

      setBusiness(null);
      setDiagnosis(null);
      setPulseData(null);

      setBusinessUpdates([]);
      setUpdateText("");

      setAutopilotData(null);

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
    return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        display: "flex",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* SIDEBAR */}
      <aside
  style={{
    width: sidebarOpen ? "280px" : "72px",
    minWidth: sidebarOpen ? "280px" : "72px",
    minHeight: "100vh",
    background: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    padding: sidebarOpen ? "24px 16px" : "24px 10px",
    position: "sticky",
    top: 0,
    alignSelf: "flex-start",
    boxSizing: "border-box",
    overflow: "hidden",
    transition: "width 0.3s ease, min-width 0.3s ease, padding 0.3s ease"
  }}
        >
  <button
    onClick={() => setSidebarOpen(!sidebarOpen)}
    title={
      sidebarOpen
        ? "Tutup menu"
        : "Buka menu"
    }
    style={{
      width: "100%",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: "8px 10px",
      marginBottom: "12px",
      fontSize: "22px",
      textAlign: sidebarOpen
        ? "right"
        : "center",
      color: "#334155"
    }}
  >
    ☰
  </button>
        {/* LOGO */}
<div
  style={{
    padding: "8px 12px 28px"
  }}
>
  <h1
    style={{
      margin: 0,
      fontSize: "28px",
      letterSpacing: "-1px"
    }}
  >
    ZENAI
  </h1>

  <p
    style={{
      margin: "6px 0 0",
      color: "#64748b",
      fontSize: "13px",
      lineHeight: "1.5"
    }}
  >
    AI Partner untuk memahami,
    menganalisis, dan mengembangkan usaha.
  </p>
</div>

        {/* NAVIGASI */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px"
          }}
        >
          <button
  onClick={() => setTab("home")}
  title={sidebarOpen ? "" : "Dashboard"}
  style={{
    width: "100%",
    border: "none",
    padding: "12px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: sidebarOpen
      ? "flex-start"
      : "center",
    gap: sidebarOpen ? "10px" : "0",
    textAlign: sidebarOpen ? "left" : "center",
    background:
      tab === "home"
        ? "#eff6ff"
        : "transparent",
    color:
      tab === "home"
        ? "#2563eb"
        : "#475569",
    fontWeight:
      tab === "home"
        ? "700"
        : "500",
    transition: "all 0.2s ease"
  }}
>
  <span
    style={{
      fontSize: "18px",
      flexShrink: 0
    }}
  >
    🏠
  </span>

  {sidebarOpen && (
    <span>
      Dashboard
    </span>
  )}
</button>

          <button
  onClick={() => setTab("capture")}
  title={sidebarOpen ? "" : "Ceritakan Usaha"}
  style={{
    width: "100%",
    border: "none",
    padding: "12px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: sidebarOpen
      ? "flex-start"
      : "center",
    gap: sidebarOpen ? "10px" : "0",
    textAlign: sidebarOpen ? "left" : "center",
    background:
      tab === "capture"
        ? "#eff6ff"
        : "transparent",
    color:
      tab === "capture"
        ? "#2563eb"
        : "#475569",
    fontWeight:
      tab === "capture"
        ? "700"
        : "500",
    transition: "all 0.2s ease"
  }}
>
  <span
    style={{
      fontSize: "18px",
      flexShrink: 0
    }}
  >
    ✨
  </span>

  {sidebarOpen && (
    <span>
      Ceritakan Usaha
    </span>
  )}
</button>

          <button
  onClick={() => setTab("business")}
  title={sidebarOpen ? "" : "Kondisi Usaha"}
  style={{
    width: "100%",
    border: "none",
    padding: "12px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: sidebarOpen
      ? "flex-start"
      : "center",
    gap: sidebarOpen ? "10px" : "0",
    textAlign: sidebarOpen ? "left" : "center",
    background:
      tab === "business"
        ? "#eff6ff"
        : "transparent",
    color:
      tab === "business"
        ? "#2563eb"
        : "#475569",
    fontWeight:
      tab === "business"
        ? "700"
        : "500",
    transition: "all 0.2s ease"
  }}
>
  <span
    style={{
      fontSize: "18px",
      flexShrink: 0
    }}
  >
    📊
  </span>

  {sidebarOpen && (
    <span>
      Kondisi Usaha
    </span>
  )}
</button>

          <button
  onClick={() => setTab("diagnosis")}
  title={sidebarOpen ? "" : "Diagnosis"}
  style={{
    width: "100%",
    border: "none",
    padding: "12px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: sidebarOpen
      ? "flex-start"
      : "center",
    gap: sidebarOpen ? "10px" : "0",
    textAlign: sidebarOpen ? "left" : "center",
    background:
      tab === "diagnosis"
        ? "#eff6ff"
        : "transparent",
    color:
      tab === "diagnosis"
        ? "#2563eb"
        : "#475569",
    fontWeight:
      tab === "diagnosis"
        ? "700"
        : "500",
    transition: "all 0.2s ease"
  }}
>
  <span
    style={{
      fontSize: "18px",
      flexShrink: 0
    }}
  >
    🔍
  </span>

  {sidebarOpen && (
    <span>
      Diagnosis
    </span>
  )}
</button>
<button
  onClick={() => {
    if (!business) {
      alert("Analisis usaha terlebih dahulu.");
      setTab("capture");
      return;
    }

    setTab("market");
  }}
  title={sidebarOpen ? "" : "Perspektif Bisnis"}
  style={{
    width: "100%",
    border: "none",
    padding: "12px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: sidebarOpen
      ? "flex-start"
      : "center",
    gap: sidebarOpen ? "10px" : "0",
    textAlign: sidebarOpen ? "left" : "center",
    background:
      tab === "market"
        ? "#eff6ff"
        : "transparent",
    color:
      tab === "market"
        ? "#2563eb"
        : "#475569",
    fontWeight:
      tab === "market"
        ? "700"
        : "500",
    transition: "all 0.2s ease"
  }}
>
  <span
    style={{
      fontSize: "18px",
      flexShrink: 0
    }}
  >
    🔭
  </span>

  {sidebarOpen && (
    <span>
      Perspektif Bisnis
    </span>
  )}
</button>
              
          <button
  onClick={() => {
    if (!business) {
      alert("Analisis usaha terlebih dahulu.");
      setTab("capture");
      return;
    }

    setTab("autopilot");
  }}
  title={sidebarOpen ? "" : "Strategi & Tindakan"}
  style={{
    width: "100%",
    border: "none",
    padding: "12px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: sidebarOpen
      ? "flex-start"
      : "center",
    gap: sidebarOpen ? "10px" : "0",
    textAlign: sidebarOpen ? "left" : "center",
    background:
      tab === "autopilot"
        ? "#eff6ff"
        : "transparent",
    color:
      tab === "autopilot"
        ? "#2563eb"
        : "#475569",
    fontWeight:
      tab === "autopilot"
        ? "700"
        : "500",
    transition: "all 0.2s ease"
  }}
>
  <span
    style={{
      fontSize: "18px",
      flexShrink: 0
    }}
  >
    ⚡
  </span>

  {sidebarOpen && (
    <span>
      Strategi & Tindakan
    </span>
  )}
</button>
        </nav>

        {/* AREA BAWAH SIDEBAR */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "30px"
          }}
        >
          {business && (
            <button
              onClick={resetAnalysis}
              style={{
                width: "100%",
                border:
                  "1px solid #fecaca",
                background: "#fff",
                color: "#dc2626",
                padding: "11px 12px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              ↻ Mulai Analisis Baru
            </button>
          )}
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <section
        style={{
          flex: 1,
          minWidth: 0,
          padding: "32px",
          boxSizing: "border-box"
        }}
      >
        {/* HEADER */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px"
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "28px"
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

{tab === "market" &&
  "Perspektif Bisnis"}
            </h2>

            <p
              style={{
                margin: "8px 0 0",
                color: "#64748b",
                fontSize: "14px"
              }}
            >
              {provider
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
                    color: "#64748b",
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
                          color: "#64748b",
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
                          color: "#64748b",
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
                          color: "#64748b"
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
                          color: "#64748b"
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
                          color: "#64748b"
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
                        color: "#64748b",
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
                        color: "#64748b",
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
                        color: "#64748b",
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
                  color: "#64748b",
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
                    color: "#64748b",
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
                          color: "#64748b"
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
                    color: "#64748b",
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
                          color: "#64748b",
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
                          color: "#64748b",
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
                                  "Hal Positif"}
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
                                    "#475569",
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
                      color: "#64748b",
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
                    color: "#64748b",
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
                      color: "#64748b",
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
                      color: "#475569",
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
                          color: "#475569"
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
                                    "#475569",
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
                                  "1px solid #fecaca",
                                background:
                                  "#fef2f2",
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
                                  "1px solid #bfdbfe",
                                background:
                                  "#eff6ff",
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
  <div
    style={{
      maxWidth: "1000px"
    }}
  >
    {!marketData &&
      !marketLoading &&
      !marketError && (
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
            🔭
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: "24px"
            }}
          >
            Perspektif Bisnis
          </h3>

          <p
            style={{
              color: "#64748b",
              maxWidth: "580px",
              margin: "12px auto 24px",
              lineHeight: "1.6"
            }}
          >
            ZENAI akan melihat perkembangan,
            tren, peluang, risiko, dan informasi
            terbaru dari luar yang relevan dengan
            usaha Anda.
          </p>

          <button
            onClick={runMarketInsight}
            style={{
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              padding: "14px 22px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "700"
            }}
          >
            🔭 Lihat Perspektif Bisnis
          </button>
        </div>
      )}

    {marketLoading && (
      <div
        style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "20px",
          padding: "40px",
          textAlign: "center"
        }}
      >
        <div
          style={{
            fontSize: "42px",
            marginBottom: "14px"
          }}
        >
          🔭
        </div>

        <h3>
          ZENAI sedang mencari informasi terbaru...
        </h3>

        <p
          style={{
            color: "#64748b",
            lineHeight: "1.6"
          }}
        >
          Mengumpulkan informasi eksternal
          yang relevan dengan kondisi usaha Anda.
        </p>
      </div>
    )}

    {!marketLoading &&
      marketError && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "20px",
            padding: "28px"
          }}
        >
          <h3
            style={{
              marginTop: 0,
              color: "#991b1b"
            }}
          >
            Perspektif Bisnis belum dapat diperbarui
          </h3>

          <p
            style={{
              color: "#991b1b"
            }}
          >
            {marketError}
          </p>

          <button
            onClick={runMarketInsight}
            style={{
              border: "none",
              background: "#991b1b",
              color: "#ffffff",
              padding: "11px 18px",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            Coba Lagi
          </button>
        </div>
      )}

    {!marketLoading &&
      !marketError &&
      marketData && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "20px"
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0
                }}
              >
                🌍 Perspektif Eksternal
              </h3>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#64748b"
                }}
              >
                Informasi terbaru yang relevan
                dengan usaha Anda.
              </p>
            </div>

            <button
              onClick={runMarketInsight}
              disabled={marketLoading}
              style={{
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#334155",
                padding: "10px 16px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              🔄 Perbarui
            </button>
          </div>

          {Array.isArray(marketData.sources) &&
          marketData.sources.length > 0 ? (
            <div
              style={{
                display: "grid",
                gap: "14px"
              }}
            >
              {marketData.sources.map(
                (item, index) => (
                  <div
                    key={item.url || index}
                    style={{
                      background: "#ffffff",
                      border:
                        "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "22px"
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 10px"
                      }}
                    >
                      {item.title ||
                        "Informasi Terkini"}
                    </h3>

                    {item.content && (
                      <p
                        style={{
                          color: "#64748b",
                          lineHeight: "1.7",
                          marginBottom: "14px"
                        }}
                      >
                        {item.content}
                      </p>
                    )}

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#2563eb",
                          fontWeight: "600",
                          textDecoration: "none"
                        }}
                      >
                        Buka sumber ↗
                      </a>
                    )}
                  </div>
                )
              )}
            </div>
          ) : (
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "30px",
                textAlign: "center",
                color: "#64748b"
              }}
            >
              Belum ditemukan informasi yang
              cukup relevan. Silakan perbarui kembali.
            </div>
          )}
        </>
      )}
  </div>
)}
        {/* =========================
            STRATEGI & TINDAKAN
        ========================== */}

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
                    color: "#64748b",
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
                      color: "#64748b",
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
                      color: "#475569",
                      lineHeight: "1.7"
                    }}
                  >
                    {autopilotData.summary ||
                      "ZENAI telah membuat strategi berdasarkan kondisi usaha Anda."}
                  </p>
                </div>


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
                        color: "#475569",
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
    </main>
  );
}
