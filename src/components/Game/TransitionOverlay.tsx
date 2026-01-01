"use client"

import { useGameStore } from "./store"
import { motion, AnimatePresence } from "motion/react"

export const TransitionOverlay = () => {
  const isTransitioning = useGameStore((state) => state.isTransitioning)

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[100] bg-black pointer-events-none"
        />
      )}
    </AnimatePresence>
  )
}
