"use client";

import { useLocale } from "next-intl";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();

  const switchTo = (next) => {
    if (next === locale) return;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    window.location.reload();
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: 4,
        borderRadius: 999,
        background: "var(--z-surface, #ffffff)",
        border: "1px solid var(--z-border, #e5e9f2)",
        boxShadow: "0 8px 28px rgba(15,23,42,.14)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <Languages size={15} style={{ margin: "0 6px 0 8px", opacity: 0.55, color: "var(--z-muted, #64748b)" }} />
      {["id", "en"].map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            onClick={() => switchTo(code)}
            aria-pressed={active}
            style={{
              border: "none",
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.5,
              background: active
                ? "linear-gradient(135deg, #4f46e5, #06b6d4)"
                : "transparent",
              color: active ? "#ffffff" : "var(--z-muted, #64748b)",
              transition: "all .2s ease",
            }}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
