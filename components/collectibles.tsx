"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { groundHeight, WORLD_BOUND, ramps, MOUNT } from "@/lib/track"
import type { CarState } from "@/lib/game-store"

interface StarData {
  id: number
  pos: THREE.Vector3
}

function makeStars(): StarData[] {
  const stars: StarData[] = []
  let seed = 42
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  let id = 0
  // scattered around the map
  for (let i = 0; i < 55; i++) {
    const x = (rand() - 0.5) * WORLD_BOUND * 1.9
    const z = (rand() - 0.5) * WORLD_BOUND * 1.9
    const y = groundHeight(x, z) + 1.6
    stars.push({ id: id++, pos: new THREE.Vector3(x, y, z) })
  }
  // one reward star floating above each ramp top (for big jumps)
  for (const r of ramps) {
    const c = Math.cos(r.angle)
    const s = Math.sin(r.angle)
    const lz = r.length + 8
    const x = r.x + s * lz
    const z = r.z + c * lz
    stars.push({ id: id++, pos: new THREE.Vector3(x, r.height + 3, z) })
  }
  // ring of stars around the mountain summit
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const x = MOUNT.x + Math.cos(a) * 10
    const z = MOUNT.z + Math.sin(a) * 10
    stars.push({ id: id++, pos: new THREE.Vector3(x, groundHeight(x, z) + 2, z) })
  }
  return stars
}

export const STAR_COUNT = makeStars().length

function Star({ data, store, onCollect }: { data: StarData; store: CarState; onCollect: (id: number) => void }) {
  const ref = useRef<THREE.Group>(null)
  const collected = useRef(false)

  useFrame((state, delta) => {
    if (!ref.current || collected.current) return
    ref.current.rotation.y += delta * 2
    ref.current.position.y = data.pos.y + Math.sin(state.clock.elapsedTime * 2 + data.id) * 0.25
    const dx = store.carPos.x - data.pos.x
    const dy = store.carPos.y + 0.8 - ref.current.position.y
    const dz = store.carPos.z - data.pos.z
    if (dx * dx + dy * dy + dz * dz < 9) {
      collected.current = true
      ref.current.visible = false
      onCollect(data.id)
    }
  })

  return (
    <group ref={ref} position={data.pos}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#facc15" emissive="#f59e0b" emissiveIntensity={0.6} metalness={0.4} roughness={0.3} />
      </mesh>
      <pointLight color="#fbbf24" intensity={6} distance={6} />
    </group>
  )
}

export function Collectibles({
  store,
  onCollect,
  resetSignal,
}: {
  store: CarState
  onCollect: (id: number) => void
  resetSignal: number
}) {
  // reset creates fresh stars by remounting via key in parent
  const stars = useMemo(() => makeStars(), [])
  return (
    <group key={resetSignal}>
      {stars.map((s) => (
        <Star key={s.id} data={s} store={store} onCollect={onCollect} />
      ))}
    </group>
  )
}
