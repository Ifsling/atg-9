import { STORYLINE_MISSIONS } from "../ConstantsAndTypes"
import { showTopLeftOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"
import {
  SaveCurrentMissionProgressInLocalStorage,
  StartCurrentMission,
} from "./MissionHelperFunctions"

export class EnemyCar {
  scene: MyGame
  sprite: Phaser.Physics.Arcade.Sprite
  health: number = 100
  maxHealth: number = 100
  path: { x: number; y: number }[] = []
  pathStep: number = 0
  speed: number = 300
  tileSize: number
  destroyed: boolean = false
  onDestinationReached: () => void = () => {}

  healthBar: Phaser.GameObjects.Graphics

  constructor(
    scene: MyGame,
    spawnWorldPoint: { x: number; y: number },
    targetWorldPoint: { x: number; y: number },
    onDestinationReached?: () => void
  ) {
    this.scene = scene
    this.tileSize = this.scene.map.tileWidth
    this.onDestinationReached = onDestinationReached || (() => {})

    this.sprite = this.scene.physics.add
      .sprite(spawnWorldPoint.x, spawnWorldPoint.y, "enemy-car")
      .setScale(1)
      .setDepth(2)
      .setOrigin(0.5)

    this.sprite.setCollideWorldBounds(true)
    this.sprite.setData("ref", this)

    this.healthBar = scene.add.graphics()
    this.healthBar.setDepth(10)

    this.scene.missionEnemyCars.push(this)

    this.startPathfinding(spawnWorldPoint, targetWorldPoint)
  }

  startPathfinding(
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) {
    const fromX = Math.floor(from.x / this.tileSize)
    const fromY = Math.floor(from.y / this.tileSize)
    const toX = Math.floor(to.x / this.tileSize)
    const toY = Math.floor(to.y / this.tileSize)

    this.scene.easystar.findPath(fromX, fromY, toX, toY, (path) => {
      if (path && path.length > 1) {
        this.path = path
        this.pathStep = 1
        this.followPath()
      } else {
        console.warn("No valid path found for enemy car.")
      }
    })

    this.scene.easystar.calculate()
  }

  followPath() {
    if (this.pathStep >= this.path.length) {
      this.onDestinationReached()
      return
    }

    const nextTile = this.path[this.pathStep]
    const targetX = nextTile.x * this.tileSize + this.tileSize / 2
    const targetY = nextTile.y * this.tileSize + this.tileSize / 2

    this.scene.tweens.add({
      targets: this.sprite,
      x: targetX,
      y: targetY,
      duration:
        (Phaser.Math.Distance.Between(
          this.sprite.x,
          this.sprite.y,
          targetX,
          targetY
        ) /
          this.speed) *
        1000,
      onUpdate: () => {
        const angle = Phaser.Math.Angle.Between(
          this.sprite.x,
          this.sprite.y,
          targetX,
          targetY
        )
        this.sprite.setRotation(angle)
      },
      onComplete: () => {
        this.pathStep++
        this.followPath()
      },
    })
  }

  onHitByBullet(
    bullet: Phaser.GameObjects.GameObject,
    car: Phaser.GameObjects.GameObject
  ) {
    bullet.destroy()

    this.takeDamage(25)
  }

  takeDamage(amount: number) {
    if (this.destroyed) return

    this.health -= amount
    if (this.health <= 0) {
      this.destroy()
    } else {
      this.drawHealthBar()
    }
  }

  drawHealthBar() {
    const x = this.sprite.x
    const y = this.sprite.y - 30
    const width = 50
    const height = 6
    const ratio = Phaser.Math.Clamp(this.health / this.maxHealth, 0, 1)

    this.healthBar.clear()
    this.healthBar.fillStyle(0x000000)
    this.healthBar.fillRect(x - width / 2, y, width, height)
    this.healthBar.fillStyle(0xff0000)
    this.healthBar.fillRect(x - width / 2, y, width * ratio, height)
  }

  destroy() {
    if (this.destroyed) return
    this.destroyed = true

    const explosionSound = new Audio("/audio/explosion.wav")
    explosionSound.play()

    this.scene.explosionParticleSystem.explode(30, this.sprite.x, this.sprite.y)

    this.sprite.destroy()
    this.healthBar.destroy()

    this.completeMission()

    // Remove from enemy list
    const index = this.scene.missionEnemyCars.indexOf(this)
    if (index !== -1) {
      this.scene.missionEnemyCars.splice(index, 1)
    }
  }

  completeMission() {
    if (this.scene.storylineMission.started) {
      if (
        this.scene.storylineMission.currentMission ===
        STORYLINE_MISSIONS.MISSION_SIX
      ) {
        showTopLeftOverlayText(this.scene, "Mission Completed", 20, 70, 3000)

        this.scene.storylineMission.currentMission =
          STORYLINE_MISSIONS.MISSION_SEVEN

        SaveCurrentMissionProgressInLocalStorage(this.scene)

        StartCurrentMission(
          this.scene,
          "Mission Started. Kill all the remaining enemies",
          5000
        )
      }
    }
  }

  update() {
    this.drawHealthBar()
  }
}
