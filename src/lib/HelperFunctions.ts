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

  scene.physics.add.collider(
    scene.bullets,
    scene.enemy1.sprite,
    (bullet, enemySprite) => {
      console.log("Bullet collided with enemy!")
      const playerBullet = bullet as Phaser.Physics.Arcade.Image
      playerBullet.destroy()
      scene.enemy1.takeDamage(20)
    }
  )

  scene.physics.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
    const gameObject = body.gameObject
    if (
      gameObject &&
      (gameObject as Phaser.GameObjects.Image).texture?.key === "bullet"
    ) {
      const bullet = gameObject as Phaser.Physics.Arcade.Image
      bullet.setActive(false)
      bullet.setVisible(false)
      bullet.destroy()
    }
  })

  scene.enemies.forEach((enemy) => {
    scene.physics.add.overlap(
      enemy.bullets,
      scene.PlayerParent,
      (player, bullet) => {
        const enemyBullet = bullet as Phaser.Physics.Arcade.Image
        enemyBullet.setActive(false)
        enemyBullet.setVisible(false)
        enemyBullet.destroy()

        // Reduce player health
        const playerParent = scene.PlayerParent as any
        playerParent.health -= 10
        scene.drawPlayerHealthBar(playerParent.health)
      }
    )
  })
}

export function handleUi(scene: MyGame) {
  const healthBarWidth = 200
  const healthBarHeight = 20
  const x = scene.scale.width - healthBarWidth - 10
  const y = 10

  // Background (gray)
  scene.playerHealthBackground = scene.add.graphics()
  scene.playerHealthBackground.fillStyle(0x444444)
  scene.playerHealthBackground.fillRect(x, y, healthBarWidth, healthBarHeight)
  scene.playerHealthBackground.setScrollFactor(0).setDepth(1000)

  // Foreground (red)
  scene.playerHealthBar = scene.add.graphics()
  scene.playerHealthBar.setScrollFactor(0).setDepth(1001) // <- Important!
  scene.drawPlayerHealthBar(100) // <- Use the new method, initial full health

  // Bullet count
  scene.bulletText = scene.add
    .text(10, 10, `Bullets: ${scene.maxBullets}`, {
      fontSize: "18px",
      color: "#ffffff",
      fontFamily: "monospace",
      backgroundColor: "#000000",
      padding: { x: 6, y: 4 },
    })
    .setScrollFactor(0)
    .setDepth(1000)
}

export function addingGunstoMap(scene: MyGame) {
  const gun1 = scene.physics.add
    .sprite(1000, 500, "gun")
    .setScale(0.1)
    .setOrigin(0.2, 0.7)

  ;(gun1 as any).gunData = { ammo: 10, fireRate: 300, gunType: "pistol" }

  const gun2 = scene.physics.add
    .sprite(1000, 900, "gun")
    .setScale(0.1)
    .setOrigin(0.2, 0.7)
  ;(gun2 as any).gunData = { ammo: 30, fireRate: 100, gunType: "rifle" }

  scene.gunsGroup.addMultiple([gun1, gun2])
}

export function createPlayerBullets(scene: MyGame) {
  scene.bullets = scene.physics.add.group({
    classType: Phaser.Physics.Arcade.Image,
    maxSize: scene.currentGun?.maxAmmo,
    runChildUpdate: true,
  })
}
