"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useGameStore, artworksData } from "./store"

function usePlayerControls() {
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false })
  const setDetailOpen = useGameStore((state) => state.setDetailOpen)
  const activeArtworkId = useGameStore((state) => state.activeArtworkId)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          setMovement((m) => ({ ...m, forward: true }))
          break
        case "ArrowDown":
        case "KeyS":
          setMovement((m) => ({ ...m, backward: true }))
          break
        case "ArrowLeft":
        case "KeyA":
          setMovement((m) => ({ ...m, left: true }))
          break
        case "ArrowRight":
        case "KeyD":
          setMovement((m) => ({ ...m, right: true }))
          break
        case "Enter":
          if (activeArtworkId) setDetailOpen(true)
          break
        case "Escape":
          setDetailOpen(false)
          break
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          setMovement((m) => ({ ...m, forward: false }))
          break
        case "ArrowDown":
        case "KeyS":
          setMovement((m) => ({ ...m, backward: false }))
          break
        case "ArrowLeft":
        case "KeyA":
          setMovement((m) => ({ ...m, left: false }))
          break
        case "ArrowRight":
        case "KeyD":
          setMovement((m) => ({ ...m, right: false }))
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [activeArtworkId, setDetailOpen])
  return movement
}

const ScribbleMaterial = { color: "black", wireframe: true, transparent: true, opacity: 0.6 }

const ScribbleBall = ({ radius = 1, density = 1 }) => {
  const ref1 = useRef<THREE.Mesh>(null!)
  const ref2 = useRef<THREE.Mesh>(null!)
  const ref3 = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref1.current) ref1.current.rotation.set(t * 0.2, t * 0.3, 0)
    if (ref2.current) ref2.current.rotation.set(t * -0.3, t * 0.1, t * 0.1)
    if (ref3.current) ref3.current.rotation.set(t * 0.1, t * -0.4, t * 0.2)
  })

  return (
    <group scale={radius}>
      <mesh scale={0.8}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="black" />
      </mesh>
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
  )
}

