import { Mission_SquadWipe } from "./mission/MissionOne"
import { Mission_EnemyChasingYou } from "./mission/MissionTwo"

export const TILE_SIZE = 300

export type GunTypes =
  | "pistol"
  | "shotgun"
  | "rocket-launcher"
  | "sniper"
  | "smg"

export interface GunData {
  sprite: Phaser.GameObjects.Sprite
  ammo: number
  fireRate: number
  maxAmmo: number
  gunType: string
  damage: number
}

export interface CustomKeys {
  up: Phaser.Input.Keyboard.Key
  down: Phaser.Input.Keyboard.Key
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
  upArrow: Phaser.Input.Keyboard.Key
  downArrow: Phaser.Input.Keyboard.Key
  leftArrow: Phaser.Input.Keyboard.Key
  rightArrow: Phaser.Input.Keyboard.Key
  t: Phaser.Input.Keyboard.Key
  tilde: Phaser.Input.Keyboard.Key
  f: Phaser.Input.Keyboard.Key
  n: Phaser.Input.Keyboard.Key
  shift: Phaser.Input.Keyboard.Key
}

export const MISSIONS = {
  KILL_SQUAD: Mission_SquadWipe,
  RUN_FROM_SQUAD: Mission_EnemyChasingYou,
}

export const SpawnableLocationsInGridCount = [
  // Row 2 (y=2)
  { x: 2, y: 2 },
  { x: 3, y: 2 },
  { x: 4, y: 2 },
  { x: 5, y: 2 },
  { x: 6, y: 2 },
  { x: 7, y: 2 },
  { x: 8, y: 2 },
  { x: 9, y: 2 },
  { x: 10, y: 2 },
  { x: 11, y: 2 },
  { x: 12, y: 2 },
  { x: 13, y: 2 },
  { x: 14, y: 2 },
  { x: 15, y: 2 },
  { x: 16, y: 2 },
  { x: 17, y: 2 },
  { x: 18, y: 2 },
  { x: 19, y: 2 },
  { x: 20, y: 2 },
  { x: 21, y: 2 },
  { x: 22, y: 2 },
  { x: 23, y: 2 },
  { x: 24, y: 2 },
  { x: 25, y: 2 },
  { x: 26, y: 2 },
  { x: 27, y: 2 },
  { x: 28, y: 2 },
  { x: 29, y: 2 },
  { x: 30, y: 2 },
  { x: 31, y: 2 },
  { x: 32, y: 2 },
  { x: 33, y: 2 },

  // Row 3 (y=3)
  { x: 2, y: 3 },
  { x: 9, y: 3 },
  { x: 19, y: 3 },
  { x: 24, y: 3 },
  { x: 33, y: 3 },

  // Row 4 (y=4)
  { x: 2, y: 4 },
  { x: 9, y: 4 },
  { x: 19, y: 4 },
  { x: 24, y: 4 },
  { x: 33, y: 4 },

  // Row 5 (y=5)
  { x: 2, y: 5 },
  { x: 9, y: 5 },
  { x: 19, y: 5 },
  { x: 24, y: 5 },
  { x: 33, y: 5 },

  // Row 6 (y=6)
  { x: 2, y: 6 },
  { x: 9, y: 6 },
  { x: 19, y: 6 },
  { x: 20, y: 6 },
  { x: 21, y: 6 },
  { x: 22, y: 6 },
  { x: 23, y: 6 },
  { x: 24, y: 6 },
  { x: 33, y: 6 },

  // Row 7 (y=7)
  { x: 2, y: 7 },
  { x: 9, y: 7 },
  { x: 10, y: 7 },
  { x: 11, y: 7 },
  { x: 12, y: 7 },
  { x: 13, y: 7 },
  { x: 14, y: 7 },
  { x: 19, y: 7 },
  { x: 24, y: 7 },
  { x: 31, y: 7 },
  { x: 32, y: 7 },
  { x: 33, y: 7 },

  // Row 8 (y=8)
  { x: 2, y: 8 },
  { x: 9, y: 8 },
  { x: 14, y: 8 },
  { x: 19, y: 8 },
  { x: 24, y: 8 },
  { x: 30, y: 8 },
  { x: 31, y: 8 },
  { x: 32, y: 8 },
  { x: 33, y: 8 },

  // Row 9 (y=9)
  { x: 2, y: 9 },
  { x: 3, y: 9 },
  { x: 4, y: 9 },
  { x: 5, y: 9 },
  { x: 6, y: 9 },
  { x: 7, y: 9 },
  { x: 8, y: 9 },
  { x: 9, y: 9 },
  { x: 14, y: 9 },
  { x: 15, y: 9 },
  { x: 16, y: 9 },
  { x: 17, y: 9 },
  { x: 18, y: 9 },
  { x: 19, y: 9 },
  { x: 24, y: 9 },
  { x: 29, y: 9 },
  { x: 30, y: 9 },
  { x: 31, y: 9 },
  { x: 33, y: 9 },

  // Row 10 (y=10)
  { x: 2, y: 10 },
  { x: 5, y: 10 },
  { x: 14, y: 10 },
  { x: 16, y: 10 },
  { x: 19, y: 10 },
  { x: 24, y: 10 },
  { x: 29, y: 10 },
  { x: 30, y: 10 },
  { x: 33, y: 10 },

  // Row 11 (y=11)
  { x: 2, y: 11 },
  { x: 5, y: 11 },
  { x: 14, y: 11 },
  { x: 16, y: 11 },
  { x: 19, y: 11 },
  { x: 20, y: 11 },
  { x: 21, y: 11 },
  { x: 22, y: 11 },
  { x: 23, y: 11 },
  { x: 24, y: 11 },
  { x: 25, y: 11 },
  { x: 26, y: 11 },
  { x: 27, y: 11 },
  { x: 28, y: 11 },
  { x: 29, y: 11 },
  { x: 30, y: 11 },
  { x: 31, y: 11 },
  { x: 32, y: 11 },
  { x: 33, y: 11 },

  // Row 12 (y=12)
  { x: 2, y: 12 },
  { x: 3, y: 12 },
  { x: 4, y: 12 },
  { x: 5, y: 12 },
  { x: 6, y: 12 },
  { x: 7, y: 12 },
  { x: 8, y: 12 },
  { x: 9, y: 12 },
  { x: 10, y: 12 },
  { x: 11, y: 12 },
  { x: 12, y: 12 },
  { x: 13, y: 12 },
  { x: 14, y: 12 },
  { x: 16, y: 12 },
  { x: 19, y: 12 },
  { x: 24, y: 12 },
  { x: 28, y: 12 },
  { x: 33, y: 12 },

  // Row 13 (y=13)
  { x: 2, y: 13 },
  { x: 5, y: 13 },
  { x: 12, y: 13 },
  { x: 16, y: 13 },
  { x: 19, y: 13 },
  { x: 24, y: 13 },
  { x: 28, y: 13 },
  { x: 29, y: 13 },
  { x: 30, y: 13 },
  { x: 31, y: 13 },
  { x: 32, y: 13 },
  { x: 33, y: 13 },

  // Row 14 (y=14)
  { x: 2, y: 14 },
  { x: 5, y: 14 },
  { x: 12, y: 14 },
  { x: 16, y: 14 },
  { x: 19, y: 14 },
  { x: 24, y: 14 },
  { x: 28, y: 14 },
  { x: 33, y: 14 },

  // Row 15 (y=15)
  { x: 2, y: 15 },
  { x: 5, y: 15 },
  { x: 12, y: 15 },
  { x: 16, y: 15 },
  { x: 18, y: 15 },
  { x: 19, y: 15 },
  { x: 24, y: 15 },
  { x: 28, y: 15 },
  { x: 33, y: 15 },

  // Row 16 (y=16)
  { x: 2, y: 16 },
  { x: 5, y: 16 },
  { x: 12, y: 16 },
  { x: 16, y: 16 },
  { x: 17, y: 16 },
  { x: 18, y: 16 },
  { x: 19, y: 16 },
  { x: 24, y: 16 },
  { x: 28, y: 16 },
  { x: 33, y: 16 },

  // Row 17 (y=17)
  { x: 2, y: 17 },
  { x: 5, y: 17 },
  { x: 12, y: 17 },
  { x: 16, y: 17 },
  { x: 17, y: 17 },
  { x: 18, y: 17 },
  { x: 19, y: 17 },
  { x: 24, y: 17 },
  { x: 28, y: 17 },
  { x: 33, y: 17 },

  // Row 18 (y=18)
  { x: 2, y: 18 },
  { x: 5, y: 18 },
  { x: 12, y: 18 },
  { x: 15, y: 18 },
  { x: 16, y: 18 },
  { x: 17, y: 18 },
  { x: 19, y: 18 },
  { x: 20, y: 18 },
  { x: 21, y: 18 },
  { x: 22, y: 18 },
  { x: 23, y: 18 },
  { x: 24, y: 18 },
  { x: 25, y: 18 },
  { x: 26, y: 18 },
  { x: 27, y: 18 },
  { x: 28, y: 18 },
  { x: 29, y: 18 },
  { x: 30, y: 18 },
  { x: 31, y: 18 },
  { x: 32, y: 18 },
  { x: 33, y: 18 },

  // Row 19 (y=19)
  { x: 2, y: 19 },
  { x: 5, y: 19 },
  { x: 6, y: 19 },
  { x: 7, y: 19 },
  { x: 8, y: 19 },
  { x: 9, y: 19 },
  { x: 10, y: 19 },
  { x: 11, y: 19 },
  { x: 12, y: 19 },
  { x: 14, y: 19 },
  { x: 15, y: 19 },
  { x: 16, y: 19 },
  { x: 19, y: 19 },
  { x: 24, y: 19 },
  { x: 33, y: 19 },

  // Row 20 (y=20)
  { x: 2, y: 20 },
  { x: 5, y: 20 },
  { x: 12, y: 20 },
  { x: 13, y: 20 },
  { x: 14, y: 20 },
  { x: 15, y: 20 },
  { x: 16, y: 20 },
  { x: 19, y: 20 },
  { x: 24, y: 20 },
  { x: 33, y: 20 },

  // Row 21 (y=21)
  { x: 2, y: 21 },
  { x: 5, y: 21 },
  { x: 6, y: 21 },
  { x: 7, y: 21 },
  { x: 8, y: 21 },
  { x: 12, y: 21 },
  { x: 13, y: 21 },
  { x: 14, y: 21 },
  { x: 16, y: 21 },
  { x: 19, y: 21 },
  { x: 24, y: 21 },
  { x: 33, y: 21 },

  // Row 22 (y=22)
  { x: 2, y: 22 },
  { x: 8, y: 22 },
  { x: 12, y: 22 },
  { x: 16, y: 22 },
  { x: 19, y: 22 },
  { x: 24, y: 22 },
  { x: 33, y: 22 },

  // Row 23 (y=23)
  { x: 2, y: 23 },
  { x: 8, y: 23 },
  { x: 12, y: 23 },
  { x: 16, y: 23 },
  { x: 17, y: 23 },
  { x: 18, y: 23 },
  { x: 19, y: 23 },
  { x: 20, y: 23 },
  { x: 21, y: 23 },
  { x: 22, y: 23 },
  { x: 23, y: 23 },
  { x: 24, y: 23 },
  { x: 33, y: 23 },

  // Row 24 (y=24)
  { x: 2, y: 24 },
  { x: 3, y: 24 },
  { x: 4, y: 24 },
  { x: 5, y: 24 },
  { x: 6, y: 24 },
  { x: 7, y: 24 },
  { x: 8, y: 24 },
  { x: 9, y: 24 },
  { x: 10, y: 24 },
  { x: 11, y: 24 },
  { x: 12, y: 24 },
  { x: 19, y: 24 },
  { x: 24, y: 24 },
  { x: 33, y: 24 },

  // Row 25 (y=25)
  { x: 2, y: 25 },
  { x: 6, y: 25 },
  { x: 12, y: 25 },
  { x: 19, y: 25 },
  { x: 24, y: 25 },
  { x: 33, y: 25 },

  // Row 26 (y=26)
  { x: 2, y: 26 },
  { x: 6, y: 26 },
  { x: 12, y: 26 },
  { x: 13, y: 26 },
  { x: 14, y: 26 },
  { x: 15, y: 26 },
  { x: 16, y: 26 },
  { x: 17, y: 26 },
  { x: 18, y: 26 },
  { x: 19, y: 26 },
  { x: 20, y: 26 },
  { x: 21, y: 26 },
  { x: 22, y: 26 },
  { x: 23, y: 26 },
  { x: 24, y: 26 },
  { x: 25, y: 26 },
  { x: 26, y: 26 },
  { x: 27, y: 26 },
  { x: 28, y: 26 },
  { x: 29, y: 26 },
  { x: 30, y: 26 },
  { x: 31, y: 26 },
  { x: 32, y: 26 },
  { x: 33, y: 26 },

  // Row 27 (y=27)
  { x: 2, y: 27 },
  { x: 3, y: 27 },
  { x: 4, y: 27 },
  { x: 5, y: 27 },
  { x: 6, y: 27 },
  { x: 7, y: 27 },
  { x: 8, y: 27 },
  { x: 9, y: 27 },
  { x: 10, y: 27 },
  { x: 11, y: 27 },
  { x: 12, y: 27 },
  { x: 13, y: 27 },
  { x: 14, y: 27 },
]

export const STORYLINE_MISSIONS = {
  MISSION_ZERO: "MISSION_ZERO",
  MISSION_ONE: Mission_EnemyChasingYou, // MISSION MARKER IN 12,7
  MISSION_TWO: Mission_SquadWipe,
}
