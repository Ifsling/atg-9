import { RandomLocationsForNpcs } from "../ConstantsAndTypes"
import { MyGame } from "../MyGame"

export class NPC {
  scene: MyGame
  sprite: Phaser.Physics.Arcade.Sprite
  healthBar: Phaser.GameObjects.Graphics
  health: number = 100
  maxHealth: number = 100
  targetLocation: { x: number; y: number } | null = null
  speed: number = 50
  isMoving: boolean = false

  constructor(scene: MyGame, spriteKey: string = "npc1") {
    this.scene = scene

    const spawnPoint = Phaser.Utils.Array.GetRandom(RandomLocationsForNpcs) as {
      x: number
      y: number
    }

    // Create NPC sprite
    this.sprite = scene.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, spriteKey)
      .setScale(0.4)
      .setDepth(1)

    this.sprite.setCollideWorldBounds(true)
    this.sprite.setData("ref", this) // Store reference to this class instance

    // Add to npc group
    scene.npcsGroup.add(this.sprite)

    this.healthBar = scene.add.graphics()

    this.pickNewTarget()

    // Start movement loop
    scene.time.addEvent({
      delay: 300,
      loop: true,
      callback: this.updateMovement,
      callbackScope: this,
    })

    scene.time.addEvent({
      delay: 1000, // every second
      loop: true,
      callback: () => {
        if (!this.sprite?.active) return
        this.startPathfinding(this.scene)
      },
    })

    this.healthBar.setDepth(10)
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

    // Optional: only show if health is not full
    this.healthBar.setVisible(ratio < 1)
  }

  updateMovement() {
    if (!this.targetLocation || !this.sprite.body) return

    const dist = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      this.targetLocation.x,
      this.targetLocation.y
    )

    if (dist < 8) {
      this.sprite.setVelocity(0)
      this.pickNewTarget()
      return
    }

    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      this.targetLocation.x,
      this.targetLocation.y
    )

    const velocityX = Math.cos(angle) * this.speed
    const velocityY = Math.sin(angle) * this.speed

    this.sprite.setVelocity(velocityX, velocityY)
    this.drawHealthBar()
  }

  pickNewTarget() {
    let newTarget = Phaser.Utils.Array.GetRandom(RandomLocationsForNpcs)

    // Avoid going to the same spot
    while (
      this.targetLocation &&
      newTarget.x === this.targetLocation.x &&
      newTarget.y === this.targetLocation.y
    ) {
      newTarget = Phaser.Utils.Array.GetRandom(RandomLocationsForNpcs)
    }

    this.targetLocation = newTarget
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

  destroy() {
    this.scene.bloodParticleSystem.explode(
      40,
      (this.sprite.x || 0) - 100,
      (this.sprite.y || 0) - 100
    )

    const deathAudio = new Audio("/audio/explosion.wav")
    deathAudio.play()

    this.sprite.destroy()
    this.healthBar.destroy()
  }

  // Inside NPC class
  startPathfinding(scene: MyGame) {
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

    const toX = Math.floor(this.targetLocation!.x / tileSize)
    const toY = Math.floor(this.targetLocation!.y / tileSize)

    scene.easystar.findPath(fromX, fromY, toX, toY, (path) => {
      if (!this.sprite?.active) return
      if (path && path.length > 0) {
        this.followPath(path, tileSize, scene)
      }
    })

    scene.easystar.calculate()
  }

  followPath(
    path: { x: number; y: number }[],
    tileSize: number,
    scene: Phaser.Scene
  ) {
    if (path.length < 2) return

    let step = 1

    const moveToNextTile = () => {
      if (step >= path.length) {
        this.sprite.setVelocity(0)
        return
      }

      const nextTile = path[step]
      const targetX = nextTile.x * tileSize + tileSize / 2
      const targetY = nextTile.y * tileSize + tileSize / 2

      const angle = Phaser.Math.Angle.Between(
        this.sprite.x,
        this.sprite.y,
        targetX,
        targetY
      )

      const speed = 100
      const velocityX = Math.cos(angle) * speed
      const velocityY = Math.sin(angle) * speed

      this.sprite.setVelocity(velocityX, velocityY)

      // Check if close to the target tile, then go to next step
      const checkArrival = scene.time.addEvent({
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
            step++
            moveToNextTile()
          }
        },
      })
    }

    moveToNextTile()
  }
}
