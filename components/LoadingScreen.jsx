"use client";

import { motion } from "framer-motion";

export default function LoadingScreen({ darkMode = false }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--bg-primary)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 mx-auto mb-6 rounded-full border-2 border-brand-500 border-t-transparent"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[var(--text-muted)] text-sm font-medium"
        >
          Loading ZENAI...
        </motion.p>
      </motion.div>
    </div>
  );
}