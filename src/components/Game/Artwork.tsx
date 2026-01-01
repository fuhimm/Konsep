import React from "react";
import { Image, Text, useTexture } from "@react-three/drei";

interface ArtworkProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  url: string;
  title?: string;
  [key: string]: any; // Allow other props
}

export const Artwork = ({ position, rotation = [0, 0, 0], url, title, ...props }: ArtworkProps) => {
  return (
    <group position={position} rotation={rotation} {...props}>
      {/* Frame Hitam Tebal */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[2.2, 3.2, 0.1]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>

      {/* Canvas Lukisan */}
      <Image 
        url={url} 
        scale={[2, 3]} 
        toneMapped={false}
        grayscale={1} // Paksa hitam putih
        quality="high"
      />

      {/* Label / Tanda Tangan (Opsional) */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.1}
        color="black"
        anchorX="center"
        anchorY="top"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        {title || "Untitled"}
      </Text>
    </group>
  );
};
