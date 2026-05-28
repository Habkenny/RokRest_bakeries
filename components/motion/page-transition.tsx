"use client";

import { motion } from "framer-motion";

const fadeSlide = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div {...fadeSlide} className="flex min-h-0 flex-1 flex-col">
      {children}
    </motion.div>
  );
}
