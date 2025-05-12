import { MyGame } from "../MyGame"
import { PlayerCharacter } from "../player/Player"

export function handleShooting(scene: MyGame) {
  scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    if (scene.player.canShoot && scene.canShoot) {
      shootBullet(
        scene,
        scene.player,
        scene.bullets,
        pointer.worldX,
        pointer.worldY
      )
      scene.canShoot = false
      scene.time.delayedCall(scene.shootCooldown, () => {
        scene.canShoot = true
      })
    }
  })
}

export function shootBullet(
  scene: Phaser.Scene,
  player: PlayerCharacter,
  bullets: Phaser.Physics.Arcade.Group,
  targetX: number,
  targetY: number
) {
  const bullet = bullets.get(
    player.x,
    player.y,
    "bullet"
  ) as Phaser.Physics.Arcade.Image

  if (!bullet) return

  bullet.setActive(true)
  bullet.setVisible(true)
  bullet.setScale(0.1)

  bullet!.body!.reset(player.x, player.y)

  const angle = Phaser.Math.Angle.Between(player.x, player.y, targetX, targetY)
  bullet.setRotation(angle)

  const speed = 500
  bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)

  bullet.setCollideWorldBounds(true)
  scene.physics.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
    if (body.gameObject === bullet) bullet.destroy()
  })
}
