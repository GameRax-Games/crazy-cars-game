import * as THREE from "three"

// Lightweight mutable store shared between the R3F scene and the HUD.
export const gameStore = {
  carPos: new THREE.Vector3(0, 0, 0),
  speed: 0,
  airborne: false,
}
