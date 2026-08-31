"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "zenai_growth_loop";

export default function BusinessGrowthLoop({
  strategies = [],
  onEvaluate,
}) {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setActions(JSON.parse(saved));
    } catch {
      setActions([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
    } catch {
      // Ignore localStorage errors.
    }
  }, [actions]);

  function activateStrategy(strategy) {
    const action = {
      id: Date.now(),
      title:
        strategy?.title ||
        strategy?.action ||
        "Tindakan Usaha",
      description:
        strategy?.action ||
        strategy?.description ||
        "",
      started: false,
      completed: false,
      status: "Rencana",
      createdAt: new Date().toISOString(),
    };

    setActions((prev) => {
      const exists = prev.some(
        (item) =>
          item.title === action.title &&
          item.description === action.description
      );

      return exists ? prev : [action, ...prev];
    });
  }

  function startAction(id) {
    setActions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              started: true,
              completed: false,
              status: "Berjalan",
            }
          : item
      )
    );
  }

  function completeAction(id) {
    setActions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              started: true,
              completed: true,
              status: "Selesai",
            }
          : item
      )
    );
  }

  function removeAction(id) {
    setActions((prev) =>
      prev.filter((item) => item.id !== id)
    );
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

        <h2
          style={{
            margin: "6px 0",
            fontSize: 22,
          }}
        >
          Dari Strategi Menjadi Tindakan
        </h2>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            lineHeight: 1.6,
          }}
        >
          ZenAI membantu mengubah rekomendasi menjadi
          tindakan nyata yang dapat dipantau dan dievaluasi.
        </p>
      </div>

      {strategies.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3>Strategi yang tersedia</h3>

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
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <strong>
                  {strategy.title ||
                    strategy.action ||
                    `Strategi ${index + 1}`}
                </strong>

                {strategy.description && (
                  <p
                    style={{
                      color: "#64748b",
                      margin: "6px 0 12px",
                    }}
                  >
                    {strategy.description}
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
          <div
            style={{
              padding: 20,
              borderRadius: 14,
              background: "#f8fafc",
              color: "#64748b",
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
                  border: "1px solid #e2e8f0",
                  background:
                    item.completed ? "#f0fdf4" : "#ffffff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <strong>{item.title}</strong>
                    {item.description && (
                      <p
                        style={{
                          color: "#64748b",
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
                      color:
                        item.completed
                          ? "#166534"
                          : item.started
                            ? "#1d4ed8"
                            : "#64748b",
                    }}
                  >
                    {item.status}
                  </span>
                </div>

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
                        ? "#f0fdf4"
                        : "#f8fafc",
                      cursor: item.completed
                        ? "default"
                        : "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!item.started}
                      disabled={!!item.started}
                      onChange={() => startAction(item.id)}
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
                          ? "#f0fdf4"
                          : "#f8fafc",
                        cursor: item.completed
                          ? "default"
                          : "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!item.completed}
                        disabled={!!item.completed}
                        onChange={() => completeAction(item.id)}
                      />
                      <span>
                        Saya sudah menyelesaikan tindakan
                      </span>
                    </label>
                  )}
                </div>

                {item.completed && (
                  <button
                    type="button"
                    onClick={() => onEvaluate?.(item)}
                    style={{
                      marginTop: 14,
                      border: "1px solid #2563eb",
                      borderRadius: 9,
                      padding: "9px 14px",
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ↻ Evaluasi Ulang
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removeAction(item.id)}
                  style={{
                    marginTop: 10,
                    marginLeft: 8,
                    border: 0,
                    background: "transparent",
                    color: "#64748b",
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
