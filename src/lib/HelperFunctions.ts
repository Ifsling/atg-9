// src/utils/gameHelpers.ts
import * as Phaser from "phaser"
import { CustomKeys } from "./ConstantsAndTypes"
import { MyGame } from "./MyGame"
import { handleWeaponsCheatSystem } from "./cheat-system/CheatSystem"
import { EnemyNew } from "./enemy/EnemyNew"
import {
  SpawnPistol,
  SpawnRocketLauncher,
  SpawnShotgun,
  SpawnSMG,
} from "./gun/GenerateGuns"
import { handleGunPickup } from "./gun/Gun"
import { NPC } from "./npc/Npc"
import { damagePlayer, drawPlayerHealthBar } from "./player/Player"

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
    tilde: Phaser.Input.Keyboard.KeyCodes.BACKTICK,
    f: Phaser.Input.Keyboard.KeyCodes.F,
    n: Phaser.Input.Keyboard.KeyCodes.N,
    shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
  }) as CustomKeys
}

// Modified collision handling function
export function handleCollisions(
  scene: MyGame,
  houses: Phaser.Tilemaps.TilemapLayer | null = null,
  water: Phaser.Tilemaps.TilemapLayer | null = null
) {
  if (houses) {
    scene.physics.add.collider(scene.PlayerParent, houses)
    scene.physics.add.collider(scene.gunsGroup, houses)

    if (scene.carsGroup) {
      scene.carsGroup.getChildren().forEach((car: any) => {
        if (car.body) {
          scene.physics.add.collider(car, houses)
        }
      })
    }

    // Add collisions between enemy containers and houses
    scene.enemies.forEach((enemy) => {
      scene.physics.add.collider(enemy.enemySprite, houses)
    })
  }

  if (water) {
    scene.physics.add.collider(scene.PlayerParent, water)
    if (scene.carsGroup) {
      scene.carsGroup.getChildren().forEach((car: any) => {
        if (car.body) {
          scene.physics.add.collider(car, water)
        }
      })
    }
  }

  // Gun pickup overlap
  scene.physics.add.overlap(
    scene.PlayerParent,
    scene.gunsGroup,
    (player, gun) => handleGunPickup(scene, gun as Phaser.GameObjects.Sprite),
    undefined,
    scene
  )

  // Add physical collision between player and enemies
  scene.enemies.forEach((enemy) => {
    scene.physics.add.collider(scene.PlayerParent, enemy.enemySprite)
  })

  // Add physical collision between player and Cops
  scene.cops.forEach((cop) => {
    scene.physics.add.overlap(
      cop.enemyBullets,
      scene.PlayerParent,
      (player, bullet) => {
        const enemyBullet = bullet as Phaser.Physics.Arcade.Image
        enemyBullet.destroy()

        // Damage the player
        damagePlayer(scene, 10)
      },
      undefined,
      scene
    )
  })

  // Enemy bullet hits player
  scene.enemies.forEach((enemy) => {
    scene.physics.add.overlap(
      enemy.enemyBullets,
      scene.PlayerParent,
      (player, bullet) => {
        const enemyBullet = bullet as Phaser.Physics.Arcade.Image
        enemyBullet.destroy()

        // Damage the player
        damagePlayer(scene, 10)
      },
      undefined,
      scene
    )
  })

  // Handle bullet collisions with world bounds
  scene.physics.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
    const gameObject = body.gameObject
    if (gameObject) {
      const textureKey = (gameObject as Phaser.GameObjects.Image).texture?.key

      if (textureKey === "bullet") {
        gameObject.destroy()
      }

      if (textureKey === "rocket-launcher-bullet") {
        const sprite = gameObject as Phaser.GameObjects.Image
        scene.explosionParticleSystem.explode(10, sprite.x, sprite.y)
        sprite.destroy()
      }
    }
  })
}

export function handleUi(scene: MyGame) {
  const healthBarWidth = 200
  const healthBarHeight = 20
  const margin = 10
  const x = scene.scale.width - healthBarWidth - margin
  const y = margin

  // Health Bar Background (gray)
  scene.playerHealthBackground = scene.add.graphics()
  scene.playerHealthBackground
    .fillStyle(0x444444)
    .fillRect(x, y, healthBarWidth, healthBarHeight)
    .setScrollFactor(0)
    .setDepth(1000)

  // Health Bar Foreground (red)
  scene.playerHealthBar = scene.add.graphics()
  scene.playerHealthBar.setScrollFactor(0).setDepth(1001)

  // Draw initial health
  drawPlayerHealthBar(scene, 100)

  // Bullet Count Text
  scene.bulletText = scene.add
    .text(margin, y, `Bullets: ${scene.maxBullets}`, {
      fontSize: "18px",
      color: "#ffffff",
      fontFamily: "monospace",
      backgroundColor: "#000000",
      padding: { x: 6, y: 4 },
    })
    .setScrollFactor(0)
    .setDepth(1002)

  // Wanted Level Stars (UI layer)
  displayWantedLevelStars(scene)
}

