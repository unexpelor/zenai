"use client";

import { useRef, useState } from "react";

export default function Home() {
  const [tab, setTab] = useState("command");

  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const [audio, setAudio] = useState("");
  const [audioMimeType, setAudioMimeType] = useState("");
  const [audioName, setAudioName] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const [business, setBusiness] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [autopilotData, setAutopilotData] = useState(null);

  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState("");
  const [days, setDays] = useState(7);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const audioInputRef = useRef(null);

  const formatError = (value) => {
    if (value === null || value === undefined) return "";

    if (typeof value === "string") {
      return value;
    }

    if (value instanceof Error) {
      return value.message;
    }

    if (Array.isArray(value)) {
      return value.map(formatError).filter(Boolean).join("\n");
    }

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

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
      const message = [
        formatError(result.message) ||
          "AI gagal memproses permintaan.",
        formatError(result.details),
        result.error
          ? `Error: ${formatError(result.error)}`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      throw new Error(message);
    }

    setProvider(result.provider || "");

    return result.text;
  };

  const extractJson = (rawResult) => {
    const clean = String(rawResult || "")
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error(
        "AI tidak mengembalikan JSON valid."
      );
    }

    return JSON.parse(
      clean.substring(start, end + 1)
    );
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
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
      alert(
        formatError(error) ||
          "Gagal membaca gambar."
      );
    }
  };

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

  const formatRecordingTime = (
    seconds
  ) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remaining =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remaining).padStart(
      2,
      "0"
    )}`;
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

    if (typeof MediaRecorder === "undefined") {
      alert(
        "MediaRecorder tidak didukung oleh browser ini."
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

      mediaStreamRef.current = stream;

      const types = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
      ];

      const supportedType =
        types.find((type) =>
          MediaRecorder.isTypeSupported(type)
        );

      const recorder =
        new MediaRecorder(
          stream,
          supportedType
            ? {
                mimeType:
                  supportedType,
              }
            : {}
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

      recorder.onerror = () => {
        clearInterval(
          recordingTimerRef.current
        );

        setIsRecording(false);

        stopMicrophone();

        alert(
          "Terjadi kesalahan saat merekam audio."
        );
      };

      recorder.onstop = async () => {
        try {
          clearInterval(
            recordingTimerRef.current
          );

          setIsRecording(false);

          const mimeType =
            recorder.mimeType ||
            "audio/webm";

          const blob = new Blob(
            audioChunksRef.current,
            {
              type: mimeType,
            }
          );

          if (!blob.size) {
            throw new Error(
              "Rekaman audio kosong."
            );
          }

          const extension =
            mimeType.includes("ogg")
              ? "ogg"
              : "webm";

          const file = new File(
            [blob],
            `zenai-vn-${Date.now()}.${extension}`,
            {
              type: mimeType,
            }
          );

          const base64 =
            await fileToBase64(file);

          setAudio(base64);

          setAudioMimeType(
            mimeType
          );

          setAudioName(
            "Voice Note ZENAI"
          );
        } catch (error) {
          alert(
            formatError(error) ||
              "Rekaman berhasil dibuat tetapi gagal diproses."
          );
        } finally {
          stopMicrophone();
        }
      };

      recorder.start();

      setRecordingTime(0);

      setIsRecording(true);

      recordingTimerRef.current =
        setInterval(() => {
          setRecordingTime(
            (current) =>
              current + 1
          );
        }, 1000);
    } catch (error) {
      if (
        error.name ===
        "NotAllowedError"
      ) {
        alert(
          "Izin mikrofon ditolak. Izinkan akses mikrofon terlebih dahulu."
        );
      } else if (
        error.name ===
        "NotFoundError"
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

${
  audio
    ? `
VOICE NOTE:
Terdapat rekaman audio yang harus Anda dengarkan dan pahami.
Gunakan isi rekaman sebagai informasi utama atau tambahan mengenai usaha.
`
    : ""
}

${
  image
    ? `
