"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // Skip the entrance animation on the very first paint so the page's
  // content (and its LCP element) renders immediately rather than starting
  // at opacity:0 and waiting for hydration. Route changes after mount still
  // animate normally.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (reduce)
    return (
      <main id="main-content" className="flex-1">
        {children}
      </main>
    );

  return (
    <motion.main
      id="main-content"
      key={pathname}
      initial={mounted ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex-1"
    >
      {children}
    </motion.main>
  );
}
