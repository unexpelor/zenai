"use client";

import { motion } from "framer-motion";

export default function AuthScreen({
  darkMode,
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authLoading,
  authMessage,
  handleAuth,
  setShowAuth,
  t,
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <motion.form
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        onSubmit={handleAuth}
        className="w-full max-w-[420px] rounded-2xl p-8"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-light)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src="/zenai-logo.png"
            alt="ZENAI"
            className="w-24 h-24 object-contain mb-2"
          />
          <div className="text-xs font-bold tracking-[2px] text-brand-500">
            Know More Grow More
          </div>
          <button
            type="button"
            onClick={() => setShowAuth(false)}
            className="mt-3 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
          >
            {t("auth.backToHome")}
          </button>
        </div>

        {/* Description */}
        <p className="text-center text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
          {authMode === "login" ? t("auth.loginTitle") : t("auth.signupTitle")}
        </p>

        {/* Email */}
        <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
          {t("auth.email")}
        </label>
        <input
          type="email"
          value={authEmail}
          onChange={(e) => setAuthEmail(e.target.value)}
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl border border-[var(--border-medium)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
          placeholder="anda@email.com"
        />

        {/* Password */}
        <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
          {t("auth.password")}
        </label>
        <input
          type="password"
          value={authPassword}
          onChange={(e) => setAuthPassword(e.target.value)}
          autoComplete={authMode === "login" ? "current-password" : "new-password"}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border-medium)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
          placeholder="••••••••"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={authLoading}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 transition-all duration-200 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {authLoading
            ? t("auth.processing")
            : authMode === "login"
              ? t("auth.login")
              : t("auth.signup")}
        </button>

        {/* Message */}
        {authMessage && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-[var(--text-secondary)] text-center leading-relaxed"
          >
            {authMessage}
          </motion.div>
        )}

        {/* Toggle mode */}
        <button
          type="button"
          onClick={() => {
            setAuthMode(authMode === "login" ? "signup" : "login");
          }}
          className="mt-4 w-full text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
        >
          {authMode === "login" ? t("auth.signupPrompt") : t("auth.loginPrompt")}
        </button>
      </motion.form>
    </div>
  );
}