GAMBAR:
Terdapat gambar produk yang harus dianalisis.
`
    : ""
}

Gabungkan semua informasi yang tersedia.

Jangan mengarang informasi yang tidak tersedia.

Jika informasi tertentu belum tersedia, jelaskan secara jujur dan relevan.

Balas HANYA dengan JSON valid:

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
- voice note

Tugas Anda adalah memahami kondisi usaha berdasarkan informasi yang benar-benar tersedia.

Jangan mengarang:
- fakta
- angka
- persentase
- tren
- data yang tidak diberikan pengguna

Balas hanya JSON valid.
`,
        });

      const parsed =
        extractJson(raw);

      setBusiness(parsed);

      setDiagnosis(null);

      setAutopilotData(null);

      setTab("command");
    } catch (error) {
      alert(
        formatError(error) ||
          "Terjadi kesalahan saat menganalisis bisnis."
      );
    } finally {
      setBusy(false);
    }
  };

  const runDiagnosis = async () => {
    if (!business) {
      alert(
        "Ceritakan usaha terlebih dahulu."
      );

      setTab("capture");

      return;
    }

    setBusy(true);

    try {
      const prompt = `
Buat Business Diagnosis berdasarkan data bisnis berikut:

${JSON.stringify(
  business,
  null,
  2
)}

Klasifikasikan temuan secara seimbang ke dalam:

1. areaPriority
Hal yang paling perlu diprioritaskan.

2. attention
Kondisi yang perlu diperhatikan.

3. opportunity
Peluang perbaikan yang realistis.

4. strength
Kekuatan bisnis yang sudah terlihat.

PENTING:

- Jangan menciptakan angka.
- Jangan membuat persentase.
- Jangan membuat skor.
- Jangan membuat omzet.
- Jangan membuat tren tanpa data.
- Jangan menciptakan fakta baru.
- Gunakan hanya informasi yang tersedia.
- Jika data tidak cukup, nyatakan secara jujur.
- Jangan membuat semua kategori negatif.
- Buat rekomendasi praktis dan spesifik untuk UMKM.
- Evidence harus menjelaskan dasar analisis secara ringkas.

Balas HANYA dengan JSON valid:

{
  "summary": "",

  "areaPriority": {
    "title": "",
    "summary": "",
    "evidence": [],
    "impact": "",
    "recommendations": []
  },

  "attention": {
    "title": "",
    "summary": "",
    "evidence": [],
    "impact": "",
    "recommendations": []
  },

  "opportunity": {
    "title": "",
    "summary": "",
    "evidence": [],
    "impact": "",
    "recommendations": []
  },

  "strength": {
    "title": "",
    "summary": "",
    "evidence": [],
    "impact": "",
    "recommendations": []
  },

  "dataUsed": []
}
`;

      const raw =
        await askAI({
          prompt,

          system: `
Anda adalah Business Diagnosis Engine untuk UMKM Indonesia.

Diagnosis harus:

- transparan
- formal
- mudah dipahami
- berbasis bukti

Jangan mengarang data.

Jangan menggunakan angka tanpa dasar.

Balas hanya JSON valid.
`,
        });

      const parsed =
        extractJson(raw);

      setDiagnosis(parsed);

      setTab("diagnosis");
    } catch (error) {
      alert(
        formatError(error) ||
          "Business Diagnosis gagal dibuat."
      );
    } finally {
      setBusy(false);
    }
  };

  const runAutopilot = async () => {
    if (!business) {
      alert(
        "Ceritakan usaha terlebih dahulu."
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
              business: {
                ...business,
                diagnosis:
                  diagnosis || null,
              },

              duration: days,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        const message = [
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
        ]
          .filter(Boolean)
          .join("\n\n");

        throw new Error(message);
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
      alert(
        formatError(error) ||
          "Autopilot gagal."
      );
    } finally {
      setBusy(false);
    }
  };

  const getPriority = () => {
    if (
      diagnosis?.areaPriority?.title
    ) {
      return {
        title:
          diagnosis.areaPriority.title,

        text:
          diagnosis.areaPriority
            .summary ||
          "Lihat Business Diagnosis untuk penjelasan lengkap.",
      };
    }

    if (business?.problem) {
      return {
        title:
          "Memahami masalah utama",

        text:
          business.problem,
      };
    }

    return {
      title:
        "Bangun profil bisnis",

      text:
        "Ceritakan usaha Anda agar ZENAI dapat memahami kondisi bisnis dan menentukan langkah berikutnya.",
    };
  };

  const priority =
    getPriority();

  const navItems = [
    {
      id: "command",
      icon: "🏆",
      label: "Business Command",
    },

    {
      id: "capture",
      icon: "🎙",
      label: "Ceritakan Usaha",
    },

    {
      id: "diagnosis",
      icon: "🩺",
      label: "Business Diagnosis",
    },

    {
      id: "pulse",
      icon: "📡",
      label: "Business Pulse",
    },

    {
      id: "autopilot",
      icon: "⚡",
      label: "Action Autopilot",
    },
  ];

  const titles = {
    command:
      "Business Command",

    capture:
      "Ceritakan Usaha",

    diagnosis:
      "Business Diagnosis",

    pulse:
      "Business Pulse",

    autopilot:
      "Action Autopilot",
  };

  const DiagnosisCard = ({
    icon,
    label,
    data,
  }) => {
    if (!data?.title) {
      return null;
    }

    return (
      <article
        className="action"
        style={{
          marginBottom: "20px",
        }}
      >
        <h3>
          {icon} {label}
        </h3>

        <h2
          style={{
            marginTop: "10px",
          }}
        >
          {data.title}
        </h2>

        {data.summary && (
          <>
            <h4>
              Ringkasan Analisis
            </h4>

            <p>
              {data.summary}
            </p>
          </>
        )}

        {Array.isArray(
          data.evidence
        ) &&
          data.evidence.length >
            0 && (
            <>
              <h4>
                Dasar Analisis
              </h4>

              <ul>
                {data.evidence.map(
                  (
                    item,
                    index
                  ) => (
                    <li
                      key={index}
                    >
                      {item}
                    </li>
                  )
                )}
              </ul>
            </>
          )}

        {data.impact && (
          <>
            <h4>
              Potensi Dampak
            </h4>

            <p>
              {data.impact}
            </p>
          </>
        )}

        {Array.isArray(
          data.recommendations
        ) &&
          data.recommendations
            .length > 0 && (
            <>
              <h4>
                Rekomendasi Prioritas
              </h4>

              <ol>
                {data.recommendations.map(
                  (
                    item,
                    index
                  ) => (
                    <li
                      key={index}
                    >
                      {item}
                    </li>
                  )
                )}
              </ol>
            </>
          )}
      </article>
    );
  };

  return (
    <div className="app">

      <aside>
        <h2>
          ◈ ZEN
          <span>AI</span>
        </h2>

        {navItems.map(
          (item) => (
            <button
              key={item.id}
              onClick={() =>
                setTab(
                  item.id
                )
              }
              style={{
                fontWeight:
                  tab === item.id
                    ? "700"
                    : undefined,
              }}
            >
              {item.icon}{" "}
              {item.label}
            </button>
          )
        )}
      </aside>

      <main>

        <header>
          <div>
            <small>
              AI-POWERED BUSINESS
              COMMAND CENTER
            </small>

            <h1>
              {titles[tab]}
            </h1>
          </div>

          <div>
            {provider
              ? `● ${provider} aktif`
              : "● ZENAI siap membantu"}
          </div>
        </header>

        {tab ===
          "command" && (
          <section>

            <h2>
              Ringkasan Bisnis
            </h2>

            {!business ? (
              <>
                <p>
                  Mulai dengan
                  menceritakan usaha
                  Anda. ZENAI akan
                  membantu memahami
                  kondisi bisnis,
                  menemukan area yang
                  perlu diperhatikan,
                  dan menyiapkan
                  langkah berikutnya.
                </p>

                <button
                  className="primary"
                  onClick={() =>
                    setTab(
                      "capture"
                    )
                  }
                >
                  🎙 Ceritakan Usaha
                </button>
              </>
            ) : (
              <>

                <div className="cards">

                  <article>
                    <h3>
                      🏪 Bisnis
                    </h3>

                    <p>
                      {business.product ||
                        "Belum teridentifikasi"}
                    </p>
                  </article>

                                    <article>
                    <h3>
                      🎯 Target
                    </h3>

                    <p>
                      {business.target ||
                        "Belum cukup informasi"}
                    </p>
                  </article>

                  <article>
                    <h3>
                      📊 Data Bisnis
                    </h3>

                    <p>
                      ZENAI masih
                      menggunakan
                      informasi yang
                      tersedia. Skor
                      bisnis belum
                      ditampilkan
                      sebelum data
                      aktual mencukupi.
                    </p>
                  </article>

                </div>

                <div
                  style={{
                    marginTop:
                      "24px",

                    padding:
                      "20px",

                    borderRadius:
                      "14px",

                    background:
                      "#fff1e6",
                  }}
                >
                  <h3>
                    🎯 Prioritas Saat
                    Ini
                  </h3>

                  <h2>
                    {priority.title}
                  </h2>

                  <p>
                    {priority.text}
                  </p>

                  <button
                    className="primary"
                    disabled={busy}
                    onClick={() => {
                      if (
                        diagnosis
                      ) {
                        setTab(
                          "diagnosis"
                        );
                      } else {
                        runDiagnosis();
                      }
                    }}
                  >
                    {busy
                      ? "ZENAI sedang menganalisis..."
                      : diagnosis
                      ? "🩺 Lihat Diagnosis"
                      : "🩺 Buat Business Diagnosis"}
                  </button>
                </div>

                <div
                  style={{
                    marginTop:
                      "24px",
                  }}
                >
                  <h3>
                    ⚡ Status Action
                    Autopilot
                  </h3>

                  <p>
                    {autopilotData
                      ? "Strategi sudah tersedia dan dapat ditinjau kembali."
                      : "Belum ada action plan aktif."}
                  </p>

                  <button
                    onClick={() =>
                      setTab(
                        "autopilot"
                      )
                    }
                  >
                    {autopilotData
                      ? "Lihat Action Plan"
                      : "Buka Action Autopilot"}
                  </button>
                </div>

              </>
            )}
          </section>
        )}

        {tab ===
          "capture" && (
          <section>

            <h2>
              Ceritakan usaha Anda
            </h2>

            <p>
              Tidak perlu mengisi
              formulir panjang.
              Ceritakan produk,
              usaha, target
              pelanggan, atau
              kendala yang sedang
              Anda hadapi.
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

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImage
              }
            />

            {image && (
              <div>

                <br />

                <img
                  src={image}
                  alt="Produk"
                  style={{
                    width:
                      "200px",

                    borderRadius:
                      "10px",
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

            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={
                handleAudio
              }
            />

            <br />
            <br />

            <button
              onClick={() =>
                isRecording
                  ? stopRecording()
                  : startRecording()
              }
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

            {audio && (
              <div
                style={{
                  marginTop:
                    "20px",

                  padding:
                    "15px",

                  borderRadius:
                    "10px",

                  background:
                    "#f5f5f5",
                }}
              >
                <strong>
                  🎙️{" "}
                  {audioName ||
                    "Voice Note siap"}
                </strong>

                <br />
                <br />

                <audio
                  controls
                  src={audio}
                  style={{
                    width: "100%",
                    maxWidth:
                      "400px",
                  }}
                />

                <br />
                <br />

                <button
                  onClick={
                    clearAudio
                  }
                >
                  Hapus Voice Note
                </button>
              </div>
            )}

            <br />

            <button
              className="primary"
              disabled={
                busy ||
                isRecording
              }
              onClick={
                analyzeBusiness
              }
            >
              {busy
                ? "ZENAI sedang memahami usaha..."
                : "✨ Analisis Usaha"}
            </button>

          </section>
        )}

        {tab ===
          "diagnosis" && (
          <section>

            {!business && (
              <>
                <h2>
                  Belum ada
                  informasi bisnis
                </h2>

                <p>
                  Ceritakan usaha
                  Anda terlebih dahulu
                  agar ZENAI memiliki
                  dasar untuk melakukan
                  diagnosis.
                </p>

                <button
                  className="primary"
                  onClick={() =>
                    setTab(
                      "capture"
                    )
                  }
                >
                  🎙 Ceritakan Usaha
                </button>
              </>
            )}

            {business &&
              !diagnosis && (
                <>
                  <h2>
                    Business Diagnosis
                  </h2>

                  <p>
                    ZENAI akan
                    menganalisis kondisi
                    usaha berdasarkan
                    informasi yang
                    tersedia tanpa
                    membuat angka atau
                    klaim yang tidak
                    memiliki dasar.
                  </p>

                  <button
                    className="primary"
                    disabled={busy}
                    onClick={
                      runDiagnosis
                    }
                  >
                    {busy
                      ? "ZENAI sedang membuat diagnosis..."
                      : "🩺 Mulai Diagnosis"}
                  </button>
                </>
              )}

            {diagnosis && (
              <>

                <h2>
                  Business Diagnosis
                </h2>

                {diagnosis.summary && (
                  <p>
                    {diagnosis.summary}
                  </p>
                )}

                <DiagnosisCard
                  icon="🔴"
                  label="AREA PRIORITAS"
                  data={
                    diagnosis.areaPriority
                  }
                />

                <DiagnosisCard
                  icon="🟡"
                  label="PERLU DIPERHATIKAN"
                  data={
                    diagnosis.attention
                  }
                />

                <DiagnosisCard
                  icon="🔵"
                  label="PELUANG PERBAIKAN"
                  data={
                    diagnosis.opportunity
                  }
                />

                <DiagnosisCard
                  icon="🟢"
                  label="KEKUATAN BISNIS"
                  data={
                    diagnosis.strength
                  }
                />

                {Array.isArray(
                  diagnosis.dataUsed
                ) &&
                  diagnosis.dataUsed
                    .length > 0 && (
                    <div
                      style={{
                        marginTop:
                          "20px",

                        padding:
                          "16px",

                        borderRadius:
                          "12px",

                        background:
                          "#f5f5f5",
                      }}
                    >
                      <h3>
                        Informasi yang
                        Digunakan
                      </h3>

                      <ul>
                        {diagnosis.dataUsed.map(
                          (
                            item,
                            index
                          ) => (
                            <li
                              key={
                                index
                              }
                            >
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                <br />

                <button
                  className="primary"
                  disabled={busy}
                  onClick={() =>
                    setTab(
                      "autopilot"
                    )
                  }
                >
                  ⚡ Lanjut ke Action
                  Autopilot
                </button>

              </>
            )}

          </section>
        )}

        {tab ===
          "pulse" && (
          <section>

            {!business && (
              <>
                <h2>
                  Belum ada data
                  bisnis
                </h2>

                <p>
                  Business Pulse
                  membutuhkan informasi
                  bisnis sebagai titik
                  awal.
                </p>

                <button
                  className="primary"
                  onClick={() =>
                    setTab(
                      "capture"
                    )
                  }
                >
                  Mulai
                </button>
              </>
            )}

            {business && (
              <>

                <h2>
                  Business Pulse
                </h2>

                <div
                  style={{
                    padding:
                      "20px",

                    borderRadius:
                      "14px",

                    background:
                      "#f5f5f5",

                    marginBottom:
                      "24px",
                  }}
                >
                  <h3>
                    ⏳ Membangun
                    Baseline
                  </h3>

                  <p>
                    ZENAI belum memiliki
                    cukup data historis
                    untuk menyatakan
                    apakah penjualan,
                    margin, atau
                    pelanggan sedang
                    naik atau turun.
                  </p>

                  <p>
                    Pulse akan menjadi
                    lebih informatif
                    setelah tersedia
                    data berkala untuk
                    dibandingkan.
                  </p>
                </div>

                <div className="cards">

                  <article>
                    <h3>
                      🏪 Informasi
                      Bisnis
                    </h3>

                    <p>
                      {business.product ||
                        "Tersedia"}
                    </p>
                  </article>

                  <article>
                    <h3>
                      🎯 Target Pasar
                    </h3>

                    <p>
                      {business.target ||
                        "Belum cukup informasi"}
                    </p>
                  </article>

                  <article>
                    <h3>
                      📈 Perubahan
                      Bisnis
                    </h3>

                    <p>
                      Belum dapat
                      dihitung sampai
                      tersedia minimal
                      dua periode data
                      yang dapat
                      dibandingkan.
                    </p>
                  </article>

                </div>

                <div
                  style={{
                    marginTop:
                      "24px",
                  }}
                >
                  <h3>
                    Apa yang akan
                    dipantau?
                  </h3>

                  <p>
                    Ketika data
                    tersedia, Business
                    Pulse dapat membaca
                    perubahan penjualan,
                    biaya, margin,
                    pelanggan, dan
                    aktivitas bisnis
                    berdasarkan catatan
                    aktual.
                  </p>
                </div>

              </>
            )}

          </section>
        )}

        {tab ===
          "autopilot" && (
          <section>

            {!business && (
              <>
                <h2>
                  Belum ada data
                  bisnis
                </h2>

                <p>
                  Lakukan Ceritakan
                  Usaha terlebih dahulu
                  sebelum membuat
                  action plan.
                </p>

                <button
                  className="primary"
                  onClick={() =>
                    setTab(
                      "capture"
                    )
                  }
                >
                  🎙 Ceritakan Usaha
                </button>
              </>
            )}

            {business &&
              !autopilotData && (
                <>
                  <h2>
                    Action Autopilot
                  </h2>

                  <p>
                    ZENAI akan
                    mengubah informasi
                    bisnis dan hasil
                    diagnosis menjadi
                    rencana tindakan
                    yang dapat
                    dijalankan.
                  </p>

                  <select
                    value={days}
                    onChange={(event) =>
                      setDays(
                        Number(
                          event.target.value
                        )
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

                  <br />
                  <br />

                  <button
                    className="primary"
                    disabled={busy}
                    onClick={
                      runAutopilot
                    }
                  >
                    {busy
                      ? "ZENAI sedang menyiapkan action plan..."
                      : "⚡ Buat Action Plan"}
                  </button>
                </>
              )}

            {business &&
              autopilotData && (
                <>
                  <h2>
                    {
                      autopilotData
                        .mission?.title
                    }
                  </h2>

                  <p>
                    {
                      autopilotData
                        .mission?.target
                    }

                    <br />

                    Durasi:{" "}
                    {
                      autopilotData
                        .mission?.duration
                    }
                  </p>

                  <h2>
                    Action Plan
                  </h2>

                  {autopilotData.actions?.map(
                    (
                      action,
                      index
                    ) => (
                      <article
                        className="action"
                        key={index}
                        style={{
                          marginBottom:
                            "16px",
                        }}
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
                    onClick={() => {
                      setAutopilotData(
                        null
                      );

                      setTab(
                        "autopilot"
                      );
                    }}
                  >
                    Buat Action Plan
                    Baru
                  </button>
                </>
              )}

          </section>
        )}

      </main>
    </div>
  );
                }
