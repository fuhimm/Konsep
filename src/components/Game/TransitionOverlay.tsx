import React, { useEffect } from "react";
import { useGameStore } from "./store";
import { motion, AnimatePresence } from "motion/react";
import scribbleImg from "figma:asset/16381a77552cf96a299561e9a81fa84eabca5f0a.png";

export const TransitionOverlay = () => {
  const isTransitioning = useGameStore((state) => state.isTransitioning);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }} // Slower fade for dramatic effect
          className="fixed inset-0 z-[100] bg-black pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
};
