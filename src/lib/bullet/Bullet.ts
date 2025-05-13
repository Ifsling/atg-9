import { MyGame } from "../MyGame"

export function handleShooting(scene: MyGame) {
  scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    if (
      scene.player.canShoot &&
      scene.currentGun &&
      scene.currentGun.ammo > 0
    ) {
      scene.player.canShoot = false

      shootBullet(
        scene,
        scene.playerParentBody,
        scene.bullets,
        pointer.worldX,
        pointer.worldY
      )
      scene.time.delayedCall(scene.shootCooldown, () => {
        scene.player.canShoot = true
      })
    }
  })
}

export function shootBullet(
  scene: MyGame,
  player: Phaser.Physics.Arcade.Body,
  bullets: Phaser.Physics.Arcade.Group,
  targetX: number,
  targetY: number
) {
  const worldGunX = player.x + 113
  const worldGunY = player.y + 100

  const bullet = bullets.get(
    worldGunX,
    worldGunY,
    "bullet"
  ) as Phaser.Physics.Arcade.Image

  if (!bullet) return

  scene.currentGun!.ammo -= 1

  scene.add.existing(bullet)
  scene.physics.add.existing(bullet)

  bullet.setActive(true)
  bullet.setVisible(true)
  bullet.setScale(0.1)

  // Reset the position of the bullet
  bullet!.body!.reset(worldGunX, worldGunY)

  // Get angle and set rotation
  const angle = Phaser.Math.Angle.Between(
    worldGunX,
    worldGunY,
    targetX,
    targetY
  )
  bullet.setRotation(angle)

  // Set bullet velocity to move towards the target
  const speed = 500
  bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)

  // Enable world bounds collision and destroy bullet on collision
  bullet.setCollideWorldBounds(true, undefined, undefined, true)

  console.log("Bullet body exists:", bullet.body !== null)
}
