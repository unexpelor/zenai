{/* =========================
    PERSPEKTIF BISNIS
========================= */}

{tab === "market" && (
  <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
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
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>⚖</div>
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
          ⚖ Analisis Perspektif Bisnis
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
        <div style={{ fontSize: "42px", marginBottom: "14px" }}>⚖</div>
        <h3 style={{ margin: "0 0 8px" }}>ZenAI sedang menyusun perspektif bisnis...</h3>
        <p style={{ color: darkMode ? "#CBD5E1" : "#64748B", lineHeight: "1.6", margin: 0 }}>
          ZenAI mengumpulkan informasi eksternal, menyaring sumber, lalu menghubungkannya dengan konteks usaha Anda.
        </p>
      </div>
    )}

    {!marketLoading && marketError && (
      <div
        style={{
          background: "#FFFFFF1f2",
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
            <h3 style={{ margin: 0, fontSize: "24px" }}>⚖ Perspektif Bisnis</h3>
            <p style={{ margin: "6px 0 0", color: darkMode ? "#CBD5E1" : "#64748B", lineHeight: "1.5" }}>
              Insight pasar yang sudah dianalisis dan dikaitkan dengan usaha Anda.
            </p>
          </div>
          <button
            onClick={runMarketInsight}
            disabled={marketLoading}
            style={{
              border: "1px solid #CBD5E1",
              background: darkMode ? "#111827" : "#FFFFFF",
              color: "#334155",
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
            <div style={{ background: darkMode ? "#111827" : "#FFFFFF", border: "1px solid #d1fae5", borderRadius: "18px", padding: "22px", boxShadow: "0 8px 24px rgba(37, 99, 235, 0.06)" }}>
              <div style={{ fontSize: "12px", fontWeight: "800", color: darkMode ? "#60A5FA" : "#2563EB", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>🎯 Perspektif Utama</div>
              <p style={{ margin: 0, fontSize: "16px", lineHeight: "1.75", color: darkMode ? "#F8FAFC" : "#0F172A" }}>
                {marketData.analysis.businessPerspective || marketData.analysis.summary || "Belum tersedia."}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
              <div style={{ background: darkMode ? "#111827" : "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "20px" }}>
                <div style={{ fontWeight: "800", marginBottom: "8px" }}>📈 Kondisi Pasar</div>
                <p style={{ margin: 0, color: darkMode ? "#CBD5E1" : "#64748B", lineHeight: "1.65" }}>{marketData.analysis.marketCondition || "Belum tersedia."}</p>
              </div>
              <div
  style={{
    background: darkMode ? "#172033" : "#FFFFFF",
    border: `1px solid ${darkMode ? "#334155" : "#E2E8F0"}`,
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
    📊 Sinyal Permintaan
  </div>

  <p
    style={{
      margin: "0 0 6px",
      fontWeight: "800",
      color: darkMode ? "#F8FAFC" : "#0F172A"
    }}
  >
    {marketData.analysis.demandSignal?.status || "Tidak pasti"}
  </p>

  <p
    style={{
      margin: 0,
      color: darkMode ? "#CBD5E1" : "#475569",
      lineHeight: "1.65"
    }}
  >
    {marketData.analysis.demandSignal?.reason || "Belum tersedia."}
  </p>
</div>

<div
  style={{
    background: darkMode ? "#052E1B" : "#EFF6FF",
    border: `1px solid ${darkMode ? "#22C55E" : "#86efac"}`,
    borderRadius: "16px",
    padding: "20px",
    color: darkMode ? "#DCFCE7" : "#0F172A"
  }}
>
  <div
    style={{
      fontWeight: "800",
      color: darkMode ? "#4ADE80" : "#15803D",
      marginBottom: "10px"
    }}
  >
    💡 Peluang
  </div>

  {Array.isArray(marketData.analysis.opportunities) &&
  marketData.analysis.opportunities.length > 0 ? (
    <ul
      style={{
        margin: 0,
        paddingLeft: "20px",
        lineHeight: "1.7",
        color: darkMode ? "#DCFCE7" : "#334155"
      }}
    >
      {marketData.analysis.opportunities.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  ) : (
    <p
      style={{
        margin: 0,
        color: darkMode ? "#CBD5E1" : "#334155"
      }}
    >
      Belum tersedia.
    </p>
  )}
</div>

<div
  style={{
    background: darkMode ? "#4C0519" : "#FFF1F2",
    border: `1px solid ${darkMode ? "#FB7185" : "#FECDD3"}`,
    borderRadius: "16px",
    padding: "20px",
    color: darkMode ? "#FFE4E6" : "#9F1239"
  }}
>
  <div
    style={{
      fontWeight: "800",
      color: darkMode ? "#FB7185" : "#BE123C",
      marginBottom: "10px"
    }}
  >
    ⚠ Risiko Utama
  </div>

  {Array.isArray(marketData.analysis.risks) &&
  marketData.analysis.risks.length > 0 ? (
    <ul
      style={{
        margin: 0,
        paddingLeft: "20px",
        lineHeight: "1.7",
        color: darkMode ? "#FFE4E6" : "#9F1239"
      }}
    >
      {marketData.analysis.risks.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  ) : (
    <p
      style={{
        margin: 0,
        color: darkMode ? "#CBD5E1" : "#334155"
      }}
    >
      Belum tersedia.
    </p>
  )}
</div>

            <div style={{ background: darkMode ? "#0B1120" : "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "18px", padding: "22px" }}>
              <div style={{ fontWeight: "800", marginBottom: "8px" }}>🚀 Implikasi Strategis</div>
              <p style={{ margin: 0, color: darkMode ? "#E2E8F0" : "#334155", lineHeight: "1.75" }}>
                {marketData.analysis.strategicImplication || "Belum tersedia."}
              </p>
              {marketData.analysis.competitionInsight && (
                <p style={{ margin: "14px 0 0", color: darkMode ? "#CBD5E1" : "#64748B", lineHeight: "1.7" }}>
                  <strong>Persaingan:</strong> {marketData.analysis.competitionInsight}
                </p>
              )}
            </div>

            {marketData.analysis.scenarios && (
              <div style={{ background: darkMode ? "#111827" : "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "18px", padding: "22px" }}>
                <div style={{ fontWeight: "800", marginBottom: "14px" }}>🧭 Skenario Bisnis</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                  <div style={{ padding: "15px", borderRadius: "12px", background: darkMode ? "#064E3B" : "#EFF6FF", color: darkMode ? "#EFF6FF" : "#0F172A" }}><strong style={{ color: darkMode ? "#EFF6FF" : "#0F172A" }}>Optimistis</strong><p style={{ margin: "7px 0 0", lineHeight: "1.6", color: darkMode ? "#D1FAE5" : "#334155" }}>{marketData.analysis.scenarios.optimistic || "-"}</p></div>
                  <div style={{ padding: "15px", borderRadius: "12px", background: darkMode ? "#172554" : "#EFF6FF", color: darkMode ? "#EFF6FF" : "#0F172A" }}><strong style={{ color: darkMode ? "#EFF6FF" : "#0F172A" }}>Realistis</strong><p style={{ margin: "7px 0 0", lineHeight: "1.6", color: darkMode ? "#d1fae5" : "#334155" }}>{marketData.analysis.scenarios.realistic || "-"}</p></div>
                  <div style={{ padding: "15px", borderRadius: "12px", background: darkMode ? "#78350F" : "#FFFFFFbeb", color: darkMode ? "#FFFFFFbeb" : "#0F172A" }}><strong style={{ color: darkMode ? "#FFFFFFbeb" : "#0F172A" }}>Risiko</strong><p style={{ margin: "7px 0 0", lineHeight: "1.6", color: darkMode ? "#fef3c7" : "#334155" }}>{marketData.analysis.scenarios.risk || "-"}</p></div>
                </div>
              </div>
            )}

            {marketData.analysis.limitations && (
              <div style={{ fontSize: "12px", color: darkMode ? "#94A3B8" : "#64748B", padding: "0 2px" }}>
                Keterbatasan: {marketData.analysis.limitations}
              </div>
            )}
          </div>
        )}

        {/* SUMBER — bukti, bukan tampilan utama */}
        <details style={{ background: darkMode ? "#111827" : "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "16px 18px" }}>
          <summary style={{ cursor: "pointer", fontWeight: "800" }}>
            📚 Lihat sumber eksternal ({Array.isArray(marketData.sources) ? marketData.sources.length : 0})
          </summary>
          <div style={{ display: "grid", gap: "12px", marginTop: "14px" }}>
            {Array.isArray(marketData.sources) && marketData.sources.length > 0 ? (
              marketData.sources.map((item, index) => (
                <div key={item.url || index} style={{ background: darkMode ? "#111827" : "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "13px", padding: "16px" }}>
                  <h4 style={{ margin: "0 0 7px" }}>{item.title || "Informasi Terkini"}</h4>
                  {item.content && <p style={{ color: darkMode ? "#CBD5E1" : "#64748B", lineHeight: "1.65", margin: "0 0 10px" }}>{item.content}</p>}
                  {item.url && <a href={item.url} target="_blank" rel="noreferrer" style={{ color: darkMode ? "#60A5FA" : "#2563EB", fontWeight: "700", textDecoration: "none" }}>Buka sumber ↗</a>}
                </div>
              ))
            ) : (
              <div style={{ color: darkMode ? "#CBD5E1" : "#64748B", paddingTop: "10px" }}>Belum ditemukan sumber yang cukup relevan.</div>
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
