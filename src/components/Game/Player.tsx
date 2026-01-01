import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore, artworksData } from "./store";

// --- HOOKS ---
function usePlayerControls() {
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });
  const setDetailOpen = useGameStore((state) => state.setDetailOpen);
  const activeArtworkId = useGameStore((state) => state.activeArtworkId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.code) {
        case 'ArrowUp': case 'KeyW': setMovement(m => ({ ...m, forward: true })); break;
        case 'ArrowDown': case 'KeyS': setMovement(m => ({ ...m, backward: true })); break;
        case 'ArrowLeft': case 'KeyA': setMovement(m => ({ ...m, left: true })); break;
        case 'ArrowRight': case 'KeyD': setMovement(m => ({ ...m, right: true })); break;
        case 'Enter': 
            if (activeArtworkId) setDetailOpen(true);
            break;
        case 'Escape':
            setDetailOpen(false);
            break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch(e.code) {
        case 'ArrowUp': case 'KeyW': setMovement(m => ({ ...m, forward: false })); break;
        case 'ArrowDown': case 'KeyS': setMovement(m => ({ ...m, backward: false })); break;
        case 'ArrowLeft': case 'KeyA': setMovement(m => ({ ...m, left: false })); break;
        case 'ArrowRight': case 'KeyD': setMovement(m => ({ ...m, right: false })); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeArtworkId, setDetailOpen]);
  return movement;
}

// --- VISUAL COMPONENTS ---

const ScribbleMaterial = { color: "black", wireframe: true, transparent: true, opacity: 0.6 };

// High density scribble ball to match the reference (Dark, messy)
const ScribbleBall = ({ radius = 1, density = 1 }) => {
    const ref1 = useRef<THREE.Mesh>(null!);
    const ref2 = useRef<THREE.Mesh>(null!);
    const ref3 = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        // Jitter effect
        if (ref1.current) ref1.current.rotation.set(t * 0.2, t * 0.3, 0);
        if (ref2.current) ref2.current.rotation.set(t * -0.3, t * 0.1, t * 0.1);
        if (ref3.current) ref3.current.rotation.set(t * 0.1, t * -0.4, t * 0.2);
    });

    return (
        <group scale={radius}>
            {/* Solid core to give it weight/darkness */}
            <mesh scale={0.8}>
                <icosahedronGeometry args={[1, 1]} />
                <meshBasicMaterial color="black" />
            </mesh>
            {/* Messy Shells */}
            <mesh ref={ref1}>
                <icosahedronGeometry args={[1, 2]} />
                <meshBasicMaterial {...ScribbleMaterial} />
            </mesh>
            <mesh ref={ref2} scale={0.95}>
                <icosahedronGeometry args={[1, 1]} />
                <meshBasicMaterial {...ScribbleMaterial} />
            </mesh>
            <mesh ref={ref3} scale={1.05}>
                <icosahedronGeometry args={[1, 0]} />
                <meshBasicMaterial {...ScribbleMaterial} opacity={0.3} />
            </mesh>
        </group>
    );
};

const ScribbleLimb = ({ length, thickness }: { length: number, thickness: number }) => {
     return (
        <group>
            {/* Core */}
            <mesh position={[0, -length/2, 0]}>
                <cylinderGeometry args={[thickness, thickness*0.8, length, 5]} />
                <meshBasicMaterial color="black" />
            </mesh>
            {/* Wireframe wrapper */}
            <mesh position={[0, -length/2, 0]} scale={[1.2, 1, 1.2]}>
                 <cylinderGeometry args={[thickness, thickness*0.8, length, 4]} />
                 <meshBasicMaterial {...ScribbleMaterial} opacity={0.5} />
            </mesh>
        </group>
     )
}


