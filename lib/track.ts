export interface Ramp {
  x: number
  z: number
  angle: number
  length: number
  width: number
  height: number
}

export const WORLD_BOUND = 180

// Ramps rise along their local +Z axis, from y=0 at the base to `height` at the top.
export const ramps: Ramp[] = [
  { x: 0, z: 40, angle: 0, length: 22, width: 14, height: 7 },
  { x: -50, z: -20, angle: Math.PI / 2, length: 26, width: 12, height: 9 },
  { x: 60, z: -60, angle: Math.PI, length: 30, width: 16, height: 12 },
  { x: 90, z: 50, angle: -Math.PI / 2, length: 20, width: 12, height: 6 },
  { x: -90, z: 90, angle: Math.PI / 4, length: 28, width: 14, height: 10 },
  { x: 30, z: 120, angle: 0, length: 34, width: 18, height: 14 },
  { x: -120, z: -80, angle: -Math.PI / 3, length: 24, width: 12, height: 8 },
]

// Big central hill (a cone-like mound) players can climb.
export const MOUNT = { x: -20, z: -130, radius: 70, height: 40 }

function mountHeight(x: number, z: number): number {
  const dx = x - MOUNT.x
  const dz = z - MOUNT.z
  const dist = Math.hypot(dx, dz)
  if (dist >= MOUNT.radius) return 0
  const t = 1 - dist / MOUNT.radius
  // smooth dome
  return MOUNT.height * t * t
}

function rampHeight(x: number, z: number): number {
  let best = 0
  for (const r of ramps) {
    const dx = x - r.x
    const dz = z - r.z
    const c = Math.cos(r.angle)
    const s = Math.sin(r.angle)
    const lx = dx * c - dz * s
    const lz = dx * s + dz * c
    if (Math.abs(lx) <= r.width / 2 && lz >= 0 && lz <= r.length) {
      const h = (lz / r.length) * r.height
      if (h > best) best = h
    }
  }
  return best
}

export function groundHeight(x: number, z: number): number {
  return Math.max(rampHeight(x, z), mountHeight(x, z))
}
