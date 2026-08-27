"use client";

import { useRef, useState } from "react";

export default function Home() {

  const [tab, setTab] =
    useState("command");

  const [text, setText] =
    useState("");

  const [image, setImage] =
    useState("");

  const [audio, setAudio] =
    useState("");

  const [audioMimeType, setAudioMimeType] =
    useState("");

  const [audioName, setAudioName] =
    useState("");

  const [isRecording, setIsRecording] =
    useState(false);

  const [recordingTime, setRecordingTime] =
    useState(0);

  const [business, setBusiness] =
    useState(null);

  const [diagnosis, setDiagnosis] =
    useState(null);

  const [pulseData, setPulseData] =
    useState(null);

  const [businessUpdates, setBusinessUpdates] =
    useState([]);

  const [updateText, setUpdateText] =
    useState("");

  const [autopilotData, setAutopilotData] =
    useState(null);

  const [busy, setBusy] =
    useState(false);

  const [provider, setProvider] =
    useState("");

  const [days, setDays] =
    useState(7);

  const mediaRecorderRef =
    useRef(null);

  const mediaStreamRef =
    useRef(null);

  const audioChunksRef =
    useRef([]);

  const recordingTimerRef =
    useRef(null);

  const audioInputRef =
    useRef(null);

const getBusinessContext = () => {
  return {
    ...business,

    updates: businessUpdates.map((item) => ({
      id: item.id,

      text: item.text,

      createdAt:
        item.createdAt ||
        item.date ||
        null,

      pulse:
        item.pulse || null,
    })),

    latestUpdate:
      businessUpdates.length > 0
        ? {
            id: businessUpdates[0].id,

            text: businessUpdates[0].text,

            createdAt:
              businessUpdates[0].createdAt ||
              businessUpdates[0].date ||
              null,

            pulse:
              businessUpdates[0].pulse || null,
          }
        : null,
  };
};

 const formatError = (value) => {
  // isi kode formatError kamu
};


// TAMBAHKAN KODE INI DI SINI
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
    unknown: "⚪ Tidak diketahui",
  };

  return (
    statusMap[normalized] ||
    (status
      ? String(status)
      : "⚪ Belum diketahui")
  );
};


