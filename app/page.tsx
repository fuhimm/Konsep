"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { StartMenu } from "@/components/Game/StartMenu"
import { useGameStore } from "@/components/Game/store"

const GameWrapper = dynamic(() => import("@/components/Game/GameWrapper"), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-[#f0f0f0]" />,
})

export default function Page() {
  const { gameStarted, startGame } = useGameStore()

  useEffect(() => {
    if (!gameStarted) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          startGame()
        }
      }
      window.addEventListener("keydown", handleKeyPress)
      return () => window.removeEventListener("keydown", handleKeyPress)
    }
  }, [gameStarted, startGame])

  return (
    <div className="w-full h-screen bg-[#f0f0f0] overflow-hidden font-sans select-none">
      {!gameStarted ? <StartMenu onStart={startGame} /> : <GameWrapper />}
    </div>
  )
}
