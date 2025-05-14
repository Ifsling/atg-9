import { CustomKeys, MyGame } from "../MyGame"

export function handleGunPickup(
  scene: MyGame,
  gunSprite: Phaser.GameObjects.Sprite
) {
  scene.player.canShoot = true

  // already picked up one
  if (!scene.canPickupGun) return
  scene.canPickupGun = false

  scene.player.canShoot = true

  const data = (gunSprite as any).gunData || {
    ammo: 10,
    fireRate: 300,
    gunType: "default",
  }

  scene.currentGun = {
    sprite: gunSprite,
    ammo: data.ammo,
    fireRate: data.fireRate,
    maxAmmo: data.ammo,
    gunType: data.gunType,
  }

  scene.bullets = scene.physics.add.group({
    classType: Phaser.Physics.Arcade.Image,
    maxSize: data.ammo,
    runChildUpdate: true,
  })
  scene.gunsGroup.remove(gunSprite, true, false)

  scene.PlayerParent.add(scene.currentGun.sprite)
  scene.currentGun.sprite.setPosition(40, 40)
}

export function handleGunRotation(scene: MyGame) {
  if (!scene.player.canShoot || !scene.currentGun) return
  const gunSprite = scene.currentGun.sprite

  const worldGunX = scene.PlayerParent.x + gunSprite.x
  const worldGunY = scene.PlayerParent.y + gunSprite.y

  const angle = Phaser.Math.Angle.Between(
    worldGunX,
    worldGunY,
    scene.input.activePointer.worldX,
    scene.input.activePointer.worldY
  )

  gunSprite.setRotation(angle)
}

export function handleGunThrow(scene: MyGame, cursors: CustomKeys) {
  if (cursors.t.isDown && scene.currentGun) {
    scene.canPickupGun = true

    // Remove gun sprite from player
    scene.PlayerParent.remove(scene.currentGun.sprite)

    // Clear current gun reference
    scene.currentGun = undefined
    scene.player.canShoot = false

    // Destroy bullet group
    if (scene.bullets) {
      scene.bullets.clear(true, true)
      scene.bullets.destroy()
      scene.bullets = scene.physics.add.group({
        classType: Phaser.Physics.Arcade.Image,
        maxSize: 0,
        runChildUpdate: true,
      })
    }
  }
}
