import { MyGame } from "../MyGame"

export class Car extends Phaser.Physics.Arcade.Sprite {
  scene: MyGame
  speed: number
  maxSpeed: number
  turnSpeed: number
  health: number
  maxHealth: number
  isPlayerInside: boolean = false
  enterRadius: number = 80

  // Health bar graphics
  carHealthBackground!: Phaser.GameObjects.Graphics
  carHealthBar!: Phaser.GameObjects.Graphics

  lastToggleTime: number = 0
  toggleCooldown: number = 300 // ms debounce between enter/exit

  constructor(
    scene: MyGame,
    x: number,
    y: number,
    texture: string,
    topSpeed: number = 400
  ) {
    super(scene, x, y, texture)
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)

    const width = this.width * this.scaleX
    const height = this.height * this.scaleY
    const squareSize = Math.min(width, height)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(squareSize, squareSize)
    body.setOffset((width - squareSize) / 2, (height - squareSize) / 2)

    this.setScale(0.5)
    this.setDrag(100)
    this.setAngularDrag(100)
    this.setMaxVelocity(200)

    this.speed = 0
    this.maxSpeed = topSpeed
    this.turnSpeed = 2.5
    this.health = 100
    this.maxHealth = 100

    // Setup health bar UI but hide initially
    this.carHealthBackground = this.scene.add.graphics()
    this.carHealthBar = this.scene.add.graphics()
    this.hideHealthBar()

    scene.carsGroup.add(this)

    scene.enemies.forEach((enemy) => {
      // 🚗 Add collision between enemy bullets and cars
      scene.physics.add.overlap(
        enemy.enemyBullets,
        this,
        (car, enemyBullet) => {
          enemyBullet.destroy()
          this.takeDamage(10)
        },
        undefined,
        scene
      )
    })

    this.setCollideWorldBounds(true)
  }

  update() {
    const now = this.scene.time.now

    // If player is inside car
    if (this.scene.isPlayerIncar) {
      // Only process controls if THIS is the car being driven
      if (this.scene.carBeingDrivenByPlayer === this) {
        this.handleDrivingControls()

        if (
          Phaser.Input.Keyboard.JustDown(this.scene.cursors.f) &&
          now - this.lastToggleTime > this.toggleCooldown
        ) {
          this.exit()
          this.lastToggleTime = now
        }
      }
    } else {
      // Player is NOT in any car. Allow entering if overlapping.
      if (
        now - this.lastToggleTime > this.toggleCooldown &&
        this.scene.physics.overlap(this, this.scene.PlayerParent)
      ) {
        if (Phaser.Input.Keyboard.JustDown(this.scene.cursors.f)) {
          this.enter()
          this.lastToggleTime = now
        }
      }
    }

    this.updateHealthBar()
  }

  handleDrivingControls() {
    const cursors = this.scene.cursors

    // Accelerate
    if (cursors.up.isDown || cursors.leftArrow.isDown) {
      this.scene.physics.velocityFromRotation(
        this.rotation,
        this.maxSpeed,
        this!.body!.velocity
      )
    }
    // Decelerate / reverse
    else if (cursors.down.isDown || cursors.downArrow.isDown) {
      this.scene.physics.velocityFromRotation(
        this.rotation,
        -this.maxSpeed / 2,
        this!.body!.velocity
      )
    } else {
      this?.setVelocity(0)
    }

    // Turn left/right
    if (cursors.left.isDown) {
      this.setAngularVelocity(-150)
    } else if (cursors.right.isDown) {
      this.setAngularVelocity(150)
    } else {
      this.setAngularVelocity(0)
    }

    this.scene.playerParentBody.x = this.x
    this.scene.playerParentBody.y = this.y
  }

  enter() {
    this.scene.isPlayerIncar = true
    this.scene.carBeingDrivenByPlayer = this
    this.isPlayerInside = true

    // Hide player sprite/container and disable its physics
    this.scene.PlayerParent.setVisible(false)
    this.scene.PlayerParent.iterate((child: any) => child.setVisible(false)) // Hide all children if needed
    this.scene.physics.world.disable(this.scene.PlayerParent)

    // Camera follows car now
    this.scene.cameras.main.startFollow(this, true, 0.08, 0.08)

    // Show car health UI
    this.showHealthBar()
  }

  exit() {
    this?.setVelocity(0)
    this.scene.isPlayerIncar = false
    this.scene.carBeingDrivenByPlayer = null
    this.isPlayerInside = false

    // Show player container and all its children
    this.scene.PlayerParent.setPosition(
      (this.body ? this.body.x : this.x) + 50,
      (this.body ? this.body.y : this.y) + 50
    )

    this.scene.PlayerParent.setVisible(true)
    this.scene.PlayerParent.iterate((child: any) => child.setVisible(true))

    // Enable player physics
    this.scene.physics.world.enable(this.scene.PlayerParent)

    // Place player next to car

    // Camera follows player again
    this.scene.cameras.main.startFollow(
      this.scene.PlayerParent,
      true,
      0.08,
      0.08
    )

    // Hide car health UI
    this.hideHealthBar()
  }

  takeDamage(amount: number) {
    this.health -= amount
    if (this.health < 0) this.health = 0

    if (this.isPlayerInside) {
      this.updateHealthBar()
    }

    if (this.health <= 0) {
      this.explode()
    }
  }

  explode() {
    this.setVisible(false)
    this.setActive(false)
    this?.setVelocity(0)

    this.hideHealthBar()

    if (this.isPlayerInside) {
      this.exit()
    }

    // Optional: add explosion particle effects here
    this.scene.explosionParticleSystem.explode(
      30,
      (this.body?.x || 0) + 100,
      (this.body?.y || 0) + 50
    )

    // Play explosion sound
    const explosionAudio = new Audio("/audio/big-explosion.flac")
    explosionAudio.volume = 0.5
    explosionAudio.play()

    // Remove car from the scene
    this.destroy()
  }

  showHealthBar() {
    this.updateHealthBar()
  }

  updateHealthBar() {
    const barWidth = 50
    const barHeight = 8

    const x = this.x - barWidth / 2
    const y = this.y - (this.height * this.scaleY) / 2 - 15 // Above the car sprite

    const percent = Phaser.Math.Clamp(this.health / this.maxHealth, 0, 1)

    this.carHealthBackground.clear()
    this.carHealthBackground.fillStyle(0x000000, 0.6)
    this.carHealthBackground.fillRect(x - 1, y - 1, barWidth + 2, barHeight + 2)

    this.carHealthBar.clear()
    this.carHealthBar.fillStyle(0xff0000)
    this.carHealthBar.fillRect(x, y, barWidth * percent, barHeight)
  }

  hideHealthBar() {
    this.carHealthBackground.clear()
    this.carHealthBar.clear()
  }
}
