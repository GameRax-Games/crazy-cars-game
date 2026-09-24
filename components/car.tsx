"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import type { CarConfig } from "@/lib/cars"
import type { Keys } from "@/lib/use-keyboard"
import type { ControlScheme } from "@/lib/controls"
import { groundHeight, WORLD_BOUND } from "@/lib/track"
import type { CarState } from "@/lib/game-store"

export interface TouchControls {
  forward: boolean
  back: boolean
  left: boolean
  right: boolean
  brake: boolean
}

interface CarProps {
  config: CarConfig
  keys: React.MutableRefObject<Keys>
  controls: ControlScheme
  store: CarState
  touch?: React.MutableRefObject<TouchControls>
  resetSignal: number
}

const GRAVITY = 42
const wheelPositions: [number, number][] = [
  [-0.7, 1.05],
  [0.7, 1.05],
  [-0.7, -1.05],
  [0.7, -1.05],
]

export function Car({ config, keys, controls, store, touch, resetSignal }: CarProps) {
  const group = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const { camera } = useThree()

  // Physics state
  const pos = useRef(new THREE.Vector3(0, 0, 0))
  const heading = useRef(0)
  const speed = useRef(0)
  const vy = useRef(0)
  const prevGround = useRef(0)
  const pitch = useRef(0)
  const roll = useRef(0)
  const lastReset = useRef(resetSignal)
  const camInit = useRef(false)

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 30)
    if (!group.current) return

    if (lastReset.current !== resetSignal) {
      lastReset.current = resetSignal
      pos.current.set(0, 0, 0)
      heading.current = 0
      speed.current = 0
      vy.current = 0
      camInit.current = false
    }

    const k = keys.current
    const t = touch?.current
    const pressed = (arr: string[]) => arr.some((key) => k[key])
    const accelIn =
      (pressed(controls.forward) || t?.forward ? 1 : 0) - (pressed(controls.back) || t?.back ? 1 : 0)
    const steerIn =
      (pressed(controls.left) || t?.left ? 1 : 0) - (pressed(controls.right) || t?.right ? 1 : 0)
    const braking = pressed(controls.brake) || t?.brake

    const airborne = pos.current.y > prevGround.current + 0.4

    // Longitudinal
    if (!airborne) {
      if (accelIn !== 0) {
        speed.current += accelIn * config.accel * dt
      } else {
        speed.current *= 1 - Math.min(1, 1.6 * dt)
      }
      if (braking) speed.current *= 1 - Math.min(1, 5 * dt)
      speed.current = THREE.MathUtils.clamp(speed.current, -config.maxSpeed * 0.4, config.maxSpeed)

      // Steering scales with speed
      const speedFactor = THREE.MathUtils.clamp(Math.abs(speed.current) / 12, 0, 1)
      heading.current += steerIn * config.handling * speedFactor * dt * Math.sign(speed.current || 1)
      roll.current = THREE.MathUtils.lerp(roll.current, -steerIn * speedFactor * 0.25, 0.15)
    } else {
      roll.current = THREE.MathUtils.lerp(roll.current, 0, 0.05)
    }

    // Move forward along heading
    const dir = new THREE.Vector3(Math.sin(heading.current), 0, Math.cos(heading.current))
    pos.current.x += dir.x * speed.current * dt
    pos.current.z += dir.z * speed.current * dt

    // Keep in bounds
    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -WORLD_BOUND, WORLD_BOUND)
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -WORLD_BOUND, WORLD_BOUND)

    // Vertical / ramps
    const gH = groundHeight(pos.current.x, pos.current.z)
    vy.current -= GRAVITY * dt
    let newY = pos.current.y + vy.current * dt
    if (newY <= gH) {
      const climbRate = (gH - prevGround.current) / dt
      if (climbRate > 6 && speed.current > 8) {
        vy.current = Math.min(climbRate, 26)
        newY = gH
      } else {
        vy.current = 0
        newY = gH
      }
    }
    pos.current.y = newY
    prevGround.current = gH

    // Pitch from slope or air
    const targetPitch = airborne
      ? THREE.MathUtils.clamp(-vy.current * 0.02, -0.5, 0.5)
      : THREE.MathUtils.clamp((gH - (groundHeight(pos.current.x - dir.x, pos.current.z - dir.z))) * 0.15, -0.5, 0.5)
    pitch.current = THREE.MathUtils.lerp(pitch.current, targetPitch, 0.1)

    // Apply to group
    group.current.position.copy(pos.current)
    group.current.rotation.y = heading.current
    if (body.current) {
      body.current.rotation.x = pitch.current
      body.current.rotation.z = roll.current
    }

    // Publish state
    store.carPos.copy(pos.current)
    store.speed = Math.abs(speed.current)
    store.airborne = airborne

    // Camera follow
    const camTarget = new THREE.Vector3(
      pos.current.x - dir.x * 11,
      pos.current.y + 6.5,
      pos.current.z - dir.z * 11,
    )
    if (!camInit.current) {
      camera.position.copy(camTarget)
      camInit.current = true
    } else {
      camera.position.lerp(camTarget, 1 - Math.pow(0.001, dt))
    }
    camera.lookAt(pos.current.x + dir.x * 4, pos.current.y + 1.5, pos.current.z + dir.z * 4)
  })

  return (
    <group ref={group}>
      <group ref={body}>
        {/* chassis */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[1.7, 0.6, 3.6]} />
          <meshStandardMaterial color={config.body} metalness={0.3} roughness={0.4} />
        </mesh>
        {/* cabin */}
        <mesh position={[0, 1.05, -0.2]} castShadow>
          <boxGeometry args={[1.4, 0.55, 1.7]} />
          <meshStandardMaterial color={config.accent} metalness={0.2} roughness={0.5} />
        </mesh>
        {/* windshield */}
        <mesh position={[0, 1.08, 0.75]} rotation={[0.5, 0, 0]}>
          <boxGeometry args={[1.3, 0.5, 0.1]} />
          <meshStandardMaterial color="#bae6fd" metalness={0.1} roughness={0.1} transparent opacity={0.8} />
        </mesh>
        {/* headlights */}
        <mesh position={[0.5, 0.55, 1.82]}>
          <boxGeometry args={[0.35, 0.2, 0.05]} />
          <meshStandardMaterial color="#fef9c3" emissive="#fde047" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[-0.5, 0.55, 1.82]}>
          <boxGeometry args={[0.35, 0.2, 0.05]} />
          <meshStandardMaterial color="#fef9c3" emissive="#fde047" emissiveIntensity={1.5} />
        </mesh>
        {/* wheels */}
        {wheelPositions.map(([x, z], i) => (
          <mesh key={i} position={[x, 0.35, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.35, 16]} />
            <meshStandardMaterial color="#111827" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
