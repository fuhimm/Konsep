import React from "react";
import { Environment, Float, Text } from "@react-three/drei";
import { Player } from "./Player";
import { Artwork } from "./Artwork";
import { useGameStore, artworksData, galleryWallData } from "./store";

export const Scene = () => {
  const currentScene = useGameStore((state) => state.currentScene);

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[1024, 1024]} 
      />
      
      <Player />

      {currentScene === 'hall' && <HallScene />}
      {currentScene === 'gallery_wall' && <GalleryWallScene />}
    </>
  );
};

const HallScene = () => {
    return (
      <group>
        {/* FLOOR */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 60]} />
          <meshStandardMaterial color="#f2f2f2" roughness={0.8} />
        </mesh>

        {/* WALLS */}
        <mesh position={[-5, 5, 0]} receiveShadow>
          <boxGeometry args={[0.5, 10, 60]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[5, 5, 0]} receiveShadow>
          <boxGeometry args={[0.5, 10, 60]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Back Wall (Far end) */}
        <mesh position={[0, 5, -30]} receiveShadow>
           <boxGeometry args={[10.5, 10, 0.5]} />
           <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Front Wall (Entrance/Exit Trigger Area) */}
         <mesh position={[0, 5, 30]} receiveShadow>
           <boxGeometry args={[10.5, 10, 0.5]} />
           <meshStandardMaterial color="#333" /> {/* Darker to indicate exit? */}
        </mesh>

        {/* ROOF BEAMS */}
        {Array.from({ length: 12 }).map((_, i) => (
             <mesh key={i} position={[0, 8, -25 + i * 5]} rotation={[0,0,0]}>
                <boxGeometry args={[10, 0.2, 0.5]} />
                <meshStandardMaterial color="#333" />
             </mesh>
        ))}

        {/* INTERACTION ZONES */}
        {artworksData.map((art) => {
             const zoneX = art.position[0] > 0 ? 3 : -3;
             return (
                <group key={art.id} position={[zoneX, 0.01, art.position[2]]}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[0.8, 0.9, 32]} />
                        <meshBasicMaterial color="#333" opacity={0.5} transparent />
                    </mesh>
                    <mesh position={[0,0,0]}>
                         <circleGeometry args={[0.2, 16]} rotation={[-Math.PI/2, 0, 0]} />
                         <meshBasicMaterial color="#333" />
                    </mesh>
                </group>
             )
        })}

        {/* ARTWORKS */}
        {artworksData.map((art) => (
             // @ts-ignore
             <Artwork 
                key={art.id} 
                position={art.position} 
                rotation={art.rotation} 
                url={art.url} 
                title={art.title} 
             />
        ))}

        {/* Intro Text */}
        <group position={[0, 4, -28]}>
            <Text 
                fontSize={1} 
                color="black" 
                anchorY="bottom"
            >
                Fuhim
            </Text>
            <Text 
                position={[0, -0.8, 0]} 
                fontSize={0.25} 
                color="#666" 
                maxWidth={6}
                textAlign="center"
            >
                Walk back to exit.
            </Text>
        </group>
        
        {/* Exit Hint */}
        <Text position={[0, 2, 15]} rotation={[0, Math.PI, 0]} color="black" fontSize={0.5}>
             ↓ Exit to Gallery ↓
        </Text>

      </group>
    );
};

const GalleryWallScene = () => {
    return (
        <group>
             {/* FLOOR */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 20]} />
                <meshStandardMaterial color="#e0e0e0" roughness={0.8} />
            </mesh>
            
            {/* WALL */}
            <mesh position={[0, 5, -2]} receiveShadow>
                <boxGeometry args={[100, 15, 1]} />
                <meshStandardMaterial color="#f0f0f0" />
            </mesh>
            
            {/* -- LEFT SECTION (Entrance) -- */}
            <group position={[-12, 0, 0]}>
                {/* Navigation Sign */}
                <group position={[0, 3.5, -1.4]}>
                    <Text color="black" fontSize={0.4} anchorX="center" position={[0, 0, 0]}>
                       ← MAIN HALL
                    </Text>
                </group>
                
                {/* Decorative Doorway Frame */}
                <mesh position={[0, 3, -1.45]}>
                    <planeGeometry args={[4, 6]} />
                    <meshBasicMaterial color="#333" wireframe />
                </mesh>
            </group>

            {/* ARTWORKS (Frames) */}
            {galleryWallData.map((art, index) => (
                <group key={art.id}>
                    <group position={[art.x, 3, -1.4]}>
                        {/* Canvas */}
                        <Artwork 
                            url={art.url}
                            title={art.title}
                            position={[0,0,0]}
                            rotation={[0,0,0]}
                            scale={[1.2, 1.2, 1]} 
                        />
                        {/* Artwork Number/Label */}
                         <Text position={[0, -1.5, 0]} color="#888" fontSize={0.2}>
                            {`0${index + 1}`}
                         </Text>
                    </group>
                    
                    {/* Divider Line (Except for last item) */}
                    {index < galleryWallData.length - 1 && (
                         <mesh position={[art.x + 3, 3, -1.45]}>
                             <planeGeometry args={[0.05, 4]} />
                             <meshBasicMaterial color="#ccc" />
                         </mesh>
                    )}
                </group>
            ))}

            {/* INTERACTION ZONES (Visual Only) */}
            {galleryWallData.map((art) => (
                <mesh key={art.id} rotation={[-Math.PI / 2, 0, 0]} position={[art.x, 0.01, 2]}>
                    <ringGeometry args={[1, 1.1, 32]} />
                    <meshBasicMaterial color="#555" opacity={0.5} transparent />
                </mesh>
            ))}
        </group>
    )
}
