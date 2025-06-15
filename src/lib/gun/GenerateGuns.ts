import { MyGame } from "../MyGame"

export function SpawnPistol(scene: MyGame, x: number, y: number) {
  const pistolSprite = scene.add
    .sprite(x, y, "pistol")
    .setScale(0.1)
    .setOrigin(0.2, 0.7)
  ;(pistolSprite as any).gunData = {
    ammo: 30,
    fireRate: 300,
    gunType: "pistol",
    damage: 10,
  }

  return pistolSprite
}

export function SpawnShotgun(scene: MyGame, x: number, y: number) {
  const shotgunSprite = scene.add
    .sprite(x, y, "shotgun")
    .setScale(0.3)
    .setOrigin(0.2, 0.7)
  ;(shotgunSprite as any).gunData = {
    ammo: 5,
    fireRate: 1000,
    gunType: "shotgun",
    damage: 12,
  }

  return shotgunSprite
}

export function SpawnSMG(scene: MyGame, x: number, y: number) {
  const smgSprite = scene.add
    .sprite(x, y, "smg")
    .setScale(0.3)
    .setOrigin(0.2, 0.7)
  ;(smgSprite as any).gunData = {
    ammo: 50,
    fireRate: 100,
    gunType: "smg",
    damage: 10,
  }

  return smgSprite
}

export function SpawnRocketLauncher(scene: MyGame, x: number, y: number) {
  const rocketLauncherSprite = scene.add
    .sprite(x, y, "rocket-launcher")
    .setScale(0.2)
    .setOrigin(0.2, 0.7)
  ;(rocketLauncherSprite as any).gunData = {
    ammo: 5,
    fireRate: 1000,
    gunType: "rocket-launcher",
    damage: 90,
  }

  return rocketLauncherSprite
}
