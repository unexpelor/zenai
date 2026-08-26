"use client";

import { useRef, useState } from "react";

export default function Home() {
  const [tab, setTab] = useState("capture");

  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const [audio, setAudio] = useState("");
  const [audioMimeType, setAudioMimeType] = useState("");
  const [audioName, setAudioName] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const [business, setBusiness] = useState(null);
  const [autopilotData, setAutopilotData] = useState(null);

  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState("");
  const [days, setDays] = useState(7);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const audioInputRef = useRef(null);

  // =========================
  // ERROR FORMATTER
  // =========================

  const formatError = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    if (value instanceof Error) {
      return value.message;
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => formatError(item))
        .filter(Boolean)
        .join("\n");
    }

    if (typeof value === "object") {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }

    return String(value);
  };

  // =========================
  // AI ROUTER
  // =========================

  const askAI = async (payload) => {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("AI ROUTER ERROR:", result);

      const errorMessage = [
        formatError(result.message) || "AI Router gagal.",
        formatError(result.details),
        result.error
          ? `Error: ${formatError(result.error)}`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      throw new Error(errorMessage);
    }

    setProvider(result.provider || "");

    return result.text;
  };

  // =========================
  // FILE TO BASE64
  // =========================

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(
          new Error("Gagal membaca file.")
        );
      };

      reader.readAsDataURL(file);
    });
  };

  // =========================
  // UPLOAD IMAGE
  // =========================

  const handleImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    try {
      const base64 = await fileToBase64(file);

      setImage(base64);
    } catch (error) {
      console.error("IMAGE ERROR:", error);

      alert("Gagal membaca gambar.");
    }
  };

  // =========================
  // UPLOAD AUDIO / VN
  // =========================

  const handleAudio = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      alert(
        "File yang dipilih bukan audio."
      );
      return;
    }

    try {
      const base64 = await fileToBase64(file);

      setAudio(base64);
      setAudioMimeType(
        file.type || "audio/webm"
      );
      setAudioName(
        file.name || "Voice Note"
      );

    } catch (error) {
      console.error("AUDIO ERROR:", error);

      alert(
        "Gagal membaca file audio."
      );
    }
  };

  // =========================
  // CLEAR AUDIO
  // =========================

  const clearAudio = () => {
    setAudio("");
    setAudioMimeType("");
    setAudioName("");
    setRecordingTime(0);

    if (audioInputRef.current) {
      audioInputRef.current.value = "";
    }
  };

  // =========================
  // FORMAT RECORDING TIME
  // =========================

  const formatRecordingTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // =========================
  // STOP MICROPHONE
  // =========================

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

  // =========================
  // START RECORDING
  // =========================

  const startRecording = async () => {
    if (
      typeof navigator === "undefined" ||
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
        "MediaRecorder tidak didukung oleh browser ini."
      );

      return;
    }

    try {
      clearAudio();

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      mediaStreamRef.current = stream;

      let options = {};

      const supportedTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
      ];

      const supportedType =
        supportedTypes.find((type) =>
          MediaRecorder.isTypeSupported(type)
        );

      if (supportedType) {
        options.mimeType = supportedType;
      }

      const mediaRecorder =
        new MediaRecorder(
          stream,
          options
        );

      mediaRecorderRef.current =
        mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable =
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

      mediaRecorder.onerror = (event) => {
        console.error(
          "RECORDING ERROR:",
          event
        );

        alert(
          "Terjadi kesalahan saat merekam audio."
        );

        setIsRecording(false);

        stopMicrophone();
      };

      mediaRecorder.onstop = async () => {
        try {
          clearInterval(
            recordingTimerRef.current
          );

          setIsRecording(false);

          const mimeType =
            mediaRecorder.mimeType ||
            "audio/webm";

          const audioBlob = new Blob(
            audioChunksRef.current,
            {
              type: mimeType,
            }
          );

          if (!audioBlob.size) {
            throw new Error(
              "Rekaman audio kosong."
            );
          }

          const extension =
            mimeType.includes("ogg")
              ? "ogg"
              : mimeType.includes("mp4")
              ? "m4a"
              : "webm";

          const audioFile = new File(
            [audioBlob],
            `zenai-vn-${Date.now()}.${extension}`,
            {
              type: mimeType,
            }
          );

          const base64 =
            await fileToBase64(audioFile);

          setAudio(base64);

          setAudioMimeType(mimeType);

          setAudioName(
            "Voice Note ZENAI"
          );

        } catch (error) {
          console.error(
            "PROCESS RECORDING ERROR:",
            error
          );

          alert(
            "Rekaman berhasil dibuat tetapi gagal diproses."
          );
        } finally {
          stopMicrophone();
        }
      };

      mediaRecorder.start();

      setRecordingTime(0);

      setIsRecording(true);

      recordingTimerRef.current =
        setInterval(() => {
          setRecordingTime((current) =>
            current + 1
          );
        }, 1000);

    } catch (error) {
      console.error(
        "MICROPHONE ERROR:",
        error
      );

      if (
        error.name === "NotAllowedError"
      ) {
        alert(
          "Izin mikrofon ditolak. Izinkan akses mikrofon terlebih dahulu."
        );
      } else if (
        error.name === "NotFoundError"
      ) {
        alert(
          "Mikrofon tidak ditemukan."
        );
      } else {
        alert(
          "Gagal mengakses mikrofon."
        );
      }

      setIsRecording(false);

      stopMicrophone();
    }
  };

  // =========================
  // STOP RECORDING
  // =========================

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

  // =========================
  // TOGGLE RECORDING
  // =========================

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // =========================
  // PRODUCT STORY CAPTURE
  // =========================

  const analyzeBusiness = async () => {
    if (
      !text.trim() &&
      !image &&
      !audio
    ) {
      alert(
        "Masukkan minimal teks, gambar, atau voice note."
      );

      return;
    }

    setBusy(true);

    try {
      const prompt = `
Analisis informasi UMKM berikut.

INFORMASI TEKS:
${text.trim() || "Tidak ada"}

${audio ? `
VOICE NOTE:
Terdapat rekaman audio yang harus Anda dengarkan dan pahami.
Gunakan isi rekaman sebagai informasi utama atau tambahan mengenai produk dan usaha.
` : ""}

${image ? `
GAMBAR:
Terdapat gambar produk yang harus dianalisis.
` : ""}

Gabungkan semua informasi yang tersedia:
- teks
- isi voice note
- gambar

Jangan mengarang informasi yang tidak tersedia.

Jika informasi tertentu tidak tersedia,
isi dengan penjelasan yang jujur dan relevan.

Balas HANYA dengan JSON valid.

Format:

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

      const rawResult =
        await askAI({
          prompt,
          image,
          audio,
          audioMimeType,

          system: `
Anda adalah AI Business Analyst untuk UMKM Indonesia.

Anda mampu memahami:
- teks
- gambar produk
- rekaman audio atau voice note

Tugas Anda adalah memahami produk,
target pasar, masalah bisnis,
peluang, dan langkah berikutnya.

Jika terdapat voice note,
dengarkan dan pahami seluruh informasi
yang disampaikan pengguna.

Jangan mengarang informasi
yang tidak tersedia.

Balas hanya JSON valid.
`,
        });

      let cleanJson =
        String(rawResult || "")
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

      const start =
        cleanJson.indexOf("{");

      const end =
        cleanJson.lastIndexOf("}");

      if (
        start === -1 ||
        end === -1
      ) {
        throw new Error(
          `AI tidak mengembalikan JSON valid.\n\n${cleanJson}`
        );
      }

      cleanJson =
        cleanJson.substring(
          start,
          end + 1
        );

      const parsed =
        JSON.parse(cleanJson);

      setBusiness(parsed);

      setAutopilotData(null);

      setTab("pulse");

    } catch (error) {
      console.error(
        "ANALYZE ERROR:",
        error
      );

      alert(
        formatError(error) ||
        "Terjadi kesalahan saat menganalisis bisnis."
      );

    } finally {
      setBusy(false);
    }
  };

  // =========================
  // AUTOPILOT
  // =========================

  const runAutopilot = async () => {
    if (!business) {
      alert(
        "Lakukan Product Story Capture terlebih dahulu."
      );

      setTab("capture");

      return;
    }

    setBusy(true);

    try {
      const response =
        await fetch(
          "/api/autopilot",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              business,
              duration: days,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        console.error(
          "AUTOPILOT API ERROR:",
          result
        );

        const errorMessage = [
          formatError(
            result.message
          ) ||
            "Autopilot gagal dijalankan.",

          formatError(
            result.details
          ),

          result.error
            ? `Error: ${formatError(
                result.error
              )}`
            : "",

          result.raw
            ? `Raw AI Response:\n${formatError(
                result.raw
              )}`
            : "",

          result.jsonText
            ? `JSON Text:\n${formatError(
                result.jsonText
              )}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n");

        throw new Error(
          errorMessage
        );
      }

      if (!result.result) {
        throw new Error(
          "Autopilot berhasil merespons, tetapi strategi tidak ditemukan."
        );
      }

      setAutopilotData(
        result.result
      );

      setProvider(
        result.provider || ""
      );

      setTab("autopilot");

    } catch (error) {
      console.error(
        "AUTOPILOT ERROR:",
        error
      );

      alert(
        formatError(error) ||
        "Autopilot gagal."
      );

    } finally {
      setBusy(false);
    }
  };

  // =========================
  // NAVIGATION
  // =========================

  const navItems = [
    {
      id: "capture",
      icon: "◎",
      label: "Product Story",
    },
    {
      id: "pulse",
      icon: "◉",
      label: "Business Pulse",
    },
    {
      id: "autopilot",
      icon: "⚡",
      label: "Autopilot",
    },
    {
      id: "system",
      icon: "⚙",
      label: "AI Router",
    },
  ];

  return (
    <div className="app">

      <aside>
        <h2>
          ◈ UMKM
          <span>.AI</span>
        </h2>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              setTab(item.id)
            }
          >
            {item.icon} {item.label}
          </button>
        ))}
      </aside>

      <main>

        <header>
          <div>
            <small>
              AI-POWERED BUSINESS COMMAND CENTER
            </small>

            <h1>
              {tab === "capture" &&
                "Product Story Capture"}

              {tab === "pulse" &&
                "Business Pulse"}

              {tab === "autopilot" &&
                "Business Autopilot"}

              {tab === "system" &&
                "Multi-AI Router"}
            </h1>
          </div>

          <div>
            {provider
              ? `● ${provider} aktif`
              : "○ AI Router siap"}
          </div>
        </header>

        {/* =====================
            PRODUCT STORY
        ====================== */}

        {tab === "capture" && (
          <section>

            <h2>
              Ceritakan produk dan usaha Anda
            </h2>

            <p>
              Masukkan teks, foto produk,
              upload voice note,
              atau rekam suara langsung.
            </p>

            <textarea
              value={text}
              onChange={(event) =>
                setText(
                  event.target.value
                )
              }
              placeholder={`Contoh:
Saya menjual keripik pisang seharga Rp10.000.
Target saya mahasiswa.
Penjualan masih rendah karena saya bingung
membuat konten dan memasarkan produk.`}
            />

            <br />

            {/* IMAGE */}

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />

            {image && (
              <div>
                <br />

                <img
                  src={image}
                  alt="Produk"
                  style={{
                    width: "200px",
                    borderRadius: "10px",
                  }}
                />

                <br />
                <br />

                <button
                  onClick={() =>
                    setImage("")
                  }
                >
                  Hapus Gambar
                </button>
              </div>
            )}

            <br />
            <br />

            {/* AUDIO UPLOAD */}

            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudio}
            />

            <br />
            <br />

            {/* RECORD BUTTON */}

            <button
              onClick={toggleRecording}
              disabled={busy}
              style={{
                background:
                  isRecording
                    ? "#dc2626"
                    : "",
                color:
                  isRecording
                    ? "#ffffff"
                    : "",
              }}
            >
              {isRecording
                ? `⏹ Stop Recording ${formatRecordingTime(
                    recordingTime
                  )}`
                : "🎙️ Rekam Voice Note"}
            </button>

            {isRecording && (
              <p>
                🔴 Sedang merekam...{" "}
                {formatRecordingTime(
                  recordingTime
                )}
              </p>
            )}

            {/* AUDIO PREVIEW */}

            {audio && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  borderRadius: "10px",
                  background:
                    "#f5f5f5",
                }}
              >
                <strong>
                  🎙️ {audioName ||
                    "Voice Note siap"}
                </strong>

                <br />
                <br />

                <audio
                  controls
                  src={audio}
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                  }}
                />

                <br />
                <br />

                <button
                  onClick={clearAudio}
                >
                  Hapus Voice Note
                </button>
              </div>
            )}

            <br />

            <button
              className="primary"
              disabled={
                busy || isRecording
              }
              onClick={analyzeBusiness}
            >
              {busy
                ? "AI sedang menganalisis..."
                : "◎ Analisis Produk"}
            </button>

          </section>
        )}

        {/* =====================
            BUSINESS PULSE
        ====================== */}

        {tab === "pulse" && (
          <section>

            {!business && (
              <div>
                <h2>
                  Belum ada data bisnis
                </h2>

                <p>
                  Mulai dengan Product Story Capture.
                </p>

                <button
                  className="primary"
                  onClick={() =>
                    setTab("capture")
                  }
                >
                  Mulai
            </  // VOICE TO TEXT
  // =========================

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input lebih stabil menggunakan Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "id-ID";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setVoice(transcript);
    };

    recognition.onerror = () => {
      alert("Voice input gagal. Silakan coba lagi.");
    };

    recognition.start();
  };

  // =========================
  // PRODUCT STORY CAPTURE
  // =========================

  const analyzeBusiness = async () => {
    if (!text && !voice && !image) {
      alert(
        "Masukkan minimal teks, suara, atau gambar produk."
      );
      return;
    }

    setBusy(true);

    try {
      const prompt = `
Analisis informasi UMKM berikut.

INFORMASI TEKS:
${text || "Tidak ada"}

HASIL VOICE TO TEXT:
${voice || "Tidak ada"}

Jika tersedia gambar, analisis juga gambar tersebut.

Jangan mengarang informasi yang tidak tersedia.

Balas HANYA dengan JSON valid.

Format:

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

      const rawResult = await askAI({
        prompt,
        image,
        system: `
Anda adalah AI Business Analyst untuk UMKM Indonesia.

Tugas Anda adalah memahami produk, target pasar,
masalah bisnis, peluang, dan langkah berikutnya.

Balas hanya JSON valid.
`,
      });

      let cleanJson = String(rawResult || "")
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const start = cleanJson.indexOf("{");
      const end = cleanJson.lastIndexOf("}");

      if (start === -1 || end === -1) {
        throw new Error(
          `AI tidak mengembalikan JSON valid.\n\n${cleanJson}`
        );
      }

      cleanJson = cleanJson.substring(
        start,
        end + 1
      );

      const parsed = JSON.parse(cleanJson);

      setBusiness(parsed);
      setAutopilotData(null);
      setTab("pulse");

    } catch (error) {
      console.error("ANALYZE ERROR:", error);

      alert(
        formatError(error) ||
        "Terjadi kesalahan saat menganalisis bisnis."
      );

    } finally {
      setBusy(false);
    }
  };

  // =========================
  // AUTOPILOT
  // =========================

  const runAutopilot = async () => {
    if (!business) {
      alert(
        "Lakukan Product Story Capture terlebih dahulu."
      );

      setTab("capture");
      return;
    }

    setBusy(true);

    try {
      const response = await fetch(
        "/api/autopilot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            business,
            duration: days,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error(
          "AUTOPILOT API ERROR:",
          result
        );

        const errorMessage = [
          formatError(result.message) ||
            "Autopilot gagal dijalankan.",

          formatError(result.details),

          result.error
            ? `Error: ${formatError(result.error)}`
            : "",

          result.raw
            ? `Raw AI Response:\n${formatError(result.raw)}`
            : "",

          result.jsonText
            ? `JSON Text:\n${formatError(result.jsonText)}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n");

        throw new Error(errorMessage);
      }

      if (!result.result) {
        throw new Error(
          "Autopilot berhasil merespons, tetapi strategi tidak ditemukan."
        );
      }

      setAutopilotData(result.result);
      setProvider(result.provider || "");
      setTab("autopilot");

    } catch (error) {
      console.error(
        "AUTOPILOT ERROR:",
        error
      );

      alert(
        formatError(error) ||
        "Autopilot gagal."
      );

    } finally {
      setBusy(false);
    }
  };

  // =========================
  // NAVIGATION
  // =========================

  const navItems = [
    {
      id: "capture",
      icon: "◎",
      label: "Product Story",
    },
    {
      id: "pulse",
      icon: "◉",
      label: "Business Pulse",
    },
    {
      id: "autopilot",
      icon: "⚡",
      label: "Autopilot",
    },
    {
      id: "system",
      icon: "⚙",
      label: "AI Router",
    },
  ];

  return (
    <div className="app">

      <aside>

        <h2>
          ◈ UMKM
          <span>.AI</span>
        </h2>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
          >
            {item.icon} {item.label}
          </button>
        ))}

      </aside>

      <main>

        <header>

          <div>

            <small>
              AI-POWERED BUSINESS COMMAND CENTER
            </small>

            <h1>

              {tab === "capture" &&
                "Product Story Capture"}

              {tab === "pulse" &&
                "Business Pulse"}

              {tab === "autopilot" &&
                "Business Autopilot"}

              {tab === "system" &&
                "Multi-AI Router"}

            </h1>

          </div>

          <div>
            {provider
              ? `● ${provider} aktif`
              : "○ AI Router siap"}
          </div>

        </header>

        {/* PRODUCT STORY */}

        {tab === "capture" && (

          <section>

            <h2>
              Ceritakan produk dan usaha Anda
            </h2>

            <p>
              Masukkan teks, foto produk,
              atau jelaskan menggunakan suara.
            </p>

            <textarea
              value={text}
              onChange={(event) =>
                setText(event.target.value)
              }
              placeholder={`Contoh:

Saya menjual keripik pisang seharga Rp10.000.
Target saya mahasiswa.
Penjualan masih rendah karena saya bingung
membuat konten dan memasarkan produk.`}
            />

            <br />

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />

            {image && (

              <div>

                <br />

                <img
                  src={image}
                  alt="Produk"
                  style={{
                    width: "200px",
                    borderRadius: "10px",
                  }}
                />

              </div>

            )}

            <br />

            <button
              onClick={startVoice}
            >
              🎙️ Bicara
            </button>

            {voice && (

              <p>

                <strong>
                  Hasil suara:
                </strong>

                <br />

                {voice}

              </p>

            )}

            <button
              className="primary"
              disabled={busy}
              onClick={analyzeBusiness}
            >

              {busy
                ? "AI sedang menganalisis..."
                : "◎ Analisis Produk"}

            </button>

          </section>

        )}

        {/* BUSINESS PULSE */}

        {tab === "pulse" && (

          <section>

            {!business && (

              <div>

                <h2>
                  Belum ada data bisnis
                </h2>

                <p>
                  Mulai dengan Product Story Capture.
                </p>

                <button
                  className="primary"
                  onClick={() =>
                    setTab("capture")
                  }
                >
                  Mulai
                </button>

              </div>

            )}

            {business && (

              <>

                <h2>
                  {business.product}
                </h2>

                <p>
                  {business.description}
                </p>

                <div className="cards">

                  <article>

                    <h3>
                      🎯 Target
                    </h3>

                    <p>
                      {business.target}
                    </p>

                  </article>

                  <article>

                    <h3>
                      ⚠ Masalah
                    </h3>

                    <p>
                      {business.problem}
                    </p>

                  </article>

                  <article>

                    <h3>
                      💡 Peluang
                    </h3>

                    <p>
                      {business.opportunity}
                    </p>

                  </article>

                </div>

                <h3>
                  Langkah Berikutnya
                </h3>

                <p>
                  {business.nextStep}
                </p>

                <button
                  className="primary"
                  disabled={busy}
                  onClick={() => setTab("autopilot")}
                >
                  ⚡ Aktifkan Autopilot
                </button>

              </>

            )}

          </section>

        )}

        {/* AUTOPILOT */}

        {tab === "autopilot" && (

          <section>

            {!business && (

              <div>

                <h2>
                  Belum ada data bisnis
                </h2>

                <p>
                  Lakukan Product Story Capture terlebih dahulu.
                </p>

                <button
                  className="primary"
                  onClick={() => setTab("capture")}
                >
                  Mulai Product Story
                </button>

              </div>

            )}

            {business && !autopilotData && (

              <>

                <h2>
                  Business Autopilot
                </h2>

                <p>
                  Pilih durasi strategi.
                </p>

                <select
                  value={days}
                  onChange={(event) =>
                    setDays(
                      Number(event.target.value)
                    )
                  }
                >

                  <option value="7">
                    7 Hari
                  </option>

                  <option value="14">
                    14 Hari
                  </option>

                  <option value="30">
                    30 Hari
                  </option>

                </select>

                <button
                  className="primary"
                  disabled={busy}
                  onClick={runAutopilot}
                >
                  {busy
                    ? "AI sedang membuat strategi..."
                    : "Generate Strategy"}
                </button>

              </>

            )}

            {business && autopilotData && (

              <>

                <h2>
                  {autopilotData.mission?.title}
                </h2>

                <p>

                  {autopilotData.mission?.target}

                  <br />

                  Durasi:{" "}

                  {autopilotData.mission?.duration}

                </p>

                <h2>
                  Action Plan
                </h2>

                {autopilotData.actions?.map(
                  (action, index) => (

                    <article
                      className="action"
                      key={index}
                    >

                      <h3>

                        {index + 1}.{" "}

                        {action.title}

                      </h3>

                      <p>
                        {action.description}
                      </p>

                      <small>

                        Output:{" "}

                        {action.output}

                      </small>

                    </article>

                  )
                )}

                <br />

                <button
                  onClick={() =>
                    setAutopilotData(null)
                  }
                >
                  Buat Strategi Baru
                </button>

              </>

            )}

          </section>

        )}

        {/* AI ROUTER */}

        {tab === "system" && (

          <section>

            <h2>
              Multi-AI Router
            </h2>

            <p>
              Sistem otomatis memilih AI berdasarkan
              jenis input dan mencoba provider lain
              apabila provider utama gagal.
            </p>

            <div className="cards">

              <article>

                <h3>
                  ⚡ Groq
                </h3>

                <p>
                  Primary AI untuk teks,
                  strategi, dan analisis cepat.
                </p>

                <code>
                  GROQ_API_KEY
                </code>

              </article>

              <article>

                <h3>
                  ◈ Gemini
                </h3>

                <p>
                  Analisis gambar dan input multimodal.
                </p>

                <code>
                  GEMINI_API_KEY
                </code>

              </article>

              <article>

                <h3>
                  ◌ OpenRouter
                </h3>

                <p>
                  Model pool dan fallback.
                </p>

                <code>
                  OPENROUTER_API_KEY
                </code>

              </article>

            </div>

            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                background: "#fff1e6",
                borderRadius: "15px",
                lineHeight: "2",
              }}
            >

              <strong>
                TEXT
              </strong>

              <br />

              Groq → OpenRouter → Gemini

              <br />
              <br />

              <strong>
                IMAGE
              </strong>

              <br />

              Gemini → Groq → OpenRouter

            </div>

          </section>

        )}

      </main>

    </div>
  );
              }
