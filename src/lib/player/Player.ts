import Phaser from "phaser"
import { CustomKeys, MyGame } from "../MyGame"

export class Player extends Phaser.GameObjects.Sprite {
  canShoot: boolean = false
  health: number = 100

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)
    this.setScale(0.3)
  }
}

export type PlayerCharacter = Player

export function damagePlayer(scene: MyGame, damageAmount: number) {
  const playerParent = scene.PlayerParent as any

  if (playerParent.health > 0) {
    playerParent.health -= damageAmount
    scene.drawPlayerHealthBar(playerParent.health)

    if (playerParent.health <= 0) {
      damagePlayer(scene, 0)
    }
  } else {
    scene.bloodParticleSystem.explode(
      30,
      scene.playerParentBody.x,
      scene.playerParentBody.y
    )

    scene.isPlayerAlive = false
    scene.player.destroy()
    playerParent.destroy()
    scene.playerParentBody.destroy()
    if (scene.bullets) {
      scene.bullets.clear(true, true)
      scene.bullets.destroy()
      scene.bullets = scene.physics.add.group({
        classType: Phaser.Physics.Arcade.Image,
        maxSize: 0,
        runChildUpdate: true,
      })
    }
    scene.drawPlayerHealthBar(playerParent.health)
  }
}

export function setupPlayerParent(scene: MyGame, x: number, y: number) {
  scene.player = createPlayer(scene, 0, 0)
  scene.PlayerParent = scene.add.container(x, y, [scene.player])
  scene.physics.add.existing(scene.PlayerParent)

  scene.playerParentBody = scene.PlayerParent.body as Phaser.Physics.Arcade.Body
  scene.playerParentBody.setCollideWorldBounds(true)
  scene.playerParentBody.setSize(
    scene.player.displayWidth,
    scene.player.displayHeight
  )
  scene.playerParentBody.setOffset(
    -scene.player.displayWidth / 2,
    -scene.player.displayHeight / 2
  )
  ;(scene.PlayerParent as any).health = 100

  return scene.PlayerParent
}

export function createPlayer(
  scene: Phaser.Scene,
  xPos = 700,
  yPos = 600
): Player {
  const player = new Player(scene, xPos, yPos, "player")

  return player
}

export function handlePlayerMovement(
  playerParent: Phaser.GameObjects.Container,
  cursors: CustomKeys,
  speed = 200
) {
  if (!playerParent || !playerParent.body || !playerParent.active) return

  const body = playerParent.body as Phaser.Physics.Arcade.Body
  body.setVelocity(0)

  if (cursors.left.isDown || cursors.leftArrow.isDown) {
    body.setVelocityX(-speed)
  } else if (cursors.right.isDown || cursors.rightArrow.isDown) {
    body.setVelocityX(speed)
  }

  if (cursors.up.isDown || cursors.upArrow.isDown) {
    body.setVelocityY(-speed)
  } else if (cursors.down.isDown || cursors.downArrow.isDown) {
    body.setVelocityY(speed)
  }
}
