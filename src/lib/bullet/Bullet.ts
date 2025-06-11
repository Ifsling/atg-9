import { MyGame } from "../MyGame"

export function handleShooting(scene: MyGame) {
  let startedShooting: boolean = false
  let smgTimer: Phaser.Time.TimerEvent | null = null

  scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    if (
      scene.player.canShoot &&
      scene.currentGun &&
      scene.currentGun.ammo > 0
    ) {
      // getting current gun type
      const currentGun = scene.currentGun

      scene.player.canShoot = false

      switch (currentGun.gunType) {
        case "shotgun":
          shootShotgun(
            scene,
            scene.playerParentBody,
            scene.bullets,
            pointer.worldX,
            pointer.worldY
          )
          break
        case "smg":
          if (!startedShooting) {
            startedShooting = true
            smgTimer = scene.time.addEvent({
              delay: 100,
              loop: true,
              callback: () => {
                if (currentGun.ammo > 0) {
                  shootBullet(
                    scene,
                    scene.playerParentBody,
                    scene.bullets,
                    pointer.worldX,
                    pointer.worldY
                  )
                } else {
                  smgTimer!.remove(false)
                }
              },
            })
          }
          break
        case "rocket-launcher":
          shootRocketLauncher(
            scene,
            scene.playerParentBody,
            scene.bullets,
            pointer.worldX,
            pointer.worldY
          )
          break
        default:
          shootBullet(
            scene,
            scene.playerParentBody,
            scene.bullets,
            pointer.worldX,
            pointer.worldY
          )
      }
      scene.time.delayedCall(currentGun.fireRate, () => {
        scene.player.canShoot = true
      })
    }
  })

  scene.input.on("pointerup", () => {
    if (startedShooting) {
      startedShooting = false
      smgTimer!.remove(false)
    }
  })
}

export function shootRocketLauncher(
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
    "rocket-launcher-bullet"
  ) as Phaser.Physics.Arcade.Image

  if (!bullet) return

  scene.currentGun!.ammo -= 1

  bullet.setActive(true)
  bullet.setVisible(true)
  bullet.setScale(0.2)

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

  bullet.body!.setCollisionCategory(2) // or any number that's specific for player bullets

  // Ensure the bullet is in the right physics group
  if (!bullets.contains(bullet)) {
    bullets.add(bullet)
  }

  scene.time.delayedCall(5000, () => {
    if (!bullet.active) return

    scene.explosionParticleSystem.explode(10, bullet.x, bullet.y)

    bullet.disableBody(true, true) // Hide and deactivate the bullet
  })
}

export function shootShotgun(
  scene: MyGame,
  player: Phaser.Physics.Arcade.Body,
  bullets: Phaser.Physics.Arcade.Group,
  targetX: number,
  targetY: number
) {
  const worldGunX = player.x + 113
  const worldGunY = player.y + 100

  const baseAngle = Phaser.Math.Angle.Between(
    worldGunX,
    worldGunY,
    targetX,
    targetY
  )
  const spread = Phaser.Math.DegToRad(10) // spread in radians (10 degrees)

  const angles = [baseAngle - spread, baseAngle, baseAngle + spread]

  for (const angle of angles) {
    const bullet = bullets.get(
      worldGunX,
      worldGunY,
      "bullet"
    ) as Phaser.Physics.Arcade.Image
    if (!bullet) continue

    bullet.setActive(true)
    bullet.setVisible(true)
    bullet.setScale(0.1)

    bullet.body!.reset(worldGunX, worldGunY)
    bullet.body!.setSize(bullet.width * 0.8, bullet.height * 0.8)
    bullet.body!.setOffset(bullet.width * 0.1, bullet.height * 0.1)

    bullet.setRotation(angle)

    const speed = 1000
    bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)

    bullet.setCollideWorldBounds(true, undefined, undefined, true)
    bullet.body!.setCollisionCategory(2)

    if (!bullets.contains(bullet)) {
      bullets.add(bullet)
    }
  }
  scene.currentGun!.ammo -= 1
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

  bullet.body!.setCollisionCategory(2) // or any number that's specific for player bullets

  // Ensure the bullet is in the right physics group
  if (!bullets.contains(bullet)) {
    bullets.add(bullet)
  }
}
