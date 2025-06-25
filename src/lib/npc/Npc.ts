import { SpawnableLocationsInGridCount } from "../ConstantsAndTypes"
import { createCop } from "../cops/Cop"
import { displayWantedLevelStars } from "../HelperFunctions"
import { MyGame } from "../MyGame"
import {
  getRandomSpawnLocationWithinRadius,
  gridToWorldCoordinates,
} from "../utils"

export class NPC {
  scene: MyGame
  sprite: Phaser.Physics.Arcade.Sprite
  healthBar: Phaser.GameObjects.Graphics
  health: number = 100
  maxHealth: number = 100
  targetLocation: { x: number; y: number } | null = null
  speed: number = 100

  path: { x: number; y: number }[] = []
  pathStep: number = 0

  constructor(
    scene: MyGame,
    spritesArray: string[],
    spawnAt?: { x: number; y: number }
  ) {
    this.scene = scene

    let spawnPoint =
      spawnAt ??
      getRandomSpawnLocationWithinRadius(
        scene.playerParentBody.x,
        scene.playerParentBody.y,
        scene.NPC_SPAWN_RADIUS
      )

    // Ensure NPC spawns only on road tiles
    while (!isRoadTile(spawnPoint.x, spawnPoint.y, scene)) {
      spawnPoint = getRandomSpawnLocationWithinRadius(
        scene.playerParentBody.x,
        scene.playerParentBody.y,
        scene.NPC_SPAWN_RADIUS
      )
    }

    const spriteKey = Phaser.Utils.Array.GetRandom(spritesArray)

    this.sprite = scene.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, spriteKey)
      .setScale(0.4)
      .setDepth(1)

    this.sprite.setCollideWorldBounds(true)
    this.sprite.setData("ref", this)

    this.healthBar = scene.add.graphics()
    this.healthBar.setDepth(10)

    scene.npcsGroup.add(this.sprite)

    this.pickNewTarget()

    // Recalculate path every second
    scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (!this.sprite?.active) return
        this.startPathfinding()
      },
    })
  }

  drawHealthBar() {
    const x = this.sprite.x
    const y = this.sprite.y - 30
    const width = 40
    const height = 5
    const ratio = Phaser.Math.Clamp(this.health / this.maxHealth, 0, 1)

    this.healthBar.clear()
    this.healthBar.fillStyle(0x000000)
    this.healthBar.fillRect(x - width / 2, y, width, height)
    this.healthBar.fillStyle(0x00ff00)
    this.healthBar.fillRect(x - width / 2, y, width * ratio, height)

    this.healthBar.setVisible(ratio < 1)
  }

  pickNewTarget() {
    let newTargetGrid = Phaser.Utils.Array.GetRandom(
      SpawnableLocationsInGridCount
    )

    while (
      this.targetLocation &&
      newTargetGrid.x === this.targetLocation.x &&
      newTargetGrid.y === this.targetLocation.y
    ) {
      newTargetGrid = Phaser.Utils.Array.GetRandom(
        SpawnableLocationsInGridCount
      )
    }

    const newTargetWorld = gridToWorldCoordinates(
      newTargetGrid.x,
      newTargetGrid.y
    )

    this.targetLocation = newTargetWorld
  }

  startPathfinding() {
    if (!this.targetLocation || !this.sprite.body) return

    const dist = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      this.targetLocation.x,
      this.targetLocation.y
    )

    if (dist < 8) {
      this.pickNewTarget()
      return
    }

    const tileSize = this.scene.map.tileWidth
    const fromX = Math.floor(this.sprite.x / tileSize)
    const fromY = Math.floor(this.sprite.y / tileSize)
    const toX = Math.floor(this.targetLocation.x / tileSize)
    const toY = Math.floor(this.targetLocation.y / tileSize)

    this.scene.easystar.findPath(fromX, fromY, toX, toY, (path) => {
      if (!this.sprite?.active) return

      if (path && path.length > 1) {
        this.followPath(path, tileSize)
      } else {
        // No valid path found
        this.sprite.setVelocity(0)
        this.pickNewTarget()
      }
    })

    this.scene.easystar.calculate()
  }

  followPath(path: { x: number; y: number }[], tileSize: number) {
    this.path = path
    this.pathStep = 1

    const moveToNextTile = () => {
      if (this.pathStep >= this.path.length) {
        this.sprite.setVelocity(0)
        this.path = []
        this.pickNewTarget()
        return
      }

      const nextTile = this.path[this.pathStep]
      const targetX = nextTile.x * tileSize + tileSize / 2
      const targetY = nextTile.y * tileSize + tileSize / 2

      const angle = Phaser.Math.Angle.Between(
        this.sprite.x,
        this.sprite.y,
        targetX,
        targetY
      )

      const velocityX = Math.cos(angle) * this.speed
      const velocityY = Math.sin(angle) * this.speed

      this.sprite.setVelocity(velocityX, velocityY)

      const checkArrival = this.scene.time.addEvent({
        delay: 100,
        loop: true,
        callback: () => {
          const dist = Phaser.Math.Distance.Between(
            this.sprite.x,
            this.sprite.y,
            targetX,
            targetY
          )

          if (dist < 8) {
            this.sprite.setVelocity(0)
            checkArrival.remove()
            this.pathStep++
            moveToNextTile()
          }
        },
      })
    }

    moveToNextTile()
  }

  takeDamage(amount: number) {
    this.health -= amount

    if (this.health <= 0) {
      this.destroy()
    } else {
      this.healthBar.setVisible(true)
      this.drawHealthBar()
    }
  }

  destroy(isKilledByPlayer: boolean = true) {
    this.scene.bloodParticleSystem.explode(
      40,
      (this.sprite.x || 0) - 100,
      (this.sprite.y || 0) - 100
    )

    if (isKilledByPlayer) {
      const deathAudio = new Audio("/audio/explosion.wav")
      deathAudio.play()

      this.scene.wantedLevel = Math.min(this.scene.wantedLevel + 1, 5)
      displayWantedLevelStars(this.scene)
      createCop(this.scene)
    }

    this.scene.npcsGroup.remove(this.sprite, true, true)
    this.sprite.destroy()
    this.healthBar.destroy()
  }
}

