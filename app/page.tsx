"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Loader } from "@react-three/drei"
import { GameUI } from "@/components/Game/GameUI"
import { TransitionOverlay } from "@/components/Game/TransitionOverlay"

const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => mod.Canvas), {
  ssr: false,
})

const Scene = dynamic(() => import("@/components/Game/Scene").then((mod) => ({ default: mod.Scene })), {
  ssr: false,
})

export default function Page() {
  return (
    <div className="w-full h-screen bg-[#f0f0f0] overflow-hidden font-sans select-none">
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
    </div>
  )
}