// SETELAH INI BIARKAN KODE LAMA
const askAI = async (payload) => {


  const askAI = async (payload) => {

    const response =
      await fetch(
        "/api/ai",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(payload),
        }
      );

    const result =
      await response.json();

    if (!response.ok) {

      throw new Error(
        [
          formatError(
            result.message
          ) ||
          "AI gagal memproses permintaan.",

          formatError(
            result.details
          ),

          result.error
            ?
            `Error: ${formatError(result.error)}`
            :
            ""
        ]
        .filter(Boolean)
        .join("\n\n")
      );

    }

    setProvider(
      result.provider || ""
    );

    return result.text;

  };


  const extractJson = (rawResult) => {

    const clean =
      String(rawResult || "")
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start =
      clean.indexOf("{");

    const end =
      clean.lastIndexOf("}");

    if (
      start === -1 ||
      end === -1
    ) {

      throw new Error(
        "AI tidak mengembalikan JSON valid."
      );

    }

    return JSON.parse(
      clean.substring(
        start,
        end + 1
      )
    );

  };


  const fileToBase64 = (file) =>
    new Promise(
      (resolve, reject) => {

        const reader =
          new FileReader();

        reader.onload = () => {
          resolve(
            reader.result
          );
        };

        reader.onerror = () => {
          reject(
            new Error(
              "Gagal membaca file."
            )
          );
        };

        reader.readAsDataURL(file);

      }
    );


  const handleImage = async (event) => {

    const file =
      event.target.files?.[0];

    if (!file)
      return;

    if (
      !file.type.startsWith("image/")
    ) {

      alert(
        "File harus berupa gambar."
      );

      return;

    }

    try {

      setImage(
        await fileToBase64(file)
      );

    } catch (error) {

      alert(
        formatError(error) ||
        "Gagal membaca gambar."
      );

    }

  };


  const handleAudio = async (event) => {

    const file =
      event.target.files?.[0];

    if (!file)
      return;

    if (
      !file.type.startsWith("audio/")
    ) {

      alert(
        "File yang dipilih bukan audio."
      );

      return;

    }

    try {

      setAudio(
        await fileToBase64(file)
      );

      setAudioMimeType(
        file.type ||
        "audio/webm"
      );

      setAudioName(
        file.name ||
        "Voice Note"
      );

    } catch (error) {

      alert(
        formatError(error) ||
        "Gagal membaca voice note."
      );

    }

  };


  const clearAudio = () => {

    setAudio("");

    setAudioMimeType("");

    setAudioName("");

    setRecordingTime(0);

    if (audioInputRef.current) {

      audioInputRef.current.value = "";

    }

  };


  const formatRecordingTime = (seconds) => {

    const minutes =
      Math.floor(
        seconds / 60
      );

    const remaining =
      seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;

  };


  const stopMicrophone = () => {

    if (mediaStreamRef.current) {

      mediaStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      mediaStreamRef.current = null;

    }

  };


  const startRecording = async () => {

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {

      alert(
        "Browser ini tidak mendukung perekaman audio."
      );

      return;

    }

    if (
      typeof MediaRecorder === "undefined"
    ) {

      alert(
        "MediaRecorder tidak didukung."
      );

      return;

    }

    try {

      clearAudio();

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      mediaStreamRef.current =
        stream;

      const types = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
      ];

      const supportedType =
        types.find(
          (type) =>
            MediaRecorder.isTypeSupported(
              type
            )
        );

      const recorder =
        new MediaRecorder(
          stream,
          supportedType
            ?
            {
              mimeType:
                supportedType,
            }
            :
            {}
        );

      mediaRecorderRef.current =
        recorder;

      audioChunksRef.current = [];

      recorder.ondataavailable =
        (event) => {

          if (
            event.data &&
            event.data.size > 0
          ) {

            audioChunksRef.current.push(
              event.data
            );

          }

        };


      recorder.onstop =
        async () => {

          try {

            clearInterval(
              recordingTimerRef.current
            );

            setIsRecording(false);

            const mimeType =
              recorder.mimeType ||
              "audio/webm";

            const blob =
              new Blob(
                audioChunksRef.current,
                {
                  type: mimeType,
                }
              );

            const extension =
              mimeType.includes("ogg")
                ?
                "ogg"
                :
                "webm";

            const file =
              new File(
                [
                  blob
                ],
                `zenai-vn-${Date.now()}.${extension}`,
                {
                  type: mimeType,
                }
              );

            setAudio(
              await fileToBase64(file)
            );

            setAudioMimeType(
              mimeType
            );

            setAudioName(
              "Voice Note ZENAI"
            );

          } catch (error) {

            alert(
              formatError(error)
            );

          } finally {

            stopMicrophone();

          }

        };


      recorder.start();

      setRecordingTime(0);

      setIsRecording(true);

      recordingTimerRef.current =
        setInterval(
          () => {

            setRecordingTime(
              (current) =>
                current + 1
            );

          },
          1000
        );

    } catch (error) {

      alert(
        "Gagal mengakses mikrofon."
      );

      setIsRecording(false);

      stopMicrophone();

    }

  };


  const stopRecording = () => {

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !==
      "inactive"
    ) {

      mediaRecorderRef.current.stop();

    }

    clearInterval(
      recordingTimerRef.current
    );

  };


  const analyzeBusiness =
    async () => {

      if (
        !text.trim() &&
        !image &&
        !audio
      ) {

        alert(
          "Masukkan teks, gambar, atau voice note."
        );

        return;

      }

      setBusy(true);

      try {

        const prompt = `

Analisis informasi UMKM berikut.

INFORMASI TEKS:
${text.trim() || "Tidak ada"}

${
  audio
    ?
    `
VOICE NOTE:
Gunakan isi voice note sebagai informasi tambahan bisnis.
`
    :
    ""
}

${
  image
    ?
    `
GAMBAR:
Analisis produk dari gambar yang tersedia.
`
    :
    ""
}

Jangan membuat informasi yang tidak tersedia.

Balas JSON:

{
  "product": "",
  "description": "",
  "price": "",
  "target": "",
  "problem": "",
  "opportunity": "",
  "keywords": [],
  "visualSummary": "",
  "nextStep": ""
}

`;

        const raw =
          await askAI(
            {
              prompt,

              image,

              audio,

              audioMimeType,

              system: `

Anda adalah AI Business Analyst UMKM Indonesia.

Analisis hanya berdasarkan data yang diberikan.

Jangan membuat angka palsu,
persentase,
omzet,
atau fakta yang tidak ada.

Balas JSON valid.
`
            }
          );

        const parsed =
          extractJson(raw);

        setBusiness(
          parsed
        );

        setDiagnosis(null);

        setAutopilotData(null);

        setTab(
          "command"
        );

      } catch (error) {

        alert(
          formatError(error)
        );

      } finally {

        setBusy(false);

      }

    };

    const runDiagnosis = async (
    contextOverride = null,
    options = {}
  ) => {
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
        "Ceritakan usaha terlebih dahulu."
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

Buat Diagnosis Usaha berdasarkan
KONDISI USAHA TERBARU berikut:

${JSON.stringify(
  context,
  null,
  2
)}

PENTING:

1. Gunakan data usaha awal sebagai dasar.
2. Gunakan seluruh riwayat pembaruan usaha.
3. Pembaruan terbaru menggambarkan kondisi
   usaha saat ini.
4. Jika pembaruan terbaru mengubah kondisi
   sebelumnya, sesuaikan hasil diagnosis.
5. Jangan mempertahankan kesimpulan lama jika
   sudah tidak sesuai dengan informasi terbaru.
6. Fokus pada kondisi usaha saat ini.

Gunakan format:

{
  "summary": "",

  "problems": [
    {
      "title": "",
      "description": "",
      "cause": "",
      "level": ""
    }
  ],

  "rootCauses": [
    ""
  ],

  "strengths": [
    {
      "title": "",
      "description": ""
    }
  ],

  "opportunity": {
    "summary": "",
    "recommendations": [
      ""
    ]
  },

  "dataUsed": [
    ""
  ]
}

Jangan membuat angka, persentase,
omzet, atau fakta yang tidak tersedia.

`;

    const raw =
      await askAI({
        prompt,

        system: `

Anda adalah Business Diagnosis Engine
ZENAI.

Tugas Anda adalah membuat diagnosis berdasarkan
kondisi usaha TERBARU.

Riwayat pembaruan harus diperhitungkan.

Gunakan bahasa Indonesia yang mudah
dipahami oleh pemilik usaha.

Jangan mengarang data.

Balas JSON valid.

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
    const runPulse = async (
    contextOverride = null,
    options = {}
  ) => {
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
        "Ceritakan usaha terlebih dahulu."
      );

      setTab("capture");

      return;
    }

    const context =
      contextOverride ||
      getBusinessContext();

    const {
      diagnosisOverride = null,
      silent = false,
      goToTab = true
    } = options;

    const latestDiagnosis =
      diagnosisOverride || diagnosis;

    if (!silent) {
      setBusy(true);
    }

    try {

    const prompt = `

Buat analisis KONDISI USAHA TERBARU.

DATA USAHA DAN PEMBARUAN:

${JSON.stringify(
  context,
  null,
  2
)}

${
  latestDiagnosis
    ? `
HASIL DIAGNOSIS TERBARU:

${JSON.stringify(
  latestDiagnosis,
  null,
  2
)}
`
    : ""
}

PENTING:

1. Data awal menjelaskan kondisi dasar usaha.
2. Riwayat pembaruan menunjukkan perubahan
   yang terjadi.
3. Pembaruan terbaru adalah informasi paling
   baru tentang kondisi usaha.
4. Jika terjadi perubahan kondisi, hasil Pulse
   harus mencerminkan kondisi terbaru.
5. Jangan hanya mengulang kondisi lama.

Balas JSON:

{
  "summary": "",
  "condition": "",

  "highlights": [
    {
      "title": "",
      "description": "",
      "status": ""
    }
  ],

  "attention": [
    ""
  ],

  "strengths": [
    ""
  ],

  "opportunities": [
    ""
  ],

  "nextFocus": ""
}

Jangan membuat angka, persentase,
omzet, pertumbuhan, atau tren statistik
jika tidak tersedia.

`;

    const raw =
      await askAI({
        prompt,

        system: `

Anda adalah Business Pulse Engine ZENAI.

Analisis harus menggambarkan KONDISI USAHA
SAAT INI, bukan hanya kondisi awal.

Prioritaskan informasi dari pembaruan terbaru,
tetapi tetap gunakan informasi sebelumnya
sebagai konteks.

Gunakan bahasa Indonesia yang mudah dipahami.

Jangan mengarang data.

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


    const runAutopilot = async (
    contextOverride = null,
    options = {}
  ) => {
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
        "Ceritakan usaha terlebih dahulu."
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

Buat strategi dan rencana tindakan berdasarkan
KONDISI USAHA TERBARU.

DATA USAHA:

${JSON.stringify(
  context,
  null,
  2
)}

${
  latestDiagnosis
    ? `
DIAGNOSIS TERBARU:

${JSON.stringify(
  latestDiagnosis,
  null,
  2
)}
`
    : ""
}

${
  latestPulse
    ? `
KONDISI USAHA TERBARU:

${JSON.stringify(
  latestPulse,
  null,
  2
)}
`
    : ""
}

PENTING:

1. Gunakan informasi terbaru sebagai dasar.
2. Jika terdapat pembaruan usaha, strategi lama
   harus disesuaikan.
3. Jangan membuat strategi berdasarkan kondisi
   lama jika kondisi usaha sudah berubah.
4. Prioritaskan masalah yang paling relevan saat ini.

Balas JSON:

{
  "summary": "",

  "priority": [
    {
      "title": "",
      "reason": "",
      "action": ""
    }
  ],

  "quickActions": [
    {
      "title": "",
      "description": ""
    }
  ],

  "plan7": [
    {
      "day": "",
      "title": "",
      "action": ""
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

Jangan membuat angka target, omzet,
persentase, atau estimasi keuntungan
tanpa data pendukung.

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
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
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
      setAudioMimeType("");
      setAudioName("");

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


      /*
        Kembali ke kondisi terbaru
      */

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
          type: "Lihat Kondisi Usaha",
          description:
            pulseData.summary ||
            "Analisis kondisi usaha telah dibuat.",
          date:
            "Selesai"
        });

      }

      if (diagnosis) {

        history.push({
          type: "Diagnosis Usaha",
          description:
            diagnosis.summary ||
            "Diagnosis usaha telah dibuat.",
          date:
            "Selesai"
        });

      }

      if (autopilotData) {

        history.push({
          type: "Strategi & Tindakan",
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
        fontFamily:
          "Arial, sans-serif"
      }}
    >
      <aside
        style={{
          width: "280px",
          minHeight: "100vh",
          background: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          padding: "24px 16px",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          boxSizing: "border-box"
        }}
      >
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
              fontSize: "13px",
              color: "#64748b"
            }}
          >
            Analisis cerdas untuk usaha Anda
          </p>
        </div>


        {/* MENU UTAMA */}
        <div
          style={{
            marginBottom: "24px"
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#94a3b8",
              letterSpacing: "1px",
              padding: "0 12px",
              marginBottom: "8px"
            }}
          >
            UTAMA
          </p>

          <button
            onClick={() => setTab("command")}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              background:
                tab === "command"
                  ? "#eff6ff"
                  : "transparent",
              color:
                tab === "command"
                  ? "#2563eb"
                  : "#475569",
              fontWeight:
                tab === "command"
                  ? "700"
                  : "500",
              marginBottom: "4px"
            }}
          >
            🏠 Beranda
          </button>
        </div>


        {/* ANALISIS USAHA */}
        <div
          style={{
            marginBottom: "24px"
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#94a3b8",
              letterSpacing: "1px",
              padding: "0 12px",
              marginBottom: "8px"
            }}
          >
            ANALISIS USAHA
          </p>


          <button
            onClick={() => setTab("pulse")}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              background:
                tab === "pulse"
                  ? "#eff6ff"
                  : "transparent",
              color:
                tab === "pulse"
                  ? "#2563eb"
                  : "#475569",
              fontWeight:
                tab === "pulse"
                  ? "700"
                  : "500",
              marginBottom: "4px"
            }}
          >
            <div>
              📊 Lihat Kondisi Usaha
            </div>

            <div
              style={{
                fontSize: "11px",
                opacity: "0.7",
                marginTop: "3px",
                paddingLeft: "24px"
              }}
            >
              Business Pulse
            </div>
          </button>


          <button
            onClick={() => setTab("diagnosis")}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
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
              marginBottom: "4px"
            }}
          >
            <div>
              🔍 Diagnosis Usaha
            </div>

            <div
              style={{
                fontSize: "11px",
                opacity: "0.7",
                marginTop: "3px",
                paddingLeft: "24px"
              }}
            >
              Business Diagnosis
            </div>
          </button>


          <button
            onClick={() => setTab("autopilot")}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
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
              marginBottom: "4px"
            }}
          >
            <div>
              ⚡ Strategi & Tindakan
            </div>

            <div
              style={{
                fontSize: "11px",
                opacity: "0.7",
                marginTop: "3px",
                paddingLeft: "24px"
              }}
            >
              Business Autopilot
            </div>
          </button>
        </div>


        {/* WAWASAN PASAR */}
        <div
          style={{
            marginBottom: "24px"
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#94a3b8",
              letterSpacing: "1px",
              padding: "0 12px",
              marginBottom: "8px"
            }}
          >
            WAWASAN PASAR
          </p>


          <button
            onClick={() => setTab("market")}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
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
              marginBottom: "4px"
            }}
          >
            🌐 Market Sync
          </button>


          <button
            onClick={() => setTab("opportunity")}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              background:
                tab === "opportunity"
                  ? "#eff6ff"
                  : "transparent",
              color:
                tab === "opportunity"
                  ? "#2563eb"
                  : "#475569",
              fontWeight:
                tab === "opportunity"
                  ? "700"
                  : "500",
              marginBottom: "4px"
            }}
          >
            📈 Peluang & Tren
          </button>
        </div>


        {/* AKTIVITAS */}
        <div>
          <p
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#94a3b8",
              letterSpacing: "1px",
              padding: "0 12px",
              marginBottom: "8px"
            }}
          >
            AKTIVITAS
          </p>

          <button
            onClick={() => setTab("history")}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              background:
                tab === "history"
                  ? "#eff6ff"
                  : "transparent",
              color:
                tab === "history"
                  ? "#2563eb"
                  : "#475569",
              fontWeight:
                tab === "history"
                  ? "700"
                  : "500"
            }}
          >
            🗂️ Riwayat Analisis
          </button>
        </div>


        {/* STATUS AI */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "16px",
            right: "16px",
            padding: "14px",
            background: "#f8fafc",
            borderRadius: "12px",
            fontSize: "12px",
            color: "#64748b"
          }}
        >
          <div
            style={{
              color: "#16a34a",
              fontWeight: "700",
              marginBottom: "4px"
            }}
          >
            ● ZENAI Siap
          </div>

          {provider
            ? `AI: ${provider}`
            : "Siap membantu menganalisis usaha Anda."
          }
        </div>
      </aside>


      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: "40px",
          boxSizing: "border-box",
          maxWidth: "1400px"
        }}
      >


        {/* =========================
            BERANDA
        ========================= */}

        {tab === "command" && (
          <section>

            <div
              style={{
                marginBottom: "32px"
              }}
            >
              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "32px"
                }}
              >
                Selamat datang di ZENAI 👋
              </h2>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  maxWidth: "720px"
                }}
              >
                Ceritakan usaha Anda atau pilih analisis
                yang ingin dilakukan. ZENAI membantu Anda
                memahami kondisi usaha, menemukan masalah,
                melihat peluang, dan menentukan langkah
                selanjutnya.
              </p>
            </div>


            {/* RINGKASAN DATA */}
            {business && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "16px",
                  marginBottom: "28px"
                }}
              >
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "18px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "6px"
                    }}
                  >
                    USAHA
                  </div>

                  <strong>
                    {business.product ||
                      "Usaha Anda"}
                  </strong>
                </div>


                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "18px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "6px"
                    }}
                  >
                    KONDISI
                  </div>

                  <strong>
                    {pulseData
                      ? pulseData.condition ||
                        "Sudah dianalisis"
                      : "Belum dianalisis"}
                  </strong>
                </div>


                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "18px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "6px"
                    }}
                  >
                    DIAGNOSIS
                  </div>

                  <strong>
                    {diagnosis
                      ? "Sudah tersedia"
                      : "Belum dilakukan"}
                  </strong>
                </div>


                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "18px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "6px"
                    }}
                  >
                    STRATEGI
                  </div>

                  <strong>
                    {autopilotData
                      ? "Sudah tersedia"
                      : "Belum dibuat"}
                  </strong>
                </div>
              </div>
            )}


            {/* PILIHAN CEPAT */}
            <div
              style={{
                marginBottom: "12px"
              }}
            >
              <h3
                style={{
                  marginBottom: "6px"
                }}
              >
                Mulai dengan cepat
              </h3>

              <p
                style={{
                  marginTop: 0,
                  color: "#64748b"
                }}
              >
                Pilih sesuai kebutuhan Anda.
              </p>
            </div>


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(230px, 1fr))",
                gap: "16px",
                marginBottom: "36px"
              }}
            >

              <button
                onClick={() => setTab("capture")}
                style={{
                  textAlign: "left",
                  padding: "22px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  background: "#ffffff",
                  cursor: "pointer"
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    marginBottom: "12px"
                  }}
                >
                  🏪
                </div>

                <strong>
                  Ceritakan Usaha Anda
                </strong>

                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: "13px",
                    color: "#64748b",
                    lineHeight: "1.5"
                  }}
                >
                  Masukkan informasi dasar usaha agar
                  ZENAI dapat membantu menganalisisnya.
                </p>
              </button>


              <button
                onClick={() => runPulse()}
                style={{
                  textAlign: "left",
                  padding: "22px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  background: "#ffffff",
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
                    margin: "8px 0 0",
                    fontSize: "13px",
                    color: "#64748b",
                    lineHeight: "1.5"
                  }}
                >
                  Ketahui hal penting yang perlu
                  diperhatikan dari usaha Anda.
                </p>
              </button>


              <button
                onClick={() => runDiagnosis()}
                style={{
                  textAlign: "left",
                  padding: "22px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  background: "#ffffff",
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
                    margin: "8px 0 0",
                    fontSize: "13px",
                    color: "#64748b",
                    lineHeight: "1.5"
                  }}
                >
                  Cari tahu masalah, kekuatan,
                  peluang, dan hal yang perlu diperbaiki.
                </p>
              </button>


              <button
                onClick={() => runAutopilot()}
                style={{
                  textAlign: "left",
                  padding: "22px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  background: "#ffffff",
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
                    margin: "8px 0 0",
                    fontSize: "13px",
                    color: "#64748b",
                    lineHeight: "1.5"
                  }}
                >
                  Dapatkan langkah prioritas yang dapat
                  dilakukan berdasarkan kondisi usaha.
                </p>
              </button>

            </div>


            {/* PANDUAN */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "24px"
              }}
            >
              <h3
                style={{
                  marginTop: 0
                }}
              >
                Bagaimana ZENAI membantu?
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "20px"
                }}
              >
                <div>
                  <strong>
                    1. Ceritakan
                  </strong>

                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      lineHeight: "1.5"
                    }}
                  >
                                        Berikan informasi tentang usaha,
                    produk, kondisi, atau masalah Anda.
                  </p>
                </div>

                <div>
                  <strong>
                    2. Analisis
                  </strong>

                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      lineHeight: "1.5"
                    }}
                  >
                    ZENAI membantu melihat kondisi usaha,
                    menemukan masalah, kekuatan, peluang,
                    serta hal yang perlu diperhatikan.
                  </p>
                </div>

                <div>
                  <strong>
                    3. Tentukan Langkah
                  </strong>

                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      lineHeight: "1.5"
                    }}
                  >
                    Gunakan hasil analisis untuk menentukan
                    langkah yang paling perlu dilakukan
                    terlebih dahulu.
                  </p>
                </div>
              </div>
            </div>

          </section>
        )}


        {/* =========================
            CERITAKAN USAHA
        ========================= */}

        {tab === "capture" && (
          <section>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "20px",
                flexWrap: "wrap",
                marginBottom: "28px"
              }}
            >
              <div>
                <h2
                  style={{
                    margin: "0 0 10px"
                  }}
                >
                  🏪 Ceritakan Usaha Anda
                </h2>

                <p
                  style={{
                    color: "#64748b",
                    maxWidth: "700px",
                    lineHeight: "1.6"
                  }}
                >
                  Ceritakan usaha Anda dengan cara yang paling
                  nyaman. Anda dapat menulis, menambahkan gambar,
                  atau menggunakan voice note.
                </p>
              </div>

              {business && (
                <button
                  onClick={resetAnalysis}
                  style={{
                    padding: "10px 16px",
                    border: "1px solid #fecaca",
                    background: "#fff1f2",
                    color: "#dc2626",
                    borderRadius: "10px",
                    cursor: "pointer"
                  }}
                >
                  Mulai Ulang
                </button>
              )}
            </div>


            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "24px"
              }}
            >

              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  marginBottom: "10px"
                }}
              >
                Ceritakan usaha atau kebutuhan Anda
              </label>

              <textarea
                value={text}
                onChange={(event) =>
                  setText(event.target.value)
                }
                placeholder="Contoh: Saya memiliki usaha makanan rumahan. Saya menjual rice bowl dan minuman. Akhir-akhir ini penjualan belum stabil dan saya ingin mengetahui apa yang perlu diperbaiki."
                rows={8}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "16px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "12px",
                  fontSize: "15px",
                  resize: "vertical",
                  outline: "none"
                }}
              />


              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "18px"
                }}
              >

                <label
                  style={{
                    padding: "10px 16px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  🖼️ Tambahkan Gambar

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    style={{
                      display: "none"
                    }}
                  />
                </label>


                <label
                  style={{
                    padding: "10px 16px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  🎵 Upload Voice Note

                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudio}
                    style={{
                      display: "none"
                    }}
                  />
                </label>


                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={busy}
                    style={{
                      padding: "10px 16px",
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    🎙 Rekam Voice Note
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    style={{
                      padding: "10px 16px",
                      border: "none",
                      background: "#dc2626",
                      color: "#ffffff",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    ⏹ Hentikan Rekaman (
                    {formatRecordingTime(recordingTime)})
                  </button>
                )}

              </div>


              {image && (
                <div
                  style={{
                    marginTop: "20px"
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#64748b"
                    }}
                  >
                    Gambar yang akan dianalisis:
                  </p>

                  <img
                    src={image}
                    alt="Preview"
                    style={{
                      maxWidth: "260px",
                      maxHeight: "220px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0"
                    }}
                  />
                </div>
              )}


              {audio && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "16px",
                    background: "#f8fafc",
                    borderRadius: "12px"
                  }}
                >
                  <strong>
                    🎙 {audioName || "Voice Note"}
                  </strong>

                  <div
                    style={{
                      marginTop: "12px"
                    }}
                  >
                    <audio
                      controls
                      src={audio}
                      style={{
                        width: "100%"
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={clearAudio}
                    style={{
                      marginTop: "12px",
                      border: "none",
                      background: "transparent",
                      color: "#dc2626",
                      cursor: "pointer"
                    }}
                  >
                    Hapus Voice Note
                  </button>
                </div>
              )}


              <div
                style={{
                  marginTop: "24px"
                }}
              >
                <button
                  className="primary"
                  disabled={
                    busy ||
                    isRecording
                  }
                  onClick={analyzeBusiness}
                >
                  {busy
                    ? "ZENAI sedang menganalisis..."
                    : "✨ Analisis Usaha"
                  }
                </button>
              </div>

            </div>

          </section>
        )}
        {/* =========================
            LIHAT KONDISI USAHA
            BUSINESS PULSE
        ========================= */}

        {tab === "pulse" && (
          <section>

            <div
              style={{
                marginBottom: "28px"
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#2563eb",
                  fontWeight: "700",
                  marginBottom: "8px"
                }}
              >
                BUSINESS PULSE
              </div>

              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "32px"
                }}
              >
                📊 Lihat Kondisi Usaha
              </h2>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: "1.6",
                  maxWidth: "750px"
                }}
              >
                Lihat gambaran kondisi usaha Anda berdasarkan
                informasi yang telah diberikan. ZENAI akan
                menampilkan hal penting yang perlu diperhatikan,
                kekuatan, dan peluang yang dapat dikembangkan.
              </p>
            </div>


            {!business ? (

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "32px",
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

                <h3>
                  Belum ada informasi usaha
                </h3>

                <p
                  style={{
                    color: "#64748b"
                  }}
                >
                  Ceritakan usaha Anda terlebih dahulu agar
                  ZENAI dapat membantu melihat kondisinya.
                </p>

                <button
                  className="primary"
                  onClick={() =>
                    setTab("capture")
                  }
                >
                  Ceritakan Usaha
                </button>
              </div>

            ) : !pulseData ? (

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "32px"
                }}
              >
                <h3
                  style={{
                    marginTop: 0
                  }}
                >
                  Siap menganalisis kondisi usaha
                </h3>

                <p
                  style={{
                    color: "#64748b",
                    lineHeight: "1.6"
                  }}
                >
                  ZENAI akan menggunakan informasi usaha yang
                  sudah Anda masukkan untuk memberikan gambaran
                  kondisi saat ini.
                </p>

                <button
                  className="primary"
                  disabled={busy}
                  onClick={runPulse}
                >
                  {busy
                    ? "Sedang menganalisis..."
                    : "📊 Analisis Kondisi Usaha"
                  }
                </button>
              </div>

            ) : (

              <>
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "24px",
                    marginBottom: "20px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "8px"
                    }}
                  >
                    GAMBARAN SAAT INI
                  </div>

                  <h3
                    style={{
                      margin: "0 0 12px"
                    }}
                  >
                    {pulseData.condition ||
                      "Kondisi usaha Anda"}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#475569",
                      lineHeight: "1.7"
                    }}
                  >
                    {pulseData.summary}
                  </p>
                </div>


                {pulseData.highlights?.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: "16px",
                      marginBottom: "20px"
                    }}
                  >
                    {pulseData.highlights.map(
                      (item, index) => (
                        <div
                          key={index}
                          style={{
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "16px",
                            padding: "20px"
                          }}
                        >
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#2563eb",
                              fontWeight: "700",
                              marginBottom: "8px"
                            }}
                          >
                            {renderStatus(
                              item.status
                            )}
                          </div>

                          <strong>
                            {item.title}
                          </strong>

                          <p
                            style={{
                              color: "#64748b",
                              fontSize: "14px",
                              lineHeight: "1.6"
                            }}
                          >
                            {item.description}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}


                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "16px",
                    marginBottom: "20px"
                  }}
                >

                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "20px"
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0
                      }}
                    >
                      ⚠️ Perlu Diperhatikan
                    </h3>

                    {pulseData.attention?.length > 0 ? (
                      <ul
                        style={{
                          paddingLeft: "20px",
                          color: "#64748b",
                          lineHeight: "1.8"
                        }}
                      >
                        {pulseData.attention.map(
                          (item, index) => (
                            <li key={index}>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p
                        style={{
                          color: "#64748b"
                        }}
                      >
                        Belum ada perhatian khusus yang
                        ditemukan dari informasi saat ini.
                      </p>
                    )}
                  </div>


                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "20px"
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0
                      }}
                    >
                      💪 Kekuatan Usaha
                    </h3>

                    {pulseData.strengths?.length > 0 ? (
                      <ul
                        style={{
                          paddingLeft: "20px",
                          color: "#64748b",
                          lineHeight: "1.8"
                        }}
                      >
                        {pulseData.strengths.map(
                          (item, index) => (
                            <li key={index}>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p
                        style={{
                          color: "#64748b"
                        }}
                      >
                        Belum ada kekuatan utama yang dapat
                        disimpulkan.
                      </p>
                    )}
                  </div>

                </div>


                <div
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "16px",
                    padding: "20px"
                  }}
                >
                  <strong>
                    Fokus Selanjutnya
                  </strong>

                  <p
                    style={{
                      marginBottom: 0,
                      color: "#475569",
                      lineHeight: "1.6"
                    }}
                  >
                    {pulseData.nextFocus ||
                      "Lanjutkan ke diagnosis untuk melihat penyebab dan prioritas masalah."}
                  </p>

                  <button
                    onClick={runDiagnosis}
                    style={{
                      marginTop: "16px",
                      padding: "10px 16px",
                      border: "none",
                      borderRadius: "10px",
                      background: "#2563eb",
                      color: "#ffffff",
                      cursor: "pointer"
                    }}
                  >
                    Lanjutkan ke Diagnosis →
                  </button>
                </div>
              </>
            )}

          </section>
        )}

        {/* =========================
            DIAGNOSIS USAHA
        ========================= */}

        {tab === "diagnosis" && (
          <section>

            <div
              style={{
                marginBottom: "28px"
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#2563eb",
                  fontWeight: "700",
                  marginBottom: "8px"
                }}
              >
                ANALISIS USAHA
              </div>

              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "32px"
                }}
              >
                🔍 Diagnosis Usaha
              </h2>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: "1.6",
                  maxWidth: "750px"
                }}
              >
                Temukan masalah utama, penyebab yang mungkin,
                serta hal yang perlu diperbaiki terlebih dahulu.
              </p>
            </div>


            {!business ? (

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "32px",
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

                <h3>
                  Belum ada informasi usaha
                </h3>

                <p
                  style={{
                    color: "#64748b"
                  }}
                >
                  Ceritakan usaha Anda terlebih dahulu agar
                  ZENAI dapat melakukan diagnosis.
                </p>

                <button
                  className="primary"
                  onClick={() =>
                    setTab("capture")
                  }
                >
                  Ceritakan Usaha
                </button>
              </div>

            ) : !diagnosis ? (

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "32px"
                }}
              >
                <h3
                  style={{
                    marginTop: 0
                  }}
                >
                  Siap melakukan diagnosis
                </h3>

                <p
                  style={{
                    color: "#64748b",
                    lineHeight: "1.6",
                    maxWidth: "700px"
                  }}
                >
                  ZENAI akan mempelajari informasi usaha yang
                  telah Anda berikan untuk menemukan masalah,
                  penyebab, peluang, dan rekomendasi tindakan.
                </p>

                <button
                  className="primary"
                  disabled={busy}
                  onClick={runDiagnosis}
                >
                  {busy
                    ? "ZENAI sedang melakukan diagnosis..."
                    : "🔍 Mulai Diagnosis Usaha"
                  }
                </button>
              </div>

            ) : (

              <>
                {/* RINGKASAN */}

                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "24px",
                    marginBottom: "20px"
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0
                    }}
                  >
                    📋 Gambaran Utama
                  </h3>

                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.7",
                      marginBottom: 0
                    }}
                  >
                    {diagnosis.summary}
                  </p>
                </div>


                {/* MASALAH */}

                {diagnosis.problems?.length > 0 && (
                  <div
                    style={{
                      marginBottom: "20px"
                    }}
                  >
                    <h3>
                      🚨 Masalah yang Ditemukan
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "16px"
                      }}
                    >
                      {diagnosis.problems.map(
                        (item, index) => (
                          <div
                            key={index}
                            style={{
                              background: "#ffffff",
                              border: "1px solid #fecaca",
                              borderRadius: "16px",
                              padding: "20px"
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: "12px",
                                marginBottom: "10px"
                              }}
                            >
                              <strong>
                                {item.title}
                              </strong>

                              {item.level && (
                                <span
                                  style={{
                                    fontSize: "11px",
                                    padding: "5px 8px",
                                    borderRadius: "20px",
                                    background: "#fff1f2",
                                    color: "#dc2626",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  {item.level}
                                </span>
                              )}
                            </div>

                            <p
                              style={{
                                color: "#64748b",
                                fontSize: "14px",
                                lineHeight: "1.6",
                                marginBottom: "12px"
                              }}
                            >
                              {item.description}
                            </p>

                            {item.cause && (
                              <div
                                style={{
                                  padding: "12px",
                                  background: "#f8fafc",
                                  borderRadius: "10px",
                                  fontSize: "13px",
                                  color: "#475569"
                                }}
                              >
                                <strong>
                                  Kemungkinan Penyebab:
                                </strong>

                                <div
                                  style={{
                                    marginTop: "4px"
                                  }}
                                >
                                  {item.cause}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}


                {/* PENYEBAB UTAMA */}

                {diagnosis.rootCauses?.length > 0 && (
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "18px",
                      padding: "24px",
                      marginBottom: "20px"
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0
                      }}
                    >
                      🧩 Hal yang Perlu Diperhatikan
                    </h3>

                    <p
                      style={{
                        color: "#64748b",
                        lineHeight: "1.6",
                        marginBottom: "16px"
                      }}
                    >
                      Beberapa faktor berikut kemungkinan menjadi
                      penyebab utama kondisi usaha saat ini.
                    </p>

                    <ul
                      style={{
                        paddingLeft: "20px",
                        color: "#475569",
                        lineHeight: "1.8",
                        marginBottom: 0
                      }}
                    >
                      {diagnosis.rootCauses.map(
                        (item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}


                {/* KEKUATAN */}

                {diagnosis.strengths?.length > 0 && (
                  <div
                    style={{
                      marginBottom: "20px"
                    }}
                  >
                    <h3>
                      💪 Kekuatan yang Dimiliki
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "14px"
                      }}
                    >
                      {diagnosis.strengths.map(
                        (item, index) => (
                          <div
                            key={index}
                            style={{
                              background: "#f0fdf4",
                              border: "1px solid #bbf7d0",
                              borderRadius: "14px",
                              padding: "18px"
                            }}
                          >
                            <strong>
                              {item.title || item}
                            </strong>

                            {item.description && (
                              <p
                                style={{
                                  color: "#475569",
                                  fontSize: "14px",
                                  lineHeight: "1.6",
                                  marginBottom: 0
                                }}
                              >
                                {item.description}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}


                {/* PELUANG */}

                {diagnosis.opportunity && (
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "18px",
                      padding: "24px",
                      marginBottom: "20px"
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0
                      }}
                    >
                      💡 Peluang yang Bisa Dikembangkan
                    </h3>

                    <p
                      style={{
                        color: "#475569",
                        lineHeight: "1.7"
                      }}
                    >
                      {diagnosis.opportunity.summary}
                    </p>

                    {diagnosis.opportunity.recommendations
                      ?.length > 0 && (
                      <>
                        <strong>
                          Yang Dapat Dilakukan
                        </strong>

                        <ul
                          style={{
                            paddingLeft: "18px",
                            color: "#475569",
                            fontSize: "13px",
                            lineHeight: "1.7"
                          }}
                        >
                          {diagnosis.opportunity.recommendations.map(
                            (item, index) => (
                              <li key={index}>
                                {item}
                              </li>
                            )
                          )}
                        </ul>
                      </>
                    )}
                  </div>
                )}


                {/* LANJUT */}

                <div
                  style={{
                    marginTop: "24px",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "16px",
                    padding: "20px"
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0
                    }}
                  >
                    Sudah menemukan gambaran masalah?
                  </h3>

                  <p
                    style={{
                      color: "#475569"
                    }}
                  >
                    Lanjutkan untuk mendapatkan strategi dan
                    langkah yang dapat dilakukan.
                  </p>

                  <button
                    onClick={runAutopilot}
                    style={{
                      padding: "10px 16px",
                      border: "none",
                      borderRadius: "10px",
                      background: "#2563eb",
                      color: "#ffffff",
                      cursor: "pointer"
                    }}
                  >
                    Buat Strategi & Tindakan →
                  </button>
                </div>

              </>
            )}

          </section>
        )}


        {/* =========================
            BUSINESS AUTOPILOT
        ========================= */}

        {tab === "autopilot" && (
          <section>

            <div
              style={{
                marginBottom: "28px"
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#2563eb",
                  fontWeight: "700",
                  marginBottom: "8px"
                }}
              >
                STRATEGI USAHA
              </div>

              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "32px"
                }}
              >
                ⚡ Strategi & Tindakan
              </h2>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: "1.6",
                  maxWidth: "750px"
                }}
              >
                Ubah hasil analisis menjadi langkah nyata.
                ZENAI membantu menentukan tindakan yang paling
                penting untuk dilakukan terlebih dahulu.
              </p>
            </div>


            {!business ? (

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "32px",
                  textAlign: "center"
                }}
              >
                <h3>
                  Belum ada informasi usaha
                </h3>

                <p
                  style={{
                    color: "#64748b"
                  }}
                >
                  Masukkan informasi usaha terlebih dahulu.
                </p>

                <button
                  className="primary"
                  onClick={() =>
                    setTab("capture")
                  }
                >
                  Ceritakan Usaha
                </button>
              </div>

            ) : !autopilotData ? (

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "32px"
                }}
              >
                <h3
                  style={{
                    marginTop: 0
                  }}
                >
                  Siap menyusun langkah
                </h3>

                <p
                  style={{
                    color: "#64748b",
                    lineHeight: "1.6"
                  }}
                >
                  ZENAI akan menggunakan informasi usaha dan
                  hasil analisis yang tersedia untuk menyusun
                  tindakan yang lebih terarah.
                </p>

                <button
                  className="primary"
                  disabled={busy}
                  onClick={runAutopilot}
                >
                  {busy
                    ? "Sedang menyusun strategi..."
                    : "⚡ Buat Strategi & Tindakan"
                  }
                </button>
              </div>

            ) : (

              <>
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "24px",
                    marginBottom: "20px"
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0
                    }}
                  >
                    Ringkasan Strategi
                  </h3>

                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.7",
                      marginBottom: 0
                    }}
                  >
                    {autopilotData.summary}
                  </p>
                </div>


                {autopilotData.priority?.length > 0 && (
                  <div
                    style={{
                      marginBottom: "20px"
                    }}
                  >
                    <h3>
                      🎯 Prioritas Tindakan
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gap: "14px"
                      }}
                    >
                                            {autopilotData.priority.map(
                        (item, index) => (
                          <div
                            key={index}
                            style={{
                              background: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderRadius: "14px",
                              padding: "18px"
                            }}
                          >
                            <strong>
                              {index + 1}. {item.title}
                            </strong>

                            <p
                              style={{
                                color: "#64748b",
                                fontSize: "14px",
                                lineHeight: "1.6"
                              }}
                            >
                              {item.reason}
                            </p>

                            <div
                              style={{
                                background: "#f8fafc",
                                padding: "12px",
                                borderRadius: "10px",
                                fontSize: "14px"
                              }}
                            >
                              <strong>
                                Tindakan:
                              </strong>{" "}
                              {item.action}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}


                {autopilotData.quickActions?.length > 0 && (
                  <div
                    style={{
                      marginBottom: "20px"
                    }}
                  >
                                    {/* STRATEGI 7, 14, 30 HARI */}

                {(autopilotData.plan7?.length > 0 ||
                  autopilotData.plan14?.length > 0 ||
                  autopilotData.plan30?.length > 0) && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: "16px",
                      marginBottom: "20px"
                    }}
                  >

                    {/* 7 HARI */}

                    <div
                      style={{
                        background: "#ffffff",
                        border: "1px solid #bfdbfe",
                        borderRadius: "16px",
                        padding: "20px"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "14px"
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "#eff6ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          ⚡
                        </div>

                        <div>
                          <strong>
                            Strategi 7 Hari
                          </strong>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b"
                            }}
                          >
                            Fokus tindakan cepat
                          </div>
                        </div>
                      </div>

                      {autopilotData.plan7?.length > 0 ? (
                        <div
                          style={{
                            display: "grid",
                            gap: "10px"
                          }}
                        >
                          {autopilotData.plan7.map(
                            (item, index) => (
                              <div
                                key={index}
                                style={{
                                  padding: "12px",
                                  background: "#f8fafc",
                                  borderRadius: "10px",
                                  fontSize: "14px"
                                }}
                              >
                                <strong>
                                  Hari {index + 1}
                                </strong>

                                <div
                                  style={{
                                    marginTop: "4px",
                                    color: "#475569",
                                    lineHeight: "1.6"
                                  }}
                                >
                                  {typeof item === "string"
                                    ? item
                                    : item.action || item.title}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p
                          style={{
                            color: "#94a3b8",
                            fontSize: "14px"
                          }}
                        >
                          Strategi 7 hari belum tersedia.
                        </p>
                      )}
                    </div>


                    {/* 14 HARI */}

                    <div
                      style={{
                        background: "#ffffff",
                        border: "1px solid #c4b5fd",
                        borderRadius: "16px",
                        padding: "20px"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "14px"
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "#f5f3ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          📈
                        </div>

                        <div>
                          <strong>
                            Strategi 14 Hari
                          </strong>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b"
                            }}
                          >
                            Bangun dan uji strategi
                          </div>
                        </div>
                      </div>

                      {autopilotData.plan14?.length > 0 ? (
                        <div
                          style={{
                            display: "grid",
                            gap: "10px"
                          }}
                        >
                          {autopilotData.plan14.map(
                            (item, index) => (
                              <div
                                key={index}
                                style={{
                                  padding: "12px",
                                  background: "#fafafa",
                                  borderRadius: "10px",
                                  fontSize: "14px"
                                }}
                              >
                                <strong>
                                  Tahap {index + 1}
                                </strong>

                                <div
                                  style={{
                                    marginTop: "4px",
                                    color: "#475569",
                                    lineHeight: "1.6"
                                  }}
                                >
                                  {typeof item === "string"
                                    ? item
                                    : item.action || item.title}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p
                          style={{
                            color: "#94a3b8",
                            fontSize: "14px"
                          }}
                        >
                          Strategi 14 hari belum tersedia.
                        </p>
                      )}
                    </div>


                    {/* 30 HARI */}

                    <div
                      style={{
                        background: "#ffffff",
                        border: "1px solid #86efac",
                        borderRadius: "16px",
                        padding: "20px"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "14px"
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "#f0fdf4",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          🚀
                        </div>

                        <div>
                          <strong>
                            Strategi 30 Hari
                          </strong>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b"
                            }}
                          >
                            Dorong pertumbuhan usaha
                          </div>
                        </div>
                      </div>

                      {autopilotData.plan30?.length > 0 ? (
                        <div
                          style={{
                            display: "grid",
                            gap: "10px"
                          }}
                        >
                          {autopilotData.plan30.map(
                            (item, index) => (
                              <div
                                key={index}
                                style={{
                                  padding: "12px",
                                  background: "#f8fafc",
                                  borderRadius: "10px",
                                  fontSize: "14px"
                                }}
                              >
                                <strong>
                                  Tahap {index + 1}
                                </strong>

                                <div
                                  style={{
                                    marginTop: "4px",
                                    color: "#475569",
                                    lineHeight: "1.6"
                                  }}
                                >
                                  {typeof item === "string"
                                    ? item
                                    : item.action || item.title}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p
                          style={{
                            color: "#94a3b8",
                            fontSize: "14px"
                          }}
                        >
                          Strategi 30 hari belum tersedia.
                        </p>
                      )}
                    </div>

                  </div>
                )}
<h3>
                      ⚡ Langkah Cepat
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "14px"
                      }}
                    >
                      {autopilotData.quickActions.map(
                        (item, index) => (
                          <div
                            key={index}
                            style={{
                              background: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderRadius: "14px",
                              padding: "18px"
                            }}
                          >
                            <strong>
                              {item.title}
                            </strong>

                            <p
                              style={{
                                color: "#64748b",
                                fontSize: "14px",
                                lineHeight: "1.6",
                                marginBottom: 0
                              }}
                            >
                              {item.description}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}


                {autopilotData.plan?.length > 0 && (
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "18px",
                      padding: "24px",
                      marginBottom: "20px"
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0
                      }}
                    >
                      🗺️ Rencana Tindakan
                    </h3>

                    {autopilotData.plan.map(
                      (item, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            gap: "16px",
                            padding: "16px 0",
                            borderBottom:
                              index <
                              autopilotData.plan.length - 1
                                ? "1px solid #e2e8f0"
                                : "none"
                          }}
                        >
                          <div
                            style={{
                              minWidth: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: "#eff6ff",
                              color: "#2563eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "700"
                            }}
                          >
                            {index + 1}
                          </div>

                          <div>
                            <strong>
                              {item.step}
                            </strong>

                            <p
                              style={{
                                color: "#475569",
                                margin: "6px 0"
                              }}
                            >
                              {item.action}
                            </p>

                            <small
                              style={{
                                color: "#64748b"
                              }}
                            >
                              Tujuan: {item.purpose}
                            </small>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}


                {autopilotData.warning && (
                  <div
                    style={{
                      padding: "18px",
                      background: "#fff7ed",
                      border: "1px solid #fed7aa",
                      borderRadius: "14px",
                      color: "#9a3412"
                    }}
                  >
                    <strong>
                      ⚠️ Catatan Penting
                    </strong>

                    <p
                      style={{
                        marginBottom: 0,
                        lineHeight: "1.6"
                      }}
                    >
                      {autopilotData.warning}
                    </p>
                  </div>
                )}

              </>
            )}

          </section>
        )}


        {/* =========================
            MARKET SYNC
        ========================= */}

        {tab === "market" && (
          <section>

            <div
              style={{
                marginBottom: "28px"
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#2563eb",
                  fontWeight: "700",
                  marginBottom: "8px"
                }}
              >
                WAWASAN PASAR
              </div>

              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "32px"
                }}
              >
                🌐 Market Sync
              </h2>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: "1.6",
                  maxWidth: "750px"
                }}
              >
                Hubungkan kondisi usaha Anda dengan konteks pasar
                untuk melihat faktor luar yang perlu diperhatikan.
              </p>
            </div>


            {!business ? (

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "32px",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px"
                  }}
                >
                  🌐
                </div>

                <h3>
                  Market Sync membutuhkan informasi usaha
                </h3>

                <p
                  style={{
                    color: "#64748b"
                  }}
                >
                  Masukkan informasi usaha terlebih dahulu agar
                  analisis pasar menjadi lebih relevan.
                </p>

                <button
                  className="primary"
                  onClick={() =>
                    setTab("capture")
                  }
                >
                  Ceritakan Usaha
                </button>
              </div>

            ) : (

              <>
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "24px",
                    marginBottom: "20px"
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0
                    }}
                  >
                    Usaha yang sedang dianalisis
                  </h3>

                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.6"
                    }}
                  >
                    <strong>
                      {business.product || "Usaha Anda"}
                    </strong>
                  </p>

                  <p
                    style={{
                      color: "#64748b",
                      lineHeight: "1.6"
                    }}
                  >
                    {business.description ||
                      "ZENAI menggunakan informasi usaha yang telah Anda masukkan sebagai dasar analisis."}
                  </p>
                </div>


                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "16px"
                  }}
                >
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "20px"
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0
                      }}
                    >
                      🧭 Kondisi Usaha
                    </h3>

                    <p
                      style={{
                        color: "#64748b",
                        lineHeight: "1.6"
                      }}
                    >
                      {pulseData?.summary ||
                        "Belum ada analisis kondisi usaha."}
                    </p>

                    {!pulseData && (
                      <button
                        onClick={runPulse}
                        style={{
                          padding: "9px 14px",
                          border: "none",
                          borderRadius: "8px",
                          background: "#2563eb",
                          color: "#ffffff",
                          cursor: "pointer"
                        }}
                      >
                        Analisis Kondisi
                      </button>
                    )}
                  </div>


                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "20px"
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0
                      }}
                    >
                      🎯 Fokus Pasar
                    </h3>

                    <p
                      style={{
                        color: "#64748b",
                        lineHeight: "1.6"
                      }}
                    >
                      {business.target
                        ? `Target utama yang teridentifikasi: ${business.target}`
                        : "Target pasar belum cukup jelas."}
                    </p>
                  </div>


                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "20px"
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0
                      }}
                    >
                      💡 Peluang Awal
                    </h3>

                    <p
                      style={{
                        color: "#64748b",
                        lineHeight: "1.6"
                      }}
                    >
                      {business.opportunity ||
                        pulseData?.opportunities?.[0] ||
                        "Belum cukup informasi untuk menentukan peluang spesifik."}
                    </p>
                  </div>
                </div>


                <div
                  style={{
                    marginTop: "24px",
                    padding: "20px",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "16px"
                  }}
                >
                  <strong>
                    Langkah Berikutnya
                  </strong>

                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.6"
                    }}
                  >
                    Gunakan informasi kondisi usaha dan peluang
                    yang ditemukan untuk menentukan arah
                    pengembangan.
                  </p>

                  <button
                    onClick={() =>
                      setTab("opportunity")
                    }
                    style={{
                      padding: "10px 16px",
                      border: "none",
                      borderRadius: "10px",
                      background: "#2563eb",
                      color: "#ffffff",
                      cursor: "pointer"
                    }}
                  >
                    Lihat Peluang & Tren →
                  </button>
                </div>

              </>
            )}

          </section>
        )}


        {/* =========================
            PELUANG & TREN
        ========================= */}

        {tab === "opportunity" && (
          <section>

            <div
              style={{
                marginBottom: "28px"
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#2563eb",
                  fontWeight: "700",
                  marginBottom: "8px"
                }}
              >
                WAWASAN PASAR
              </div>

              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "32px"
                }}
              >
                📈 Peluang & Tren
              </h2>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: "1.6",
                  maxWidth: "750px"
                }}
              >
                Lihat peluang yang dapat dikembangkan berdasarkan
                kondisi usaha dan hasil analisis yang tersedia.
              </p>
            </div>


            {!business ? (

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "32px",
                  textAlign: "center"
                }}
              >
                <h3>
                  Belum ada informasi usaha
                </h3>

                <p
                  style={{
                    color: "#64748b"
                  }}
                >
                  Masukkan informasi usaha untuk mulai
                  menemukan peluang.
                </p>

                <button
                  className="primary"
                  onClick={() =>
                    setTab("capture")
                  }
                >
                  Ceritakan Usaha
                </button>
              </div>

            ) : (

              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "16px"
                  }}
                >

                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "20px"
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0
                      }}
                    >
                      💡 Peluang Usaha
                    </h3>

                    <p
                      style={{
                        color: "#64748b",
                        lineHeight: "1.7"
                      }}
                    >
                      {business.opportunity ||
                        diagnosis?.opportunity?.summary ||
                        "Belum cukup informasi untuk menentukan peluang utama."}
                    </p>
                  </div>


                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "20px"
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0
                      }}
                    >
                      📊 Peluang dari Kondisi Saat Ini
                    </h3>

                    {pulseData?.opportunities?.length > 0 ? (
                      <ul
                        style={{
                          paddingLeft: "20px",
                          color: "#64748b",
                          lineHeight: "1.8"
                        }}
                      >
                        {pulseData.opportunities.map(
                          (item, index) => (
                            <li key={index}>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p
                        style={{
                          color: "#64748b",
                          lineHeight: "1.7"
                        }}
                      >
                        Jalankan analisis kondisi usaha terlebih
                        dahulu untuk mendapatkan peluang yang lebih
                        spesifik.
                      </p>
                    )}
                  </div>


                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "20px"
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0
                      }}
                    >
                      🎯 Arah Pengembangan
                    </h3>

                    <p
                      style={{
                        color: "#64748b",
                        lineHeight: "1.7"
                      }}
                    >
                      {diagnosis?.opportunity
                        ?.recommendations?.[0] ||
                        autopilotData?.nextStep ||
                        business.nextStep ||
                        "Lakukan analisis lebih lanjut untuk menentukan langkah pengembangan yang paling relevan."}
                    </p>
                  </div>

                </div>


                <div
                  style={{
                    marginTop: "24px",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "16px",
                    padding: "22px"
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0
                    }}
                  >
                    Ubah Peluang Menjadi Tindakan
                  </h3>

                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.6"
                    }}
                  >
                    Setelah menemukan peluang, gunakan Strategi &
                    Tindakan untuk menyusun langkah yang lebih
                    terarah.
                  </p>

                  <button
                    onClick={runAutopilot}
                    style={{
                      padding: "10px 16px",
                      border: "none",
                      borderRadius: "10px",
                      background: "#2563eb",
                      color: "#ffffff",
                      cursor: "pointer"
                    }}
                  >
                    Buat Strategi →
                  </button>
                </div>

              </>
            )}

          </section>
        )}


        {/* =========================
            RIWAYAT ANALISIS
        ========================= */}

        {tab === "history" && (
          <section>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "20px",
                flexWrap: "wrap",
                marginBottom: "28px"
              }}
            >
              <div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#2563eb",
                    fontWeight: "700",
                    marginBottom: "8px"
                  }}
                >
                  AKTIVITAS
                </div>

                <h2
                  style={{
                    margin: "0 0 10px",
                    fontSize: "32px"
                  }}
                >
                  🗂️ Riwayat Analisis
                </h2>

                <p
                  style={{
                    color: "#64748b",
                    lineHeight: "1.6"
                  }}
                >
                  Lihat analisis dan pembaruan usaha yang telah
                  dilakukan.
                </p>

              </div>


              {business && (
                <button
                  onClick={resetAnalysis}
                  style={{
                    padding: "10px 16px",
                    border: "1px solid #fecaca",
                    background: "#fff1f2",
                    color: "#dc2626",
                    borderRadius: "10px",
                    cursor: "pointer"
                  }}
                >
                  Hapus Analisis
                </button>
              )}

            </div>


            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "24px",
                marginBottom: "20px"
              }}
            >
              <h3
                style={{
                  marginTop: 0
                }}
              >
                Tambahkan Pembaruan Usaha
              </h3>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: "1.6"
                }}
              >
                Catat perubahan atau perkembangan terbaru agar
                dapat digunakan sebagai konteks analisis berikutnya.
              </p>

              <textarea
                value={updateText}
                onChange={(event) =>
                  setUpdateText(event.target.value)
                }
                placeholder="Contoh: Minggu ini saya mulai mencoba promosi melalui Instagram, tetapi respons pelanggan masih belum banyak."
                rows={4}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  resize: "vertical"
                }}
              />

              <button
  onClick={addBusinessUpdate}
  disabled={busy}
  style={{
    marginTop: "12px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    cursor: busy
      ? "not-allowed"
      : "pointer",
    opacity: busy
      ? 0.6
      : 1
  }}
>
  {busy
    ? "ZENAI sedang memperbarui..."
    : "⚡ Simpan & Perbarui Analisis"}
</button>
            </div>


            <div
              style={{
                display: "grid",
                gap: "14px",
                marginBottom: "28px"
              }}
            >
              <h3
                style={{
                  marginBottom: 0
                }}
              >
                Analisis yang Tersedia
              </h3>


              {analysisHistory.length === 0 ? (

                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "28px",
                    textAlign: "center",
                    color: "#64748b"
                  }}
                >
                  Belum ada analisis yang dilakukan.
                </div>

              ) : (

                analysisHistory.map(
                  (item, index) => (
                    <div
                      key={index}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        padding: "18px"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "16px",
                          flexWrap: "wrap"
                        }}
                      >
                        <strong>
                          {item.type}
                        </strong>

                        <span
                          style={{
                            fontSize: "12px",
                            color: "#64748b"
                          }}
                        >
                          {item.date}
                        </span>
                      </div>

                      <p
                        style={{
                          color: "#64748b",
                          lineHeight: "1.6",
                          marginBottom: 0
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  )
                )
              )}

            </div>


            {businessUpdates.length > 0 && (
              <div>

                <h3>
                  Pembaruan Usaha
                </h3>

                <div
                  style={{
                    display: "grid",
                    gap: "14px"
                  }}
                >
                  {businessUpdates.map(
                    (item) => (
                      <div
                        key={item.id}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "14px",
                          padding: "18px"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "16px",
                            alignItems: "flex-start"
                          }}
                        >
                          <div>

                            <p
                              style={{
                                marginTop: 0,
                                lineHeight: "1.6"
                              }}
                            >
                              {item.text}
                            </p>

                            <small
                              style={{
                                color: "#94a3b8"
                              }}
                            >
                              {item.date}
                            </small>

                          </div>


                          <button
                            onClick={() =>
                              removeBusinessUpdate(item.id)
                            }
                            style={{
                              border: "none",
                              background: "transparent",
                              color: "#dc2626",
                              cursor: "pointer"
                            }}
                          >
                            Hapus
                          </button>

                        </div>
                      </div>
                    )
                  )}
                </div>

              </div>
            )}

          </section>
        )}

      </div>


      <style jsx>{`

        .primary {
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          background: #2563eb;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 900px) {

          main {
            flex-direction: column !important;
          }

          aside {
            width: 100% !important;
            min-height: auto !important;
            position: relative !important;
          }

          aside > div:last-child {
            position: relative !important;
            bottom: auto !important;
            left: auto !important;
            right: auto !important;
            margin-top: 24px;
          }

          main > div {
            padding: 24px 16px !important;
          }

        }

      `}</style>

    </main>
  );
}
