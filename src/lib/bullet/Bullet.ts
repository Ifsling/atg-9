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

// Modified bullet shooting function with improved collision detection
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

  bullet.setActive(true)
  bullet.setVisible(true)
  bullet.setScale(0.1)

  // Reset the physics body
  bullet!.body!.reset(worldGunX, worldGunY)

  // Set bullet body properties
  bullet!.body!.setSize(bullet.width * 0.8, bullet.height * 0.8) // Slightly smaller than visual size
  bullet!.body!.setOffset(bullet.width * 0.1, bullet.height * 0.1) // Center the hitbox

  // Get angle and set rotation
  const angle = Phaser.Math.Angle.Between(
    worldGunX,
    worldGunY,
    targetX,
    targetY
  )
  bullet.setRotation(angle)

  // Set bullet velocity
  const speed = 500
  bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)

  // Enable collision with world bounds
  bullet.setCollideWorldBounds(true, undefined, undefined, true)

  // Ensure the bullet is in the right physics group
  if (!bullets.contains(bullet)) {
    bullets.add(bullet)
  }

  console.log("Bullet fired:", {
    position: { x: worldGunX, y: worldGunY },
    velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
    angle: angle,
    bodyEnabled: bullet!.body!.enable,
  })
}
