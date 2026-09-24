import * as THREE from "three"

// Lightweight mutable state shared between an R3F scene and its HUD.
export interface CarState {
  carPos: THREE.Vector3
  speed: number
  airborne: boolean
}

export function createCarState(): CarState {
  return {
    carPos: new THREE.Vector3(0, 0, 0),
    speed: 0,
    airborne: false,
  }
}

// Default singleton used by single-player mode.
export const gameStore = createCarState()
