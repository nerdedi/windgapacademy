/**
 * Wes Anderson × Pixar animation system — Windgap Academy
 *
 * Wes Anderson:  precise symmetry, deliberate lateral slides, title-card timing
 * Pixar:         spring physics, squash-&-stretch, character personality, delight
 */

// ── Page transitions ─────────────────────────────────────────────────────────
// Slide up from slightly below, spring to place (gravity = Pixar weight)
export const pageVariants = {
  initial: { opacity: 0, y: 22, scale: 0.984 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 24, mass: 0.9 },
  },
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.988,
    transition: { duration: 0.18, ease: [0.4, 0, 0.8, 0.6] },
  },
};

// ── Card stagger grid ─────────────────────────────────────────────────────────
// Wes Anderson: each card placed with deliberate timing
export const staggerGrid = {
  initial: {},
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
};

export const cardVariant = {
  initial: { opacity: 0, y: 30, scale: 0.93 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 340, damping: 24 },
  },
};

// ── Directional step slide (lesson player) ────────────────────────────────────
// custom = 1 (forward) or -1 (backward) — Wes Anderson lateral camera pan
export const stepSlide = {
  initial: (dir) => ({ opacity: 0, x: 70 * dir, scale: 0.97 }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
  exit: (dir) => ({
    opacity: 0,
    x: -55 * dir,
    scale: 0.97,
    transition: { duration: 0.16, ease: "easeIn" },
  }),
};

// ── Feedback pop ──────────────────────────────────────────────────────────────
// Pixar delight — answer feedback snaps in with bounce overshoot
export const feedbackPop = {
  initial: { opacity: 0, scale: 0.72, y: 8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 520, damping: 18 },
  },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.12 } },
};

// ── Character idle bob ────────────────────────────────────────────────────────
// Pixar: characters breathe and bob to show they're alive
export const charBob = {
  animate: {
    y: [0, -8, 0, -4, 0],
    rotate: [0, 1.4, 0, -0.9, 0],
    scale: [1, 1.025, 1, 1.012, 1],
    transition: {
      duration: 3.8,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.22, 0.5, 0.72, 1],
    },
  },
};

// Slightly faster bob for smaller characters
export const charBobSm = {
  animate: {
    y: [0, -5, 0, -2.5, 0],
    rotate: [0, 1, 0, -0.6, 0],
    transition: {
      duration: 3.2,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.22, 0.5, 0.72, 1],
    },
  },
};

// ── Button spring physics ─────────────────────────────────────────────────────
// Pixar squash-and-stretch — satisfying press feedback
export const btnSpring = { type: "spring", stiffness: 420, damping: 15 };
export const btnHover = { scale: 1.05, y: -2 };
export const btnTap = { scale: 0.93, y: 2 };

// ── Slide helpers (Wes Anderson lateral slides) ───────────────────────────────
export const slideLeft = {
  initial: { opacity: 0, x: -36 },
  animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 360, damping: 28 } },
};
export const slideRight = {
  initial: { opacity: 0, x: 36 },
  animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 360, damping: 28 } },
};
export const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 26 } },
};

// ── Pop-in for modals / dialogs ───────────────────────────────────────────────
export const popIn = {
  initial: { opacity: 0, scale: 0.86, y: 14 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.14 } },
};

// ── Celebration burst ─────────────────────────────────────────────────────────
// Pixar moment-of-delight — correct answer / achievement unlock
export const celebration = {
  initial: { scale: 0, rotate: -15, opacity: 0 },
  animate: {
    scale: [0, 1.35, 0.88, 1.08, 1],
    rotate: [-15, 6, -4, 2, 0],
    opacity: [0, 1, 1, 1, 1],
    transition: {
      duration: 0.65,
      times: [0, 0.28, 0.52, 0.75, 1],
      ease: "easeOut",
    },
  },
};

// ── Section heading (Wes Anderson title-card reveal) ─────────────────────────
export const headingReveal = {
  initial: { opacity: 0, x: -20, skewX: -4 },
  animate: {
    opacity: 1,
    x: 0,
    skewX: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
};