export function displayWantedLevelStars(scene: MyGame) {
  // Wanted level (stars)
  const starSpacing = 32 // space between stars
  const starSize = 24
  const centerX = scene.scale.width / 2
  const topY = 10

  // Remove previous stars if any
  if (scene.wantedStars) {
    scene.wantedStars.forEach((star) => star.destroy())
  }

  scene.wantedStars = []

  if (scene.wantedLevel > 0) {
    const totalWidth = (scene.wantedLevel - 1) * starSpacing
    const startX = centerX - totalWidth / 2

    for (let i = 0; i < scene.wantedLevel; i++) {
      const star = scene.add
        .image(startX + i * starSpacing, topY + starSize / 2, "star")
        .setScrollFactor(0)
        .setDepth(1000)
        .setDisplaySize(starSize, starSize)

      scene.wantedStars.push(star)
    }
  }
}

export function addingGunstoMap(scene: MyGame) {
  const gun1 = SpawnPistol(scene, 300, 200)
  const gun2 = SpawnShotgun(scene, 500, 200)
  const gun3 = SpawnSMG(scene, 730, 200)
  const gun4 = SpawnRocketLauncher(scene, 1000, 200)

  scene.gunsGroup.addMultiple([gun1, gun2, gun3, gun4])
}

export function createPlayerBullets(scene: MyGame) {
  scene.bullets = scene.physics.add.group({
    classType: Phaser.Physics.Arcade.Image,
    maxSize: scene.currentGun?.maxAmmo,
    runChildUpdate: true,
  })
}

export function setupParticleSystem(scene: MyGame) {
  scene.bloodParticleSystem = scene.add.particles(100, 100, "blood-drop", {
    x: 100,
    y: 100,
    alpha: { start: 1, end: 0 },
    angle: { min: 200, max: 300 }, // Downward spread (180 is straight down)
    speed: { min: 200, max: 400 },
    gravityY: 1000,
    lifespan: 800,
    quantity: 20,
    scale: { start: 0.3, end: 0 },
    blendMode: "NORMAL",
    emitting: false,
    emitZone: {
      type: "edge",
      source: new Phaser.Geom.Circle(0, 0, 20), // small circle around (x, y)
      quantity: 20,
      yoyo: true,
    },
  })

  scene.missionMarkerPickedParticleSystem = scene.add.particles(
    100,
    100,
    "diamond-shape", // make sure "coin" is a loaded texture key (spritesheet or image)
    {
      x: 100,
      y: 100,
      alpha: { start: 1, end: 0 }, // fade out
      angle: { min: 250, max: 290 }, // slight spread upward
      speed: { min: 100, max: 200 }, // upward velocity
      gravityY: -200, // float up gently
      lifespan: 800,
      quantity: 10,
      scale: { start: 0.2, end: 0 }, // shrink to nothing
      rotate: { min: 0, max: 360 }, // rotate randomly
      blendMode: "ADD",
      emitting: false,
      emitZone: {
        type: "edge",
        source: new Phaser.Geom.Circle(0, 0, 20),
        quantity: 10,
        yoyo: false,
      },
    }
  )

  // CREATE - Define the explosion particle system
  scene.explosionParticleSystem = scene.add.particles(0, 0, "white-circle", {
    x: 0,
    y: 0,
    speed: { min: 150, max: 400 }, // initial burst speed
    angle: { min: 0, max: 360 },
    scale: {
      start: Phaser.Math.FloatBetween(0.5, 1.0), // some small, some big
      end: Phaser.Math.FloatBetween(1.2, 2.0),
    },
    alpha: { start: 1, end: 0 },
    lifespan: 800,
    gravityY: 0,
    quantity: 30,
    tint: [0xff0000, 0xffa500, 0xffff00], // red, orange, yellow
    blendMode: "ADD",
    emitting: false,
    emitZone: {
      type: "edge",
      source: new Phaser.Geom.Circle(0, 0, 30),
      quantity: 30,
    },
  })
}

export function checkBulletAndOtherObjectsCollision(scene: MyGame) {
  if (!scene.bullets) return

  const damageAmount = scene.currentGun?.damage || 10

  const checkCollision = (
    bullet: Phaser.Physics.Arcade.Image,
    targetSprite: Phaser.GameObjects.Sprite | Phaser.Physics.Arcade.Sprite,
    takeDamageFn: () => void
  ) => {
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        bullet.getBounds(),
        targetSprite.getBounds()
      )
    ) {
      console.log("HITTT")
      const textureKey = bullet.texture?.key

      if (textureKey === "rocket-launcher-bullet") {
        scene.explosionParticleSystem.explode(10, bullet.x, bullet.y)
      }

      bullet.destroy()
      takeDamageFn()
    }
  }

  scene.bullets.getChildren().forEach((b) => {
    const bullet = b as Phaser.Physics.Arcade.Image

    // Enemies
    scene.enemies.forEach((enemy) => {
      checkCollision(bullet, enemy.enemySprite, () =>
        enemy.takeDamage(damageAmount)
      )
    })

    // Mission enemies
    scene.missionEnemies.forEach((enemy) => {
      checkCollision(bullet, enemy.enemySprite, () =>
        enemy.takeDamage(damageAmount)
      )
    })

    // Cops
    scene.cops.forEach((cop) => {
      checkCollision(bullet, cop.sprite, () => cop.takeDamage(damageAmount))
    })

    // NPCs
    scene.npcsGroup.getChildren().forEach((npcGO) => {
      const npcSprite = npcGO as
        | Phaser.Physics.Arcade.Sprite
        | Phaser.GameObjects.Sprite
      const npcInstance = npcSprite.getData("ref") as NPC | undefined

      if (npcInstance && typeof npcInstance.takeDamage === "function") {
        checkCollision(bullet, npcSprite, () =>
          npcInstance.takeDamage(damageAmount)
        )
      } else {
        console.warn("NPC instance not found on sprite data!")
      }
    })
  })
}

