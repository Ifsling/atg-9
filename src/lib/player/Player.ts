import Phaser from "phaser"
import { CustomKeys } from "../MyGame"

export class Player extends Phaser.Physics.Arcade.Sprite {
  canShoot: boolean = false

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)
    scene.physics.add.existing(this)
    this.setScale(0.3)
    this.setCollideWorldBounds(true)
  }
}

export type PlayerCharacter = Player

export function createPlayer(
  scene: Phaser.Scene,
  xPos = 700,
  yPos = 600
): Player {
  const player = new Player(scene, xPos, yPos, "player")
  scene.add.existing(player)
  return player
}

export function handlePlayerMovement(
  player: Phaser.Physics.Arcade.Sprite,
  cursors: CustomKeys,
  speed = 200
) {
  if (!player || !cursors) return

  player.setVelocity(0)

  if (cursors.left.isDown || cursors.leftArrow.isDown) {
    player.setVelocityX(-speed)
  } else if (cursors.right.isDown || cursors.rightArrow.isDown) {
    player.setVelocityX(speed)
  }

  if (cursors.up.isDown || cursors.upArrow.isDown) {
    player.setVelocityY(-speed)
  } else if (cursors.down.isDown || cursors.downArrow.isDown) {
    player.setVelocityY(speed)
  }
}
