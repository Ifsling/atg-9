import { MyGame } from "../MyGame"

export class Enemy {
  scene: MyGame
  container: Phaser.GameObjects.Container // Main container for the enemy
  body: Phaser.Physics.Arcade.Body // Physics body of the container
  sprite: Phaser.GameObjects.Sprite // Enemy sprite inside the container
  gun: Phaser.GameObjects.Sprite // Gun sprite inside the container
  bullets: Phaser.Physics.Arcade.Group
  healthBar: Phaser.GameObjects.Graphics
  maxHealth = 100
  health = 100
  shootTimer: Phaser.Time.TimerEvent

  constructor(scene: MyGame, x: number, y: number) {
    this.scene = scene

    // Create the container first
    this.container = scene.add.container(x, y)

    // Add physics to the container
    scene.physics.add.existing(this.container)
    this.body = this.container.body as Phaser.Physics.Arcade.Body

    // Create enemy sprite and add to container
    this.sprite = scene.add.sprite(0, 0, "player").setScale(0.3)
    this.container.add(this.sprite)

    // Create gun and add to container
    this.gun = scene.add.sprite(20, 0, "gun").setScale(0.08).setOrigin(0.2, 0.7)
    this.container.add(this.gun)

    // Configure the physics body based on sprite size
    // Get the actual display size of the sprite
    const spriteWidth = this.sprite.displayWidth
    const spriteHeight = this.sprite.displayHeight

    // Set the hitbox size to match the sprite
    this.body.setSize(spriteWidth, spriteHeight)

    // Center the hitbox on the container
    this.body.setOffset(-spriteWidth / 2, -spriteHeight / 2)

    // Configure physics properties
    this.body.setCollideWorldBounds(true)
    this.body.setImmovable(true) // Make the enemy not move when hit by bullets

    // Create bullets group
    this.bullets = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 20,
    })

    // Create health bar
    this.healthBar = scene.add.graphics()
    this.updateHealthBar()

    // Setup shooting timer
    this.shootTimer = scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.shootAtPlayer,
      callbackScope: this,
    })

    // Add debug visualization if debug is enabled
    if (scene.game.config.physics?.arcade?.debug) {
      const debugGraphics = this.scene.add
        .graphics()
        .setAlpha(0.5)
        .lineStyle(2, 0xff0000)

      this.scene.events.on("update", () => {
        debugGraphics.clear()
        debugGraphics.strokeRect(
          this.body.x,
          this.body.y,
          this.body.width,
          this.body.height
        )
      })
    }
  }

  update() {
    // Aim gun at player
    const player = this.scene.PlayerParent
    const angle = Phaser.Math.Angle.Between(
      this.container.x,
      this.container.y,
      player.x,
      player.y
    )
    this.gun.setRotation(angle)

    // Update health bar position
    this.updateHealthBar()
  }

  updateHealthBar() {
    const { x, y } = this.container
    this.healthBar.clear()
    this.healthBar.fillStyle(0x000000)
    this.healthBar.fillRect(x - 25, y - 40, 50, 6)
    this.healthBar.fillStyle(0xff0000)
    this.healthBar.fillRect(
      x - 25,
      y - 40,
      50 * (this.health / this.maxHealth),
      6
    )
  }

  shootAtPlayer = () => {
    const player = this.scene.PlayerParent
    const angle = Phaser.Math.Angle.Between(
      this.container.x,
      this.container.y,
      player.x,
      player.y
    )

    const bullet = this.bullets.get(
      this.container.x,
      this.container.y,
      "bullet"
    ) as Phaser.Physics.Arcade.Image

    if (!bullet) return

    bullet.setActive(true)
    bullet.setVisible(true)
    bullet.setScale(0.08)
    bullet!.body!.reset(this.container.x, this.container.y)
    bullet.setRotation(angle)
    bullet.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400)
    bullet.setCollideWorldBounds(true, undefined, undefined, true)
  }

  takeDamage(amount: number) {
    this.health -= amount
    this.updateHealthBar()

    // Flash the sprite red to indicate damage
    this.scene.tweens.add({
      targets: this.sprite,
      tint: 0xff0000,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        this.sprite.clearTint()
      },
    })

    if (this.health <= 0) {
      this.destroy()
    }
  }

  destroy() {
    this.healthBar.destroy()
    this.bullets.clear(true, true)
    this.shootTimer.remove()
    this.container.destroy()
  }
}