const ScribbleLimb = ({ length, thickness }: { length: number; thickness: number }) => {
  return (
    <group>
      <mesh position={[0, -length / 2, 0]}>
        <cylinderGeometry args={[thickness, thickness * 0.8, length, 5]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <mesh position={[0, -length / 2, 0]} scale={[1.2, 1, 1.2]}>
        <cylinderGeometry args={[thickness, thickness * 0.8, length, 4]} />
        <meshBasicMaterial {...ScribbleMaterial} opacity={0.5} />
      </mesh>
    </group>
  )
}

export const Player = () => {
  const groupRef = useRef<THREE.Group>(null!)
  const characterRef = useRef<THREE.Group>(null!)

  const headGroupRef = useRef<THREE.Group>(null!)
  const bodyGroupRef = useRef<THREE.Group>(null!)
  const leftArmGroupRef = useRef<THREE.Group>(null!)
  const rightArmGroupRef = useRef<THREE.Group>(null!)
  const leftLegGroupRef = useRef<THREE.Group>(null!)
  const rightLegGroupRef = useRef<THREE.Group>(null!)

  const { forward, backward, left, right } = usePlayerControls()
  const { setActiveArtwork, activeArtworkId, isDetailOpen, currentScene, setCurrentScene, setTransitioning } =
    useGameStore()

  const position = useRef(new THREE.Vector3(0, 0, 8))
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const rotation = useRef(0)

  useEffect(() => {
    if (currentScene === "gallery_wall") {
      position.current.set(-10, 0, 4)
      rotation.current = Math.PI / 2
    } else {
      position.current.set(0, 0, 10)
      rotation.current = Math.PI
    }
  }, [currentScene])

  useFrame((state) => {
    if (isDetailOpen) return

    const dt = state.clock.getDelta()
    const time = state.clock.getElapsedTime()
    const speed = 5

    const direction = new THREE.Vector3(0, 0, 0)

    if (currentScene === "hall") {
      if (forward) direction.z -= 1
      if (backward) direction.z += 1
      if (left) direction.x -= 1
      if (right) direction.x += 1
    } else {
      if (left) direction.x -= 1
      if (right) direction.x += 1
      if (forward) direction.z -= 0.5
      if (backward) direction.z += 0.5
    }

    if (direction.length() > 0) {
      direction.normalize()
      let targetRotation = rotation.current
      if (currentScene === "hall") {
        targetRotation = Math.atan2(direction.x, direction.z)
      } else {
        if (direction.x > 0.1) targetRotation = Math.PI / 2
        if (direction.x < -0.1) targetRotation = -Math.PI / 2
        if (direction.z > 0.1) targetRotation = 0
        if (direction.z < -0.1) targetRotation = Math.PI
      }

      let angleDiff = targetRotation - rotation.current
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2
      rotation.current += angleDiff * 0.15
    }

    velocity.current.lerp(direction.multiplyScalar(speed), 0.1)
    position.current.add(velocity.current.clone().multiplyScalar(0.015))

    if (currentScene === "hall") {
      position.current.x = Math.max(-3, Math.min(3, position.current.x))
      position.current.z = Math.max(-15, Math.min(18, position.current.z))
      if (position.current.z > 16) {
        setTransitioning(true)
        setTimeout(() => {
          setCurrentScene("gallery_wall")
          setTransitioning(false)
        }, 1000)
        position.current.z = 10
      }
    } else {
      position.current.x = Math.max(-13, Math.min(18, position.current.x))
      position.current.z = Math.max(2, Math.min(6, position.current.z))
      if (position.current.x < -12.5) {
        setTransitioning(true)
        setTimeout(() => {
          setCurrentScene("hall")
          setTransitioning(false)
        }, 1000)
        position.current.x = 0
      }
    }

    groupRef.current.position.copy(position.current)
    characterRef.current.rotation.y = rotation.current

    const isMoving = direction.length() > 0.1
    const walkSpeed = 10

    if (characterRef.current) {
      headGroupRef.current.rotation.x = 0.1 + Math.sin(time * 2) * 0.05
      headGroupRef.current.rotation.z = Math.sin(time * 1.5) * 0.03

      if (isMoving) {
        characterRef.current.position.y = Math.abs(Math.sin(time * walkSpeed)) * 0.05
        characterRef.current.rotation.x = THREE.MathUtils.lerp(characterRef.current.rotation.x, 0.15, dt * 5)

        leftArmGroupRef.current.rotation.x = Math.sin(time * walkSpeed) * 0.6
        rightArmGroupRef.current.rotation.x = Math.sin(time * walkSpeed + Math.PI) * 0.6

        leftLegGroupRef.current.rotation.x = Math.sin(time * walkSpeed + Math.PI) * 0.8
        rightLegGroupRef.current.rotation.x = Math.sin(time * walkSpeed) * 0.8
      } else {
        characterRef.current.position.y = Math.sin(time * 2) * 0.01
        characterRef.current.rotation.x = THREE.MathUtils.lerp(characterRef.current.rotation.x, 0, dt * 5)

        const breathe = Math.sin(time * 1.5) * 0.05
        leftArmGroupRef.current.rotation.x = THREE.MathUtils.lerp(leftArmGroupRef.current.rotation.x, breathe, dt * 5)
        leftArmGroupRef.current.rotation.z = 0.3 + breathe

        rightArmGroupRef.current.rotation.x = THREE.MathUtils.lerp(rightArmGroupRef.current.rotation.x, breathe, dt * 5)
        rightArmGroupRef.current.rotation.z = -0.3 - breathe

        leftLegGroupRef.current.rotation.x = THREE.MathUtils.lerp(leftLegGroupRef.current.rotation.x, 0, dt * 5)
        rightLegGroupRef.current.rotation.x = THREE.MathUtils.lerp(rightLegGroupRef.current.rotation.x, 0, dt * 5)
      }
    }

    let targetCam = new THREE.Vector3()
    let targetLook = new THREE.Vector3()
    if (currentScene === "hall") {
      let isCinematic = false
      for (const art of artworksData) {
        const zx = art.position[0] > 0 ? 3 : -3
        if (new THREE.Vector3(position.current.x - zx, 0, position.current.z - art.position[2]).length() < 1.2) {
          targetCam.set(0, 3.5, art.position[2])
          targetLook.set(art.position[0], art.position[1], art.position[2])
          isCinematic = true
          if (art.id !== activeArtworkId) setActiveArtwork(art.id)
          break
        }
      }
      if (!isCinematic && activeArtworkId) setActiveArtwork(null)
      if (!isCinematic) {
        targetCam = position.current.clone().add(new THREE.Vector3(0, 3, 5))
        targetLook = position.current.clone().add(new THREE.Vector3(0, 0.5, -4))
      }
    } else {
      targetCam.set(position.current.x * 0.9, 2.5, 14)
      targetLook.set(position.current.x, 2.5, 0)
      if (activeArtworkId) setActiveArtwork(null)
    }
    state.camera.position.lerp(targetCam, 0.02)
    const currentLook = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion).add(state.camera.position)
    currentLook.lerp(targetLook, 0.04)
    state.camera.lookAt(currentLook)
  })

  return (
    <group ref={groupRef}>
      <group ref={characterRef} scale={0.8}>
        <group ref={headGroupRef} position={[0, 1.1, 0]}>
          <ScribbleBall radius={0.45} density={2} />
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.2]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </group>

        <group ref={bodyGroupRef} position={[0, 0.55, 0]}>
          <ScribbleBall radius={0.28} density={1.5} />

          <group position={[-0.22, 0.1, 0]}>
            <group ref={leftArmGroupRef} rotation={[0, 0, 0.3]}>
              <ScribbleLimb length={0.35} thickness={0.07} />
              <mesh position={[0, -0.35, 0]}>
                <sphereGeometry args={[0.08]} />
                <meshBasicMaterial color="black" />
              </mesh>
            </group>
          </group>

          <group position={[0.22, 0.1, 0]}>
            <group ref={rightArmGroupRef} rotation={[0, 0, -0.3]}>
              <ScribbleLimb length={0.35} thickness={0.07} />
              <mesh position={[0, -0.35, 0]}>
                <sphereGeometry args={[0.08]} />
                <meshBasicMaterial color="black" />
              </mesh>
            </group>
          </group>
        </group>

        <group position={[0, 0.4, 0]}>
          <group position={[-0.12, 0, 0]}>
            <group ref={leftLegGroupRef}>
              <ScribbleLimb length={0.4} thickness={0.09} />
              <mesh position={[0, -0.4, 0.05]}>
                <sphereGeometry args={[0.09]} />
                <meshBasicMaterial color="black" />
              </mesh>
            </group>
          </group>
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

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial color="black" opacity={0.3} transparent />
      </mesh>
    </group>
  )
}
