import { MissionTwo_KillSquad } from "./mission/MissionTwo"

export interface GunData {
  sprite: Phaser.GameObjects.Sprite
  ammo: number
  fireRate: number
  maxAmmo: number
  gunType: string
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
}

export const MISSIONS = {
  // KILL_SQUAD: MissionOne_KillSquad,
  RUN_FROM_SQUAD: MissionTwo_KillSquad,
}
