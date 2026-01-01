"use client"

import { create } from "zustand"

export type GameScene = "hall" | "gallery_wall"

export const artworksData = [
  // Left Wall (Hall)
  {
    id: "1",
    position: [-4.7, 3.5, -5] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    url: "https://images.unsplash.com/photo-1736979110875-6f8e8bfdeb26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Solitude",
    desc: "A study of isolation in the modern void.",
  },
  {
    id: "2",
    position: [-4.7, 3.5, -10] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    url: "https://images.unsplash.com/photo-1764269832711-5368bb6f5ebf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Chaos",
    desc: "Disorganized matter seeking form.",
  },
  {
    id: "3",
    position: [-4.7, 3.5, 0] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    url: "https://images.unsplash.com/photo-1604952703578-8ae924053711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Structure",
    desc: "The architectural bones of reality.",
  },

  // Right Wall (Hall)
  {
    id: "4",
    position: [4.7, 3.5, -5] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    url: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Form",
    desc: "The emergence of shape from nothingness.",
  },
  {
    id: "5",
    position: [4.7, 3.5, -10] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    url: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Face",
    desc: "The human element in a digital world.",
  },
  {
    id: "6",
    position: [4.7, 3.5, 0] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Void",
    desc: "Staring back into the abyss.",
  },
]

export const galleryWallData = [
  {
    id: "g1",
    x: -4,
    url: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Moon Face",
  },
  {
    id: "g2",
    x: 2,
    url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Old Man",
  },
  {
    id: "g3",
    x: 8,
    url: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Globe",
  },
  {
    id: "g4",
    x: 14,
    url: "https://images.unsplash.com/photo-1736979110875-6f8e8bfdeb26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Surreal",
  },
]

interface GameState {
  currentScene: GameScene
  isTransitioning: boolean
  activeArtworkId: string | null
  isDetailOpen: boolean
  gameStarted: boolean

  setCurrentScene: (scene: GameScene) => void
  setTransitioning: (isTransitioning: boolean) => void
  setActiveArtwork: (id: string | null) => void
  setDetailOpen: (isOpen: boolean) => void
  startGame: () => void
}

export const useGameStore = create<GameState>((set) => ({
  currentScene: "hall",
  isTransitioning: false,
  activeArtworkId: null,
  isDetailOpen: false,
  gameStarted: false,

  setCurrentScene: (scene) => set({ currentScene: scene }),
  setTransitioning: (isTransitioning) => set({ isTransitioning: isTransitioning }),
  setActiveArtwork: (id) => set({ activeArtworkId: id }),
  setDetailOpen: (isOpen) => set({ isDetailOpen: isOpen }),
  startGame: () => set({ gameStarted: true }),
}))
