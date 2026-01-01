"use client"

import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CornerDownLeft } from "lucide-react"
import { useGameStore, artworksData } from "./store"
import { AnimatePresence, motion } from "motion/react"

export const GameUI = () => {
  const activeArtworkId = useGameStore((state) => state.activeArtworkId)
  const isDetailOpen = useGameStore((state) => state.isDetailOpen)
  const setDetailOpen = useGameStore((state) => state.setDetailOpen)

  const activeArt = artworksData.find((a) => a.id === activeArtworkId)

  return (
    <>
      <div
        className={`absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-40 transition-opacity duration-500 ${isDetailOpen ? "opacity-0" : "opacity-100"}`}
      >
        {/* Top Bar */}
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-serif italic font-bold">Fuhim</h1>
          <button className="pointer-events-auto px-4 py-2 border border-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
            Menu
          </button>
        </div>

        {/* Interaction Prompt (Dynamic) */}
        {activeArtworkId && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest animate-pulse">
              Press Enter to View
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="flex flex-col items-center gap-6">
          {/* Key Hints */}
          <div className="flex items-end gap-12 text-black/60">
            {/* Move Controls */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                <div className="w-8 h-8 border border-black flex items-center justify-center rounded">
                  <ArrowUp size={16} />
                </div>
              </div>
              <div className="flex gap-1">
                <div className="w-8 h-8 border border-black flex items-center justify-center rounded">
                  <ArrowLeft size={16} />
                </div>
                <div className="w-8 h-8 border border-black flex items-center justify-center rounded">
                  <ArrowDown size={16} />
                </div>
                <div className="w-8 h-8 border border-black flex items-center justify-center rounded">
                  <ArrowRight size={16} />
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest mt-1">Move</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border border-black flex items-center justify-center rounded bg-black text-white">
                <CornerDownLeft size={16} />
              </div>
              <span className="text-[10px] uppercase tracking-widest mt-1">Enter</span>
            </div>
          </div>

          <p className="text-[10px] text-black/40 uppercase tracking-widest">
            {activeArtworkId ? "Focusing on Artwork" : "Walk around to explore"}
          </p>
        </div>
      </div>

      {/* DETAIL MODAL (Overlay) */}
      <AnimatePresence>
        {isDetailOpen && activeArt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#f0f0f0] flex items-center justify-center p-4 md:p-12 lg:p-20"
          >
            <div className="w-full h-full border border-black p-6 md:p-8 relative flex flex-col md:flex-row gap-10 md:gap-12 lg:gap-16 overflow-hidden bg-white">
              <button
                onClick={() => setDetailOpen(false)}
                className="absolute top-6 right-6 z-50 w-12 h-12 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 hover:rotate-90"
              >
                ✕
              </button>

              <div className="flex-1 bg-neutral-100 flex items-center justify-center overflow-hidden p-4 md:p-8">
                <img
                  src={activeArt.url || "/placeholder.svg"}
                  alt={activeArt.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="w-full md:w-2/5 lg:w-1/3 flex flex-col justify-center border-l border-black/10 pl-6 md:pl-10 lg:pl-12 pr-4 md:pr-6">
                <h2 className="text-3xl md:text-4xl font-serif italic mb-6">{activeArt.title}</h2>
                <div className="w-16 h-px bg-black mb-10"></div>
                <p className="font-serif text-base md:text-lg leading-relaxed text-neutral-600 mb-16">
                  "{activeArt.desc}"
                </p>

                <div className="mt-auto space-y-3 text-xs uppercase tracking-widest text-neutral-400">
                  <div>Artist: Unknown</div>
                  <div>Year: 2026</div>
                  <div>Medium: Digital Coal</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
