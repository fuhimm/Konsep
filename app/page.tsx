"use client"

import { Suspense, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Loader } from "@react-three/drei"
import { Scene } from "@/components/Game/Scene"
import { GameUI } from "@/components/Game/GameUI"
import { TransitionOverlay } from "@/components/Game/TransitionOverlay"
import { StartMenu } from "@/components/Game/StartMenu"
import { useGameStore } from "@/components/Game/store"
import ClientOnly from "@/components/Game/ClientOnly"

export const dynamic = "force-dynamic"

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
      {!gameStarted && <StartMenu onStart={startGame} />}

      <ClientOnly>
        <Suspense fallback={null}>
          <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
            <color attach="background" args={["#f0f0f0"]} />
            <fog attach="fog" args={["#f0f0f0", 5, 30]} />

            <Scene />
          </Canvas>
        </Suspense>

        <GameUI />
        <TransitionOverlay />
        <Loader />
      </ClientOnly>
    </div>
  )
}
