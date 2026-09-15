"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

export default function BusinessGrowthLoop({
  strategies = [],
  actions = [],
  onActionsChange,
  onEvaluate,
  evaluating = false,
  darkMode = false,
}) {
  const locale = useLocale();
  const uiText = (id, en) => (locale === "en" ? en : id);
  const statusText = (status) => ({
    Rencana: uiText("Rencana", "Planned"),
    Berjalan: uiText("Berjalan", "In Progress"),
    "Menunggu Evaluasi": uiText("Menunggu Evaluasi", "Awaiting Evaluation"),
    Dievaluasi: uiText("Dievaluasi", "Evaluated"),
  }[status] || status);
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
        uiText('Tindakan Usaha','Business Action'),
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
      item.evaluation?.outcome || uiText('membaik','improving')
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
          {uiText("SIKLUS PENGEMBANGAN BISNIS", "BUSINESS GROWTH LOOP")}
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
          {uiText("Dari Strategi Menjadi Tindakan", "From Strategy to Action")}
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
          {uiText(
            "Pilih tindakan, jalankan, lalu beri hasil sederhana. ZenAI akan menggunakan hasil tersebut untuk membuat evaluasi dan strategi berikutnya.",
            "Choose an action, run it, then provide a simple result. ZenAI will use that result to create the next evaluation and strategy."
          )}
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
            {uiText("Strategi yang tersedia", "Available strategies")}
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
                    uiText(`Strategi ${index + 1}`, `Strategy ${index + 1}`)}
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
                    {uiText("Tujuan", "Purpose")}: {strategy.purpose}
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
                  {uiText("+ Jadikan Tindakan", "+ Make This an Action")}
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
          {uiText("Tindakan Aktif", "Active Actions")}
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
            {uiText(
              "Belum ada tindakan aktif.",
              "No active actions yet."
            )}
            <br />
            {uiText(
              "Aktifkan strategi untuk mulai menjalankan Growth Loop.",
              "Activate a strategy to start the Growth Loop."
            )}
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
                    {statusText(item.status)}
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
                        {uiText("Saya sudah mulai menjalankan tindakan", "I have started running the action")}
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
                          {uiText("Saya sudah menyelesaikan tindakan", "I have completed the action")}
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
                        {uiText("Tindakan selesai.", "Action completed.")}
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
                        {uiText(
                          "Beri tahu ZenAI hasilnya agar analisis berikutnya tidak hanya mengulang rekomendasi lama.",
                          "Tell ZenAI the result so the next analysis does not simply repeat the previous recommendation."
                        )}
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
                        {uiText("Evaluasi Hasil", "Evaluate Result")}
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
                        {uiText("Hasil tindakan", "Action result")}
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
                        {uiText("Kondisi setelah tindakan", "Condition after action")}

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
                          <option value="membaik">{uiText('Membaik','Improving')}</option>

                          <option value="tetap">
                            {uiText("Belum terlihat perubahan", "No visible change yet")}
                          </option>

                          <option value="memburuk">{uiText('Memburuk','Worsening')}</option>

                          <option value="belum_terukur">{uiText('Belum dapat diukur','Not measurable yet')}</option>
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
>{uiText('Catatan hasil (opsional)','Result note (optional)')}<textarea
    value={note}
    onChange={(event) =>
      setNote(event.target.value)
    }
    rows={3}
    placeholder={uiText('Contoh: pelanggan mulai bertambah, tetapi belum stabil.','Example: customers are starting to grow, but not consistently yet.')}
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
      ? uiText("ZENAI sedang mengevaluasi...", "ZENAI is evaluating...")
      : uiText("Simpan & Evaluasi Ulang", "Save & Re-evaluate")}
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
    {uiText("Batal", "Cancel")}
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
      {uiText("Hasil:", "Result:")} {" "}
      {item.evaluation.outcome === uiText('membaik','improving')
        ? uiText('Membaik','Improving')
        : item.evaluation.outcome === "tetap"
          ? "Belum terlihat perubahan"
          : item.evaluation.outcome === uiText('memburuk','worsening')
            ? uiText('Memburuk','Worsening')
            : uiText('Belum dapat diukur','Not measurable yet')}
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
      {uiText(
        "Evaluasi tersimpan. ZenAI dapat menggunakan hasil ini pada analisis berikutnya.",
        "Evaluation saved. ZenAI can use this result in the next analysis."
      )}
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
