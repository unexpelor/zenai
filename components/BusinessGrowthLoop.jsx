"use client";

import { useState } from "react";

export default function BusinessGrowthLoop({
  strategies = [],
  actions = [],
  onActionsChange,
  onEvaluate,
  evaluating = false,
}) {
  const [evaluationOpen, setEvaluationOpen] = useState(null);
  const [outcome, setOutcome] = useState("membaik");
  const [note, setNote] = useState("");

  const updateActions = (updater) => {
    const next = typeof updater === "function" ? updater(actions) : updater;
    onActionsChange?.(next);
  };

  function activateStrategy(strategy) {
    const action = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: strategy?.title || strategy?.action || "Tindakan Usaha",
      description: strategy?.action || strategy?.description || "",
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
        (item) => item.title === action.title && item.description === action.description
      );
      return exists ? prev : [action, ...prev];
    });
  }

  function startAction(id) {
    updateActions((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, started: true, status: "Berjalan" }
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
    updateActions((prev) => prev.filter((item) => item.id !== id));
    if (evaluationOpen === id) setEvaluationOpen(null);
  }

  function openEvaluation(item) {
    setOutcome(item.evaluation?.outcome || "membaik");
    setNote(item.evaluation?.note || "");
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
        current.id === item.id ? evaluatedAction : current
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
        border: "1px solid #e2e8f0",
        background: "#ffffff",
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 1,
            color: "#16a34a",
          }}
        >
          BUSINESS GROWTH LOOP
        </div>
        <h2 style={{ margin: "6px 0", fontSize: 22 }}>
          Dari Strategi Menjadi Tindakan
        </h2>
        <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>
          Pilih tindakan, jalankan, lalu beri hasil sederhana. ZenAI akan menggunakan hasil tersebut untuk membuat evaluasi dan strategi berikutnya.
        </p>
      </div>

      {strategies.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3>Strategi yang tersedia</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {strategies.map((strategy, index) => (
              <div
                key={strategy.id || index}
                style={{
                  padding: 16,
                  borderRadius: 14,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <strong>
                  {strategy.title || strategy.action || `Strategi ${index + 1}`}
                </strong>
                {(strategy.description || strategy.action) && (
                  <p style={{ color: "#64748b", margin: "6px 0 12px", lineHeight: 1.5 }}>
                    {strategy.description || strategy.action}
                  </p>
                )}
                {strategy.purpose && (
                  <p style={{ color: "#475569", margin: "0 0 12px", fontSize: 13 }}>
                    Tujuan: {strategy.purpose}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => activateStrategy(strategy)}
                  style={{
                    border: 0,
                    borderRadius: 9,
                    padding: "9px 14px",
                    background: "#16a34a",
                    color: "#fff",
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

      <div>
        <h3>Tindakan Aktif</h3>
        {actions.length === 0 ? (
          <div style={{ padding: 20, borderRadius: 14, background: "#f8fafc", color: "#64748b" }}>
            Belum ada tindakan aktif.<br />
            Aktifkan strategi untuk mulai menjalankan Growth Loop.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {actions.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: 18,
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  background: item.evaluation ? "#f8fafc" : item.completed ? "#f0fdf4" : "#ffffff",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ minWidth: 0 }}>
                    <strong>{item.title}</strong>
                    {item.description && (
                      <p style={{ color: "#64748b", margin: "8px 0 0", lineHeight: 1.5 }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                      color: item.evaluation ? "#166534" : item.started ? "#1d4ed8" : "#64748b",
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                {!item.evaluation && (
                  <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: item.started ? "#f0fdf4" : "#f8fafc",
                        cursor: item.started ? "default" : "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!item.started}
                        disabled={!!item.started}
                        onChange={() => startAction(item.id)}
                      />
                      <span>Saya sudah mulai menjalankan tindakan</span>
                    </label>

                    {item.started && (
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 12px",
                          borderRadius: 10,
                          background: item.completed ? "#f0fdf4" : "#f8fafc",
                          cursor: item.completed ? "default" : "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!item.completed}
                          disabled={!!item.completed}
                          onChange={() => completeAction(item.id)}
                        />
                        <span>Saya sudah menyelesaikan tindakan</span>
                      </label>
                    )}
                  </div>
                )}

                {item.completed && !item.evaluation && evaluationOpen !== item.id && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: 14,
                      borderRadius: 12,
                      background: "#eff6ff",
                      color: "#1e3a8a",
                    }}
                  >
                    <strong>Tindakan selesai.</strong>
                    <div style={{ marginTop: 5, fontSize: 13 }}>
                      Beri tahu ZenAI hasilnya agar analisis berikutnya tidak hanya mengulang rekomendasi lama.
                    </div>
                    <button
                      type="button"
                      onClick={() => openEvaluation(item)}
                      disabled={evaluating}
                      style={{
                        marginTop: 10,
                        border: 0,
                        borderRadius: 9,
                        padding: "9px 14px",
                        background: "#2563eb",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: evaluating ? "not-allowed" : "pointer",
                      }}
                    >
                      Evaluasi Hasil
                    </button>
                  </div>
                )}

                {evaluationOpen === item.id && !item.evaluation && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: 16,
                      borderRadius: 12,
                      border: "1px solid #bfdbfe",
                      background: "#f8fbff",
                    }}
                  >
                    <div style={{ fontWeight: 800, marginBottom: 10 }}>Hasil tindakan</div>
                    <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 700 }}>
                      Kondisi setelah tindakan
                      <select
                        value={outcome}
                        onChange={(event) => setOutcome(event.target.value)}
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "10px 12px",
                          borderRadius: 9,
                          border: "1px solid #cbd5e1",
                          background: "#ffffff",
                          fontSize: 14,
                        }}
                      >
                        <option value="membaik">Membaik</option>
                        <option value="tetap">Belum terlihat perubahan</option>
                        <option value="memburuk">Memburuk</option>
                        <option value="belum_terukur">Belum dapat diukur</option>
                      </select>
                    </label>
                    <label style={{ display: "grid", gap: 6, marginTop: 12, fontSize: 13, fontWeight: 700 }}>
                      Catatan hasil (opsional)
                      <textarea
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        rows={3}
                        placeholder="Contoh: pelanggan mulai bertambah, tetapi belum stabil."
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          resize: "vertical",
                          padding: "10px 12px",
                          borderRadius: 9,
                          border: "1px solid #cbd5e1",
                          fontFamily: "inherit",
                          fontSize: 14,
                        }}
                      />
                    </label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                      <button
                        type="button"
                        onClick={() => submitEvaluation(item)}
                        disabled={evaluating}
                        style={{
                          border: 0,
                          borderRadius: 9,
                          padding: "10px 14px",
                          background: evaluating ? "#94a3b8" : "#16a34a",
                          color: "#fff",
                          fontWeight: 800,
                          cursor: evaluating ? "not-allowed" : "pointer",
                        }}
                      >
                        {evaluating ? "ZENAI sedang mengevaluasi..." : "Simpan & Evaluasi Ulang"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEvaluationOpen(null)}
                        disabled={evaluating}
                        style={{ border: "1px solid #cbd5e1", borderRadius: 9, padding: "10px 14px", background: "#fff", cursor: "pointer" }}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {item.evaluation && (
                  <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <div style={{ fontWeight: 800 }}>Hasil: {item.evaluation.outcome === "membaik" ? "Membaik" : item.evaluation.outcome === "tetap" ? "Belum terlihat perubahan" : item.evaluation.outcome === "memburuk" ? "Memburuk" : "Belum dapat diukur"}</div>
                    {item.evaluation.note && <div style={{ marginTop: 6, color: "#475569", lineHeight: 1.5 }}>{item.evaluation.note}</div>}
                    <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>Evaluasi tersimpan. ZenAI dapat menggunakan hasil ini pada analisis berikutnya.</div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => removeAction(item.id)}
                  style={{ marginTop: 10, border: 0, background: "transparent", color: "#64748b", cursor: "pointer" }}
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