export const Player = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const characterRef = useRef<THREE.Group>(null!);
  
  // Rigs
  const headGroupRef = useRef<THREE.Group>(null!);
  const bodyGroupRef = useRef<THREE.Group>(null!);
  const leftArmGroupRef = useRef<THREE.Group>(null!);
  const rightArmGroupRef = useRef<THREE.Group>(null!);
  const leftLegGroupRef = useRef<THREE.Group>(null!);
  const rightLegGroupRef = useRef<THREE.Group>(null!);

  const { forward, backward, left, right } = usePlayerControls();
  const { setActiveArtwork, activeArtworkId, isDetailOpen, currentScene, setCurrentScene, setTransitioning } = useGameStore();

  const position = useRef(new THREE.Vector3(0, 0, 8)); 
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const rotation = useRef(0);
  
  useEffect(() => {
    if (currentScene === 'gallery_wall') {
        position.current.set(-10, 0, 4); 
        rotation.current = Math.PI / 2; // Facing Right
    } else {
        position.current.set(0, 0, 10); 
        rotation.current = Math.PI;
    }
  }, [currentScene]);

  useFrame((state) => {
    if (isDetailOpen) return;

    const dt = state.clock.getDelta();
    const time = state.clock.getElapsedTime();
    const speed = 5;
    
    // --- PHYSICS ---
    const direction = new THREE.Vector3(0, 0, 0);
    
    if (currentScene === 'hall') {
        if (forward) direction.z -= 1;
        if (backward) direction.z += 1;
        if (left) direction.x -= 1;
        if (right) direction.x += 1;
    } else {
        if (left) direction.x -= 1;
        if (right) direction.x += 1;
        if (forward) direction.z -= 0.5; 
        if (backward) direction.z += 0.5;
    }
    
    if (direction.length() > 0) {
        direction.normalize();
        let targetRotation = rotation.current;
        if (currentScene === 'hall') {
             targetRotation = Math.atan2(direction.x, direction.z);
        } else {
             if (direction.x > 0.1) targetRotation = Math.PI / 2;
             if (direction.x < -0.1) targetRotation = -Math.PI / 2;
             if (direction.z > 0.1) targetRotation = 0; 
             if (direction.z < -0.1) targetRotation = Math.PI; 
        }

        let angleDiff = targetRotation - rotation.current;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        rotation.current += angleDiff * 0.15;
    }
    
    velocity.current.lerp(direction.multiplyScalar(speed), 0.1);
    position.current.add(velocity.current.clone().multiplyScalar(0.015));

    // --- TRIGGERS ---
    if (currentScene === 'hall') {
        position.current.x = Math.max(-3, Math.min(3, position.current.x));
        position.current.z = Math.max(-15, Math.min(18, position.current.z)); 
        if (position.current.z > 16) {
             setTransitioning(true);
             setTimeout(() => { setCurrentScene('gallery_wall'); setTransitioning(false); }, 1000);
             position.current.z = 10; 
        }
    } else {
        position.current.x = Math.max(-13, Math.min(18, position.current.x));
        position.current.z = Math.max(2, Math.min(6, position.current.z)); 
        if (position.current.x < -12.5) {
             setTransitioning(true);
             setTimeout(() => { setCurrentScene('hall'); setTransitioning(false); }, 1000);
             position.current.x = 0; 
        }
    }
    
    groupRef.current.position.copy(position.current);
    characterRef.current.rotation.y = rotation.current;


    // --- ANIMATION (SMALL BOY STYLE) ---
    const isMoving = direction.length() > 0.1;
    const walkSpeed = 10; // Faster frequency for shorter legs

    if (characterRef.current) {
        
        // 1. HEAD BOB (Independent big head bob)
        headGroupRef.current.rotation.x = 0.1 + Math.sin(time * 2) * 0.05; // Look down slightly
        headGroupRef.current.rotation.z = Math.sin(time * 1.5) * 0.03;
        
        if (isMoving) {
            // Walk Cycle
            characterRef.current.position.y = Math.abs(Math.sin(time * walkSpeed)) * 0.05; // Bouncing

            // Lean forward
            characterRef.current.rotation.x = THREE.MathUtils.lerp(characterRef.current.rotation.x, 0.15, dt * 5);

            // Arms Swing
            // Using wide angle (0.3 rad) to avoid hitting body
            leftArmGroupRef.current.rotation.x = Math.sin(time * walkSpeed) * 0.6;
            rightArmGroupRef.current.rotation.x = Math.sin(time * walkSpeed + Math.PI) * 0.6;
            
            // Legs Swing
            leftLegGroupRef.current.rotation.x = Math.sin(time * walkSpeed + Math.PI) * 0.8;
            rightLegGroupRef.current.rotation.x = Math.sin(time * walkSpeed) * 0.8;

        } else {
            // Idle
            characterRef.current.position.y = Math.sin(time * 2) * 0.01;
            characterRef.current.rotation.x = THREE.MathUtils.lerp(characterRef.current.rotation.x, 0, dt * 5);

            // Arms Breathe
            const breathe = Math.sin(time * 1.5) * 0.05;
            leftArmGroupRef.current.rotation.x = THREE.MathUtils.lerp(leftArmGroupRef.current.rotation.x, breathe, dt * 5);
            leftArmGroupRef.current.rotation.z = 0.3 + breathe; // Keep arms wide
            
            rightArmGroupRef.current.rotation.x = THREE.MathUtils.lerp(rightArmGroupRef.current.rotation.x, breathe, dt * 5);
            rightArmGroupRef.current.rotation.z = -0.3 - breathe;

            // Legs Straight
            leftLegGroupRef.current.rotation.x = THREE.MathUtils.lerp(leftLegGroupRef.current.rotation.x, 0, dt * 5);
            rightLegGroupRef.current.rotation.x = THREE.MathUtils.lerp(rightLegGroupRef.current.rotation.x, 0, dt * 5);
        }
    }

    // Camera follow (Lower target for small character)
    let targetCam = new THREE.Vector3();
    let targetLook = new THREE.Vector3();
    if (currentScene === 'hall') {
        let isCinematic = false;
        for (const art of artworksData) {
             const zx = art.position[0] > 0 ? 3 : -3;
             if(new THREE.Vector3(position.current.x - zx, 0, position.current.z - art.position[2]).length() < 1.2) {
                 targetCam.set(0, 3.5, art.position[2]);
                 targetLook.set(art.position[0], art.position[1], art.position[2]);
                 isCinematic = true;
                 if(art.id !== activeArtworkId) setActiveArtwork(art.id);
                 break;
             }
        }
        if(!isCinematic && activeArtworkId) setActiveArtwork(null);
        if(!isCinematic) {
             // Camera closer to ground for small boy
             targetCam = position.current.clone().add(new THREE.Vector3(0, 3, 5)); 
             targetLook = position.current.clone().add(new THREE.Vector3(0, 0.5, -4));
        }
    } else {
        targetCam.set(position.current.x * 0.9, 2.5, 14); 
        targetLook.set(position.current.x, 2.5, 0);
        if (activeArtworkId) setActiveArtwork(null);
    }
    state.camera.position.lerp(targetCam, 0.02);
    const currentLook = new THREE.Vector3(0,0,-1).applyQuaternion(state.camera.quaternion).add(state.camera.position);
    currentLook.lerp(targetLook, 0.04);
    state.camera.lookAt(currentLook);

  });

  return (
    <group ref={groupRef}>
      <group ref={characterRef} scale={0.8}> {/* Global Scale Down */}
          
          {/* 1. HEAD (Large, Dominant) */}
          <group ref={headGroupRef} position={[0, 1.1, 0]}>
               <ScribbleBall radius={0.45} density={2} />
               {/* Neck (Hidden) */}
               <mesh position={[0, -0.4, 0]}>
                   <cylinderGeometry args={[0.05, 0.05, 0.2]} />
                   <meshBasicMaterial color="black" />
               </mesh>
          </group>

          {/* 2. BODY (Small, Compact) */}
          <group ref={bodyGroupRef} position={[0, 0.55, 0]}>
               <ScribbleBall radius={0.28} density={1.5} />
               
               {/* ARMS (Wide Set to avoid clipping) */}
               {/* Left Arm */}
               <group position={[-0.22, 0.1, 0]}>
                    <group ref={leftArmGroupRef} rotation={[0, 0, 0.3]}> {/* Initial rotation outward 0.3 */}
                         <ScribbleLimb length={0.35} thickness={0.07} />
                         {/* Hand */}
                         <mesh position={[0, -0.35, 0]}>
                             <sphereGeometry args={[0.08]} />
                             <meshBasicMaterial color="black" />
                         </mesh>
                    </group>
               </group>

               {/* Right Arm */}
               <group position={[0.22, 0.1, 0]}>
                    <group ref={rightArmGroupRef} rotation={[0, 0, -0.3]}>
                         <ScribbleLimb length={0.35} thickness={0.07} />
                         {/* Hand */}
                         <mesh position={[0, -0.35, 0]}>
                             <sphereGeometry args={[0.08]} />
                             <meshBasicMaterial color="black" />
                         </mesh>
                    </group>
               </group>
          </group>

          {/* 3. LEGS (Short, Stubby) */}
          <group position={[0, 0.4, 0]}>
               {/* Left Leg */}
               <group position={[-0.12, 0, 0]}>
                    <group ref={leftLegGroupRef}>
                        <ScribbleLimb length={0.4} thickness={0.09} />
                        <mesh position={[0, -0.4, 0.05]}>
                            <sphereGeometry args={[0.09]} />
                            <meshBasicMaterial color="black" />
                        </mesh>
                    </group>
               </group>
               {/* Right Leg */}
               <group position={[0.12, 0, 0]}>
                    <group ref={rightLegGroupRef}>
                        <ScribbleLimb length={0.4} thickness={0.09} />
                        <mesh position={[0, -0.4, 0.05]}>
                            <sphereGeometry args={[0.09]} />
                            <meshBasicMaterial color="black" />
                        </mesh>
                    </group>
               </group>
          </group>

      </group>

      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial color="black" opacity={0.3} transparent />
      </mesh>
    </group>
  );
};
