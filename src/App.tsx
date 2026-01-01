import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Scene } from "./components/Game/Scene";
import { GameUI } from "./components/Game/GameUI";
import { TransitionOverlay } from "./components/Game/TransitionOverlay";

const App = () => {
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
  );
};

export default App;
