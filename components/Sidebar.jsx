"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Edit3,
  Activity,
  Search,
  TrendingUp,
  Lightbulb,
  FileText,
  Sparkles,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Languages,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "home", icon: LayoutDashboard, labelKey: "nav.dashboard" },
  { id: "capture", icon: Edit3, labelKey: "nav.capture" },
  { id: "pulse", icon: Activity, labelKey: "nav.pulse" },
  { id: "diagnosis", icon: Search, labelKey: "nav.diagnosis" },
  { id: "market", icon: TrendingUp, labelKey: "nav.perspective" },
  { id: "autopilot", icon: Lightbulb, labelKey: "nav.strategy" },
  { id: "finance", icon: FileText, labelKey: "nav.finance" },
  { id: "advancedAnalysis", icon: Sparkles, labelKey: "nav.advanced" },
];

const BOTTOM_ITEMS = [
  { id: "guide", icon: HelpCircle, labelKey: "nav.guide" },
  { id: "settings", icon: Settings, labelKey: "nav.settings" },
];

const containerVariants = {
  open: { width: 260, transition: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] } },
  closed: { width: 72, transition: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] } },
};

const itemVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 1, x: 0 },
};

export default function Sidebar({
  tab,
  setTab,
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  locale,
  setLocale,
  t,
  handleLogout,
  isMobile,
  session,
}) {
  const isActive = (id) => tab === id;

  const toggleLocale = () => {
    const next = locale === "id" ? "en" : "id";
    setLocale(next);
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000`;
    window.location.reload();
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={containerVariants}
        animate={isMobile ? (sidebarOpen ? "open" : "closed") : sidebarOpen ? "open" : "closed"}
        className={`fixed left-0 top-0 h-full z-50 flex flex-col overflow-hidden
          ${isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : ""}
          ${isMobile ? "shadow-2xl" : ""}
        `}
        style={{
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-light)",
        }}
      >
        {/* Toggle + Logo area */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <motion.div
            className="flex items-center gap-3 overflow-hidden"
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
          >
            <img
              src={sidebarOpen ? "/zenai-logo.png" : "/zenai-mark.png"}
              alt="ZENAI"
              className="w-9 h-9 object-contain"
            />
            {sidebarOpen && (
              <div>
                <div className="text-sm font-bold tracking-wider text-[var(--text-primary)]">
                  ZENAI
                </div>
                <div className="text-[9px] text-[var(--text-muted)] tracking-wide">
                  AI Business Assistant
                </div>
              </div>
            )}
          </motion.div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin">
          {NAV_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const active = isActive(item.id);
            return (
              <motion.button
                key={item.id}
                variants={itemVariants}
                onClick={() => {
                  setTab(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800 shadow-sm"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] border border-transparent"
                  }
                  ${!sidebarOpen ? "justify-center px-0" : ""}
                `}
                title={!sidebarOpen ? t(item.labelKey) : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate"
                  >
                    {t(item.labelKey)}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-3 border-t border-[var(--border-light)] space-y-1">
          {BOTTOM_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] border border-transparent"
                  }
                  ${!sidebarOpen ? "justify-center px-0" : ""}
                `}
                title={!sidebarOpen ? t(item.labelKey) : undefined}
              >
                <Icon size={17} className="flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{t(item.labelKey)}</span>}
              </button>
            );
          })}

          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all
              text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] border border-transparent
              ${!sidebarOpen ? "justify-center px-0" : ""}
            `}
            title={!sidebarOpen ? (locale === "id" ? "English" : "Bahasa Indonesia") : undefined}
          >
            <Languages size={17} className="flex-shrink-0" />
            {sidebarOpen && (
              <span className="truncate">{locale === "id" ? "English" : "Bahasa Indonesia"}</span>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all
              text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] border border-transparent
              ${!sidebarOpen ? "justify-center px-0" : ""}
            `}
            title={!sidebarOpen ? (darkMode ? "Light mode" : "Dark mode") : undefined}
          >
            {darkMode ? <Sun size={17} className="flex-shrink-0" /> : <Moon size={17} className="flex-shrink-0" />}
            {sidebarOpen && <span className="truncate">{darkMode ? t("settings.lightMode") : t("settings.darkMode")}</span>}
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              const ok = window.confirm(t("auth.logoutConfirm"));
              if (ok) handleLogout();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all
              text-red-500 hover:bg-red-50 dark:hover:bg-red-950 border border-transparent
              ${!sidebarOpen ? "justify-center px-0" : ""}
            `}
            title={!sidebarOpen ? t("nav.logout") : undefined}
          >
            <LogOut size={17} className="flex-shrink-0" />
            {sidebarOpen && <span className="truncate">{t("nav.logout")}</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}