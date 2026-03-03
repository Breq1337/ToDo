/**
 * Reusable Framer Motion variants — premium, subtle, 60fps.
 * Respect prefers-reduced-motion via reduced variant.
 */

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  reduced: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  reduced: { opacity: 1 },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
  reduced: { opacity: 1, transition: { staggerChildren: 0, delayChildren: 0 } },
};

export const sectionReveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  reduced: { opacity: 1, y: 0 },
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4 },
};

export const buttonTap = { scale: 0.98 };
