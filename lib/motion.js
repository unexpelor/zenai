"use client";

/**
 * ZENAI — SUMBER TUNGGAL NILAI MOTION
 * ------------------------------------------------------------------
 * Semua durasi, easing, dan variants animasi diambil dari file ini
 * supaya gerak di seluruh aplikasi konsisten (satu bahasa gerak).
 *
 * Aturan pakai:
 * 1. Jangan tulis durasi/easing baru di komponen — impor dari sini.
 * 2. Animasi hanya transform / opacity / filter (60fps, tanpa layout shift).
 * 3. Selalu hormati prefers-reduced-motion lewat `useReducedMotionState()`.
 *
 * File ini murni presentational: tidak menyentuh logic bisnis, state,
 * API, auth, i18n, atau data.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* 1. Durasi                                                           */
/* ------------------------------------------------------------------ */

export const DURATION = {
  micro: 0.16, // hover / tap
  fast: 0.24, // dropdown, tooltip
  base: 0.32, // transisi panel
  reveal: 0.6, // masuk saat scroll
  hero: 1.0, // hero landing page
};

/* ------------------------------------------------------------------ */
/* 2. Easing                                                           */
/* ------------------------------------------------------------------ */

export const EASE = {
  out: [0.22, 1, 0.36, 1], // standar reveal
  soft: [0.2, 0.8, 0.2, 1], // seragam dengan CSS lama
  inOut: [0.65, 0, 0.35, 1],
  linear: "linear",
};

export const SPRING = {
  soft: { type: "spring", stiffness: 140, damping: 20, mass: 0.9 },
  snappy: { type: "spring", stiffness: 320, damping: 26 },
  gentle: { type: "spring", stiffness: 90, damping: 18 },
};

/* ------------------------------------------------------------------ */
/* 3. Stagger                                                          */
/* ------------------------------------------------------------------ */

export const STAGGER = {
  tight: 0.04,
  base: 0.06,
  loose: 0.1,
  maxItems: 12, // anak ke-13 dan seterusnya tampil instan (jaga performa)
};

/** Delay untuk anak ke-`index`, dibatasi STAGGER.maxItems. */
export function staggerDelay(index, step = STAGGER.base) {
  return Math.min(index, STAGGER.maxItems) * step;
}

/* ------------------------------------------------------------------ */
/* 4. Variants siap pakai                                              */
/* ------------------------------------------------------------------ */

const withDelay = (delay, transition) =>
  delay ? { ...transition, delay } : transition;

export const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: withDelay(delay, { duration: DURATION.reveal, ease: EASE.out }),
  },
});

export const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: withDelay(delay, { duration: DURATION.base, ease: EASE.out }),
  },
});

export const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: withDelay(delay, { duration: DURATION.base, ease: EASE.out }),
  },
});

export const slideInRight = (delay = 0) => ({
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: withDelay(delay, { duration: DURATION.base, ease: EASE.out }),
  },
});

export const blurUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: withDelay(delay, { duration: DURATION.reveal, ease: EASE.out }),
  },
});

/** Parent dengan stagger otomatis untuk anak-anaknya. */
export const container = (stagger = STAGGER.base, delayChildren = 0.05) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Anak standar (dipakai bersama `container`). */
export const item = fadeUp();

/* ------------------------------------------------------------------ */
/* 5. Interaksi                                                        */
/* ------------------------------------------------------------------ */

export const hoverLift = {
  y: -3,
  scale: 1.02,
  transition: { duration: DURATION.micro, ease: EASE.out },
};

export const hoverPress = { scale: 0.97 };

export const hoverIcon = { scale: 1.08, rotate: -4 };

/** Viewport untuk whileInView — sekali jalan, tidak re-animasi saat scroll. */
export const VIEWPORT = { once: true, amount: 0.25 };

/* ------------------------------------------------------------------ */
/* 6. Hooks                                                            */
/* ------------------------------------------------------------------ */

/** Apakah pengguna memilih "reduce motion"? Aman untuk SSR. */
export function useReducedMotionState() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Reveal saat elemen masuk viewport — SEKALI SAHAJA (once).
 * State akhir selalu opacity 1 supaya teks tidak pernah "tertinggal pudar".
 */
export function useReveal({ threshold = 0.2, rootMargin = "0px 0px -8% 0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotionState();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (reduced || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, reduced]);

  return [ref, reduced ? true : inView];
}

/**
 * Reveal saat scroll yang BERTAHAP dan aman:
 * elemen hanya disembunyikan setelah observer memastikan ia masih
 * di luar layar. Jadi:
 *  - Konten yang sudah terlihat tidak pernah berkedip.
 *  - Tanpa JavaScript sama sekali, konten tetap terlihat penuh
 *    (state "idle" tidak punya gaya sembunyi).
 *
 * Kembalikan [ref, state] lalu pakai `data-state={state}` di JSX;
 * gaya CSS menangani transisinya (lihat globals.css, bagian .cs).
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = "0px 0px -10% 0px" } = {}) {
  const ref = useRef(null);
  const [state, setState] = useState("idle");
  const reduced = useReducedMotionState();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (reduced || typeof IntersectionObserver === "undefined") {
      setState("shown");
      return undefined;
    }

    let markedHidden = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setState("shown");
            observer.disconnect();
          } else if (!markedHidden) {
            markedHidden = true;
            setState("hidden");
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, reduced]);

  return [ref, reduced ? "shown" : state];
}

/**
 * Angka naik (count-up) saat terlihat. Format angka mengikuti locale.
 * Dipakai untuk metrik: omzet, laba, arus kas, dsb.
 */
export function useCountUp(target, { duration = 1200, decimals = 0, locale = "id-ID" } = {}) {
  const value = Number(target) || 0;
  const [display, setDisplay] = useState(0);
  const [ref, inView] = useReveal({ threshold: 0.4 });
  const reduced = useReducedMotionState();

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      setDisplay(value);
      return undefined;
    }

    let frame = 0;
    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduced]);

  const formatted = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(reduced ? value : display),
    [display, value, decimals, locale, reduced]
  );

  return [ref, formatted];
}

/**
 * Sorot cahaya yang mengikuti kursor (spotlight) untuk kartu premium.
 * Mengembalikan ref + handler onPointerMove untuk disebar ke elemen.
 */
export function useSpotlight() {
  const ref = useRef(null);

  const onPointerMove = useCallback((event) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--zen-px", `${event.clientX - rect.left}px`);
    node.style.setProperty("--zen-py", `${event.clientY - rect.top}px`);
  }, []);

  return [ref, onPointerMove];
}

export const motionTokens = {
  DURATION,
  EASE,
  SPRING,
  STAGGER,
};
