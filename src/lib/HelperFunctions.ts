// src/utils/gameHelpers.ts
import Phaser from "phaser"
import { CustomKeys, MyGame } from "./MyGame"
import { handleGunPickup } from "./gun/Gun"

export function setupControls(scene: Phaser.Scene): CustomKeys {
  return scene.input.keyboard!.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
    upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
    downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN,
    leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
    rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    t: Phaser.Input.Keyboard.KeyCodes.T,
  }) as CustomKeys
}

export function handleCollisions(
  scene: MyGame,
  houses: Phaser.Tilemaps.TilemapLayer | null = null
) {
  if (houses) {
    scene.physics.add.collider(scene.PlayerParent, houses)
    scene.physics.add.collider(scene.gunsGroup, houses)
  }

  scene.physics.add.overlap(
    scene.PlayerParent,
    scene.gunsGroup,
    (player, gun) => handleGunPickup(scene, gun as Phaser.GameObjects.Sprite),
    undefined,
    scene
  )
}
