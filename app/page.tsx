"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { StartMenu } from "@/components/Game/StartMenu"
import { useGameStore } from "@/components/Game/store"
import { Suspense } from "react"

const GameWrapper = dynamic(() => import("@/components/Game/GameWrapper"), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-[#f0f0f0]" />,
})

export default function Page() {
  const { gameStarted, startGame } = useGameStore()

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !gameStarted) {
        startGame()
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameStarted, startGame])

  return (
    <div className="w-full h-screen bg-[#f0f0f0] overflow-hidden font-sans select-none">
      {!gameStarted ? (
        <StartMenu onStart={startGame} />
      ) : (
        <Suspense
          fallback={
            <div className="w-full h-screen bg-[#f0f0f0] flex items-center justify-center">
              <p>Loading Gallery...</p>
            </div>
          }
        >
          <GameWrapper />
        </Suspense>
      )}
    </div>
  )
}
