"use client"

import { useMemo } from "react"
import * as THREE from "three"
import { ramps, MOUNT, WORLD_BOUND } from "@/lib/track"

function RampMesh({
  x,
  z,
  angle,
  length,
  width,
  height,
}: {
  x: number
  z: number
  angle: number
  length: number
  width: number
  height: number
}) {
  const pitch = Math.atan2(height, length)
  const hyp = Math.hypot(length, height)
  return (
    <group position={[x, 0, z]} rotation={[0, angle, 0]}>
      {/* inclined surface */}
      <mesh position={[0, height / 2, length / 2]} rotation={[-pitch, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[width, 0.4, hyp]} />
        <meshStandardMaterial color="#f97316" roughness={0.6} />
      </mesh>
      {/* side fill */}
      <mesh position={[0, height / 2, length / 2]}>
        <boxGeometry args={[width - 0.6, height, length * 0.98]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 2.4, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3, 0]} castShadow>
        <coneGeometry args={[1.6, 3.4, 10]} />
        <meshStandardMaterial color="#16a34a" roughness={0.8} />
      </mesh>
    </group>
  )
}

function Building({ position, size, color }: { position: [number, number, number]; size: [number, number, number]; color: string }) {
  return (
    <mesh position={[position[0], size[1] / 2, position[2]]} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  )
}

export function World() {
  const trees = useMemo(() => {
    const arr: [number, number, number][] = []
    let seed = 7
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    for (let i = 0; i < 60; i++) {
      const x = (rand() - 0.5) * WORLD_BOUND * 2
      const z = (rand() - 0.5) * WORLD_BOUND * 2
      if (Math.hypot(x, z) < 30) continue
      if (Math.hypot(x - MOUNT.x, z - MOUNT.z) < MOUNT.radius + 4) continue
      arr.push([x, 0, z])
    }
    return arr
  }, [])

  const buildings = useMemo(() => {
    const list: { position: [number, number, number]; size: [number, number, number]; color: string }[] = []
    const colors = ["#64748b", "#94a3b8", "#475569", "#cbd5e1"]
    const spots: [number, number][] = [
      [120, 120],
      [140, 90],
      [110, 150],
      [-140, 130],
      [-110, 150],
      [150, -120],
      [120, -150],
    ]
    spots.forEach(([x, z], i) => {
      const h = 12 + ((i * 7) % 20)
      list.push({ position: [x, 0, z], size: [10, h, 10], color: colors[i % colors.length] })
    })
    return list
  }, [])

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[WORLD_BOUND * 2 + 40, WORLD_BOUND * 2 + 40]} />
        <meshStandardMaterial color="#4d7c4f" roughness={1} />
      </mesh>

      {/* Central plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[34, 48]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.9} />
      </mesh>

      {/* Cross roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[16, WORLD_BOUND * 2]} />
        <meshStandardMaterial color="#6b7280" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[16, WORLD_BOUND * 2]} />
        <meshStandardMaterial color="#6b7280" roughness={0.9} />
      </mesh>

      {/* Mountain */}
      <mesh position={[MOUNT.x, 0, MOUNT.z]} castShadow receiveShadow>
        <coneGeometry args={[MOUNT.radius, MOUNT.height, 48]} />
        <meshStandardMaterial color="#6d5847" roughness={1} />
      </mesh>
      <mesh position={[MOUNT.x, MOUNT.height - 6, MOUNT.z]}>
        <coneGeometry args={[MOUNT.radius * 0.35, 10, 48]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.6} />
      </mesh>

      {/* Ramps */}
      {ramps.map((r, i) => (
        <RampMesh key={i} {...r} />
      ))}

      {/* Trees */}
      {trees.map((p, i) => (
        <Tree key={i} position={p} />
      ))}

      {/* Buildings */}
      {buildings.map((b, i) => (
        <Building key={i} {...b} />
      ))}

      {/* Boundary walls */}
      {[
        { p: [0, 2, WORLD_BOUND + 5] as [number, number, number], s: [WORLD_BOUND * 2 + 20, 4, 2] as [number, number, number] },
        { p: [0, 2, -WORLD_BOUND - 5] as [number, number, number], s: [WORLD_BOUND * 2 + 20, 4, 2] as [number, number, number] },
        { p: [WORLD_BOUND + 5, 2, 0] as [number, number, number], s: [2, 4, WORLD_BOUND * 2 + 20] as [number, number, number] },
        { p: [-WORLD_BOUND - 5, 2, 0] as [number, number, number], s: [2, 4, WORLD_BOUND * 2 + 20] as [number, number, number] },
      ].map((w, i) => (
        <mesh key={i} position={w.p}>
          <boxGeometry args={w.s} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}
