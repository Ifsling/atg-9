import { MyGame } from "../MyGame"

export function handleGunPickup(scene: MyGame) {
  scene.player.canShoot = true
  scene.gun.setPosition(scene.player.x, scene.player.y)
  const angle = Phaser.Math.Angle.Between(
    scene.input.activePointer.worldX,
    scene.input.activePointer.worldY,
    scene.gun.x,
    scene.gun.y
  )

  scene.gun.setRotation(angle)
  scene.player.setScale(0.3)
}