// Helper function to ensure spawn is on road
function isRoadTile(x: number, y: number, scene: MyGame): boolean {
  const tileX = Math.floor(x / scene.map.tileWidth)
  const tileY = Math.floor(y / scene.map.tileHeight)
  const tile = scene.map.getTileAt(tileX, tileY, false, "Road")
  return tile !== null
}

export function spawnNpcNearPlayer(scene: MyGame) {
  const playerX = scene.playerParentBody.x
  const playerY = scene.playerParentBody.y
  const camera = scene.cameras.main

  const tileSize = scene.map.tileWidth
  const margin = 200 // How far outside the screen to allow spawning

  let spawnPoint: { x: number; y: number }
  let attempts = 0
  const maxAttempts = 50

  do {
    spawnPoint = getRandomSpawnLocationWithinRadius(
      playerX,
      playerY,
      scene.NPC_SPAWN_RADIUS
    )

    const isOnRoad = isRoadTile(spawnPoint.x, spawnPoint.y, scene)

    const isOutsideView =
      spawnPoint.x < camera.worldView.x - margin ||
      spawnPoint.x > camera.worldView.x + camera.width + margin ||
      spawnPoint.y < camera.worldView.y - margin ||
      spawnPoint.y > camera.worldView.y + camera.height + margin

    if (isOnRoad && isOutsideView) {
      break
    }

    attempts++
  } while (attempts < maxAttempts)

  new NPC(scene, ["npc-male", "npc-female"], spawnPoint)
}

export function manageNPCsCount(scene: MyGame) {
  // Maintain NPC count near player
  const playerX = scene.playerParentBody.x
  const playerY = scene.playerParentBody.y

  // Remove NPCs too far away
  scene.npcsGroup.getChildren().forEach((npcSprite: any) => {
    const npc = npcSprite.getData("ref") as NPC
    const dist = Phaser.Math.Distance.Between(
      npc.sprite.x,
      npc.sprite.y,
      playerX,
      playerY
    )

    if (dist > scene.NPC_REMOVAL_DISTANCE) {
      npc.destroy(false)
    }
  })

  // Check and maintain NPC count
  const currentNpcCount = scene.npcsGroup.getChildren().length
  const npcsToSpawn = scene.MAX_NPC_COUNT - currentNpcCount

  for (let i = 0; i < npcsToSpawn; i++) {
    spawnNpcNearPlayer(scene)
  }
}