export function addEnemyToTheScene(scene: MyGame, x: number, y: number) {
  const enemy1 = new EnemyNew(scene, x, y)

  scene.enemies.push(enemy1)
}

export function showCenteredOverlayText(
  scene: Phaser.Scene,
  message: string,
  textColor: number = 0xffffff,
  tintColor: number = 0x000000,
  tintAlpha: number = 0.6
): Phaser.GameObjects.Container {
  // Create tint background
  const tintBg = scene.add
    .rectangle(
      0,
      0,
      scene.scale.width,
      scene.scale.height,
      tintColor,
      tintAlpha
    )
    .setOrigin(0)
    .setScrollFactor(0)
    .setDepth(10000)

  // Create text in the center
  const overlayText = scene.add
    .text(scene.scale.width / 2, scene.scale.height / 2, message, {
      fontSize: "64px",
      color: `#${textColor.toString(16).padStart(6, "0")}`,
      fontFamily: "Arial",
      fontStyle: "bold",
      align: "center",
      stroke: "#000000",
      strokeThickness: 6,
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(10001)

  // Add both to a container
  const overlayContainer = scene.add.container(0, 0, [tintBg, overlayText])
  overlayContainer.setDepth(10000)

  // Keep it responsive to resizes
  scene.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
    const { width, height } = gameSize
    tintBg.setSize(width, height)
    overlayText.setPosition(width / 2, height / 2)
  })

  return overlayContainer
}

export function showTopLeftOverlayText(
  scene: Phaser.Scene,
  message: string,
  x: number = 10,
  y: number = 10,
  destroyAfter: number = -1,
  textColor: number = 0xffffff,
  bgColor: number = 0x000000,
  bgAlpha: number = 0.6,
  padding: number = 10
): {
  container: Phaser.GameObjects.Container
  updateMessage: (newMsg: string) => void
} {
  // Create text
  const text = scene.add.text(0, 0, message, {
    fontSize: "24px",
    color: `#${textColor.toString(16).padStart(6, "0")}`,
    fontFamily: "Arial",
    fontStyle: "bold",
    align: "left",
    stroke: "#000000",
    strokeThickness: 3,
    wordWrap: { width: scene.scale.width / 2 },
  })
  text.setScrollFactor(0)

  // Compute background size
  const bgWidth = text.width + padding * 2
  const bgHeight = text.height + padding * 2

  // Create background
  const background = scene.add.rectangle(
    0,
    0,
    bgWidth,
    bgHeight,
    bgColor,
    bgAlpha
  )
  background.setOrigin(0)
  background.setScrollFactor(0)

  // Position text inside the background
  text.setPosition(padding, padding)

  // Create container to hold both
  const container = scene.add.container(x, y, [background, text])
  container.setScrollFactor(0)
  container.setDepth(10000)

  // Method to update the message and resize the background
  const updateMessage = (newMsg: string) => {
    text.setText(newMsg)
    background.setSize(text.width + padding * 2, text.height + padding * 2)
  }

  // Destroy after a delay
  if (destroyAfter !== -1) {
    scene.time.delayedCall(destroyAfter, () => {
      container.destroy()
    })
  }

  return { container, updateMessage }
}

export function createGridFromLayer(layer: Phaser.Tilemaps.TilemapLayer) {
  const grid: number[][] = []

  for (let y = 0; y < layer.layer.height; y++) {
    const row: number[] = []
    for (let x = 0; x < layer.layer.width; x++) {
      const tile = layer.getTileAt(x, y)
      if (!tile) {
        // If no tile, treat as walkable (e.g., empty space)
        row.push(0)
      } else {
        // Use tile index or id to mark walkable or not
        // For example: 0 = walkable, any other = blocked
        // Adjust based on your tileset indexes
        // Here we assume tile.index === -1 means no tile => walkable
        if (tile.index === -1) {
          row.push(0) // walkable
        } else {
          row.push(1) // blocked
        }
      }
    }
    grid.push(row)
  }
  return grid
}

export function detectWeaponCheatWeaponChange(scene: MyGame) {
  if (scene.weaponCheatActivation.status) {
    if (Phaser.Input.Keyboard.JustDown(scene.cursors.n)) {
      handleWeaponsCheatSystem(scene)
    }
  }
}
