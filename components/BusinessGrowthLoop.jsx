"use client";

import { useState } from "react";

export default function BusinessGrowthLoop({
  strategies = [],
  actions = [],
  onActionsChange,
  onEvaluate,
  evaluating = false,
  darkMode = false,
}) {
  const [evaluationOpen, setEvaluationOpen] = useState(null);
  const [outcome, setOutcome] = useState("membaik");
  const [note, setNote] = useState("");

  const updateActions = (updater) => {
    const next =
      typeof updater === "function" ? updater(actions) : updater;

    onActionsChange?.(next);
  };

  function activateStrategy(strategy) {
    const action = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title:
        strategy?.title ||
        strategy?.action ||
        "Tindakan Usaha",
      description:
        strategy?.action ||
        strategy?.description ||
        "",
      purpose: strategy?.purpose || "",
      started: false,
      completed: false,
      status: "Rencana",
      createdAt: new Date().toISOString(),
      completedAt: null,
      evaluation: null,
    };

    updateActions((prev) => {
      const exists = prev.some(
        (item) =>
          item.title === action.title &&
          item.description === action.description
      );

      return exists ? prev : [action, ...prev];
    });
  }

  function startAction(id) {
    updateActions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              started: true,
              status: "Berjalan",
            }
          : item
      )
    );
  }

  function completeAction(id) {
    updateActions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              started: true,
              completed: true,
              status: "Menunggu Evaluasi",
              completedAt: new Date().toISOString(),
            }
          : item
      )
    );
  }

  function removeAction(id) {
    updateActions((prev) =>
      prev.filter((item) => item.id !== id)
    );

    if (evaluationOpen === id) {
      setEvaluationOpen(null);
    }
  }

  function openEvaluation(item) {
    setOutcome(
      item.evaluation?.outcome || "membaik"
    );

    setNote(
      item.evaluation?.note || ""
    );

    setEvaluationOpen(item.id);
  }

  async function submitEvaluation(item) {
    const evaluatedAction = {
      ...item,
      status: "Dievaluasi",
      evaluation: {
        outcome,
        note: note.trim(),
        evaluatedAt: new Date().toISOString(),
      },
    };

    updateActions((prev) =>
      prev.map((current) =>
        current.id === item.id
          ? evaluatedAction
          : current
      )
    );

    setEvaluationOpen(null);
    setNote("");

    await onEvaluate?.(evaluatedAction);
  }

  return (
    <section
      style={{
        marginTop: 24,
        padding: 24,
        borderRadius: 20,
        border: `1px solid ${
          darkMode ? "#334155" : "#E2E8F0"
        }`,
        background: darkMode
          ? "#111827"
          : "#FFFFFF",
        color: darkMode
          ? "#F8FAFC"
          : "#0F172A",
        boxShadow: darkMode
          ? "0 8px 24px rgba(0,0,0,0.20)"
          : "0 8px 24px rgba(15,23,42,0.05)",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 1,
            color: darkMode
              ? "#86EFAC"
              : "#15803D",
          }}
        >
          BUSINESS GROWTH LOOP
        </div>

        <h2
          style={{
            margin: "6px 0",
            fontSize: 22,
            color: darkMode
              ? "#F8FAFC"
              : "#0F172A",
          }}
        >
          Dari Strategi Menjadi Tindakan
        </h2>

        <p
          style={{
            margin: 0,
            color: darkMode
              ? "#CBD5E1"
              : "#64748B",
            lineHeight: 1.6,
          }}
        >
          Pilih tindakan, jalankan, lalu beri hasil sederhana.
          ZenAI akan menggunakan hasil tersebut untuk membuat
          evaluasi dan strategi berikutnya.
        </p>
      </div>

      {/* STRATEGI YANG TERSEDIA */}
      {strategies.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3
            style={{
              color: darkMode
                ? "#F8FAFC"
                : "#0F172A",
              marginBottom: 12,
            }}
          >
            Strategi yang tersedia
          </h3>

          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            {strategies.map((strategy, index) => (
              <div
                key={strategy.id || index}
                style={{
                  padding: 16,
                  borderRadius: 14,
                  background: darkMode
                    ? "#172033"
                    : "#F8FAFC",
                  border: `1px solid ${
                    darkMode
                      ? "#334155"
                      : "#E2E8F0"
                  }`,
                }}
              >
                <strong
                  style={{
                    color: darkMode
                      ? "#F8FAFC"
                      : "#0F172A",
                  }}
                >
                  {strategy.title ||
                    strategy.action ||
                    `Strategi ${index + 1}`}
                </strong>

                {(strategy.description ||
                  strategy.action) && (
                  <p
                    style={{
                      color: darkMode
                        ? "#CBD5E1"
                        : "#64748B",
                      margin: "6px 0 12px",
                      lineHeight: 1.5,
                    }}
                  >
                    {strategy.description ||
                      strategy.action}
                  </p>
                )}

                {strategy.purpose && (
                  <p
                    style={{
                      color: darkMode
                        ? "#CBD5E1"
                        : "#475569",
                      margin: "0 0 12px",
                      fontSize: 13,
                    }}
                  >
                    Tujuan: {strategy.purpose}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() =>
                    activateStrategy(strategy)
                  }
                  style={{
                    border: `1px solid ${
                      darkMode
                        ? "#22C55E"
                        : "#16A34A"
                    }`,
                    borderRadius: 9,
                    padding: "9px 14px",
                    background: darkMode
                      ? "#166534"
                      : "#16A34A",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  + Jadikan Tindakan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TINDAKAN AKTIF */}
      <div>
        <h3
          style={{
            color: darkMode
              ? "#F8FAFC"
              : "#0F172A",
          }}
        >
          Tindakan Aktif
        </h3>

        {actions.length === 0 ? (
          <div
            style={{
              padding: 20,
              borderRadius: 14,
              background: darkMode
                ? "#172033"
                : "#F8FAFC",
              border: `1px solid ${
                darkMode
                  ? "#334155"
                  : "#E2E8F0"
              }`,
              color: darkMode
                ? "#CBD5E1"
                : "#64748B",
            }}
          >
            Belum ada tindakan aktif.
            <br />
            Aktifkan strategi untuk mulai menjalankan
            Growth Loop.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 12,
            }}
          >
            {actions.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: 18,
                  borderRadius: 14,
                  border: `1px solid ${
                    darkMode
                      ? "#334155"
                      : "#E2E8F0"
                  }`,
                  background: darkMode
                    ? item.evaluation
                      ? "#172033"
                      : item.completed
                        ? "#052E1B"
                        : "#111827"
                    : item.evaluation
                      ? "#F8FAFC"
                      : item.completed
                        ? "#F0FDF4"
                        : "#FFFFFF",
                }}
              >
                {/* JUDUL + STATUS */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      minWidth: 0,
                    }}
                  >
                    <strong
                      style={{
                        color: darkMode
                          ? "#F8FAFC"
                          : "#0F172A",
                      }}
                    >
                      {item.title}
                    </strong>

                    {item.description && (
                      <p
                        style={{
                          color: darkMode
                            ? "#CBD5E1"
                            : "#64748B",
                          margin: "8px 0 0",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                      color: item.evaluation
                        ? darkMode
                          ? "#86EFAC"
                          : "#166534"
                        : item.started
                          ? darkMode
                            ? "#93C5FD"
                            : "#1D4ED8"
                          : darkMode
                            ? "#94A3B8"
                            : "#64748B",
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                {/* CHECKLIST */}
                {!item.evaluation && (
                  <div
                    style={{
                      marginTop: 16,
                      display: "grid",
                      gap: 10,
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: item.started
                          ? darkMode
                            ? "#052E1B"
                            : "#F0FDF4"
                          : darkMode
                            ? "#172033"
                            : "#F8FAFC",
                        color: darkMode
                          ? "#E2E8F0"
                          : "#334155",
                        cursor: item.started
                          ? "default"
                          : "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!item.started}
                        disabled={!!item.started}
                        onChange={() =>
                          startAction(item.id)
                        }
                      />

                      <span>
                        Saya sudah mulai menjalankan tindakan
                      </span>
                    </label>

                    {item.started && (
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 12px",
                          borderRadius: 10,
                          background: item.completed
                            ? darkMode
                              ? "#052E1B"
                              : "#F0FDF4"
                            : darkMode
                              ? "#172033"
                              : "#F8FAFC",
                          color: darkMode
                            ? "#E2E8F0"
                            : "#334155",
                          cursor: item.completed
                            ? "default"
                            : "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!item.completed}
                          disabled={!!item.completed}
                          onChange={() =>
                            completeAction(item.id)
                          }
                        />

                        <span>
                          Saya sudah menyelesaikan tindakan
                        </span>
                      </label>
                    )}
                  </div>
                )}

                {/* SELESAI → EVALUASI */}
                {item.completed &&
                  !item.evaluation &&
                  evaluationOpen !== item.id && (
                    <div
                      style={{
                        marginTop: 14,
                        padding: 14,
                        borderRadius: 12,
                        background: darkMode
                          ? "#172554"
                          : "#EFF6FF",
                        border: `1px solid ${
                          darkMode
                            ? "#3B82F6"
                            : "#BFDBFE"
                        }`,
                        color: darkMode
                          ? "#BFDBFE"
                          : "#1E3A8A",
                      }}
                    >
                      <strong>
                        Tindakan selesai.
                      </strong>

                      <div
                        style={{
                          marginTop: 5,
                          fontSize: 13,
                          lineHeight: 1.5,
                          color: darkMode
                            ? "#CBD5E1"
                            : "#334155",
                        }}
                      >
                        Beri tahu ZenAI hasilnya agar
                        analisis berikutnya tidak hanya
                        mengulang rekomendasi lama.
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openEvaluation(item)
                        }
                        disabled={evaluating}
                        style={{
                          marginTop: 10,
                          border: `1px solid ${
                            darkMode
                              ? "#60A5FA"
                              : "#2563EB"
                          }`,
                          borderRadius: 9,
                          padding: "9px 14px",
                          background: darkMode
                            ? "#1D4ED8"
                            : "#2563EB",
                          color: "#FFFFFF",
                          fontWeight: 700,
                          cursor: evaluating
                            ? "not-allowed"
                            : "pointer",
                        }}
                      >
                        Evaluasi Hasil
                      </button>
                    </div>
                  )}

                {/* FORM EVALUASI */}
                {evaluationOpen === item.id &&
                  !item.evaluation && (
                    <div
                      style={{
                        marginTop: 14,
                        padding: 16,
                        borderRadius: 12,
                        border: `1px solid ${
                          darkMode
                            ? "#475569"
                            : "#BFDBFE"
                        }`,
                        background: darkMode
                          ? "#172033"
                          : "#F8FBFF",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          marginBottom: 10,
                          color: darkMode
                            ? "#F8FAFC"
                            : "#0F172A",
                        }}
                      >
                        Hasil tindakan
                      </div>

                      <label
                        style={{
                          display: "grid",
                          gap: 6,
                          fontSize: 13,
                          fontWeight: 700,
                          color: darkMode
                            ? "#E2E8F0"
                            : "#334155",
                        }}
                      >
                        Kondisi setelah tindakan

                        <select
                          value={outcome}
                          onChange={(event) =>
                            setOutcome(
                              event.target.value
                            )
                          }
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "10px 12px",
                            borderRadius: 9,
                            border: `1px solid ${
                              darkMode
                                ? "#475569"
                                : "#CBD5E1"
                            }`,
                            background: darkMode
                              ? "#0F172A"
                              : "#FFFFFF",
                            color: darkMode
                              ? "#F8FAFC"
                              : "#0F172A",
                            fontSize: 14,
                          }}
                        >
                          <option value="membaik">
                            Membaik
                          </option>

                          <option value="tetap">
                            Belum terlihat perubahan
                          </option>

                          <option value="memburuk">
                            Memburuk
                          </option>

                          <option value="belum_terukur">
                            Belum dapat diukur
                          </option>
                        </select>
                      </label>

                      <label
  style={{
    display: "grid",
    gap: 6,
    marginTop: 12,
    fontSize: 13,
    fontWeight: 700,
    color: darkMode ? "#E2E8F0" : "#334155",
  }}
>
  Catatan hasil (opsional)

  <textarea
    value={note}
    onChange={(event) =>
      setNote(event.target.value)
    }
    rows={3}
    placeholder="Contoh: pelanggan mulai bertambah, tetapi belum stabil."
    style={{
      width: "100%",
      boxSizing: "border-box",
      resize: "vertical",
      padding: "10px 12px",
      borderRadius: 9,
      border: `1px solid ${
        darkMode ? "#475569" : "#CBD5E1"
      }`,
      background: darkMode
        ? "#0F172A"
        : "#FFFFFF",
      color: darkMode
        ? "#F8FAFC"
        : "#0F172A",
      fontFamily: "inherit",
      fontSize: 14,
    }}
  />
</label>

<div
  style={{
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 12,
  }}
>
  <button
    type="button"
    onClick={() => submitEvaluation(item)}
    disabled={evaluating}
    style={{
      border: `1px solid ${
        darkMode ? "#22C55E" : "#16A34A"
      }`,
      borderRadius: 9,
      padding: "10px 14px",
      background: evaluating
        ? "#64748B"
        : darkMode
          ? "#166534"
          : "#16A34A",
      color: "#FFFFFF",
      fontWeight: 800,
      cursor: evaluating
        ? "not-allowed"
        : "pointer",
    }}
  >
    {evaluating
      ? "ZENAI sedang mengevaluasi..."
      : "Simpan & Evaluasi Ulang"}
  </button>

  <button
    type="button"
    onClick={() => setEvaluationOpen(null)}
    disabled={evaluating}
    style={{
      border: `1px solid ${
        darkMode ? "#475569" : "#CBD5E1"
      }`,
      borderRadius: 9,
      padding: "10px 14px",
      background: darkMode
        ? "#172033"
        : "#FFFFFF",
      color: darkMode
        ? "#CBD5E1"
        : "#334155",
      cursor: "pointer",
    }}
  >
    Batal
  </button>
</div>
</div>
)}

{/* HASIL EVALUASI */}
{item.evaluation && (
  <div
    style={{
      marginTop: 14,
      padding: 14,
      borderRadius: 12,
      background: darkMode
        ? "#052E1B"
        : "#F0FDF4",
      border: `1px solid ${
        darkMode
          ? "#22C55E"
          : "#BBF7D0"
      }`,
    }}
  >
    <div
      style={{
        fontWeight: 800,
        color: darkMode
          ? "#86EFAC"
          : "#15803D",
      }}
    >
      Hasil:{" "}
      {item.evaluation.outcome === "membaik"
        ? "Membaik"
        : item.evaluation.outcome === "tetap"
          ? "Belum terlihat perubahan"
          : item.evaluation.outcome === "memburuk"
            ? "Memburuk"
            : "Belum dapat diukur"}
    </div>

    {item.evaluation.note && (
      <div
        style={{
          marginTop: 6,
          color: darkMode
            ? "#CBD5E1"
            : "#475569",
          lineHeight: 1.5,
        }}
      >
        {item.evaluation.note}
      </div>
    )}

    <div
      style={{
        marginTop: 8,
        fontSize: 12,
        color: darkMode
          ? "#94A3B8"
          : "#64748B",
      }}
    >
      Evaluasi tersimpan. ZenAI dapat menggunakan
      hasil ini pada analisis berikutnya.
    </div>
  </div>
)}

{/* HAPUS */}
<button
  type="button"
  onClick={() => removeAction(item.id)}
  style={{
    marginTop: 10,
    border: 0,
    background: "transparent",
    color: darkMode
      ? "#94A3B8"
      : "#64748B",
    cursor: "pointer",
  }}
>
  Hapus
</button>
</div>
))}
</div>
)}
</div>
</section>
);
}
