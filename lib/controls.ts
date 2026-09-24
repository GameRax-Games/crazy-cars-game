export interface ControlScheme {
  forward: string[]
  back: string[]
  left: string[]
  right: string[]
  brake: string[]
}

// Single-player: both WASD and arrow keys drive the same car.
export const SOLO_CONTROLS: ControlScheme = {
  forward: ["w", "arrowup"],
  back: ["s", "arrowdown"],
  left: ["a", "arrowleft"],
  right: ["d", "arrowright"],
  brake: [" "],
}

// Two-player: player 1 on WASD, player 2 on the arrow keys.
export const P1_CONTROLS: ControlScheme = {
  forward: ["w"],
  back: ["s"],
  left: ["a"],
  right: ["d"],
  brake: ["shift"],
}

export const P2_CONTROLS: ControlScheme = {
  forward: ["arrowup"],
  back: ["arrowdown"],
  left: ["arrowleft"],
  right: ["arrowright"],
  brake: ["enter", " "],
}
