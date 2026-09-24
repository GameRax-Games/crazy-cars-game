"use client"

import { Canvas } from "@react-three/fiber"
import { Sky } from "@react-three/drei"
import type { CarConfig } from "@/lib/cars"
import type { Keys } from "@/lib/use-keyboard"
import type { ControlScheme } from "@/lib/controls"
import type { CarState } from "@/lib/game-store"
import { Car, type TouchControls } from "@/components/car"
import { World } from "@/components/world"
import { Collectibles } from "@/components/collectibles"

interface GameCanvasProps {
  config: CarConfig
  keys: React.MutableRefObject<Keys>
  controls: ControlScheme
  store: CarState
  touch?: React.MutableRefObject<TouchControls>
  resetSignal: number
  onCollect: (id: number) => void
}

export function GameCanvas({ config, keys, controls, store, touch, resetSignal, onCollect }: GameCanvasProps) {
  return (
    <Canvas shadows camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 8, -14] }} dpr={[1, 1.75]}>
      <color attach="background" args={["#87ceeb"]} />
      <fog attach="fog" args={["#bfe3f5", 120, 340]} />
      <Sky sunPosition={[80, 60, 40]} turbidity={6} rayleigh={1} />

      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#cfe8ff", "#4d7c4f", 0.6]} />
      <directionalLight
        position={[60, 90, 40]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-160}
        shadow-camera-right={160}
        shadow-camera-top={160}
        shadow-camera-bottom={-160}
        shadow-camera-far={300}
      />

      <World />
      <Collectibles store={store} onCollect={onCollect} resetSignal={resetSignal} />
      <Car config={config} keys={keys} controls={controls} store={store} touch={touch} resetSignal={resetSignal} />
    </Canvas>
  )
}
