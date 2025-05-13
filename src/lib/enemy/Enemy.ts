import { MyGame } from "../MyGame"

// Modified Enemy class with proper collision handling
export class Enemy {
  scene: MyGame
  sprite: Phaser.GameObjects.Container
  body: Phaser.Physics.Arcade.Body
  gun: Phaser.GameObjects.Sprite
  bullets: Phaser.Physics.Arcade.Group
  healthBar: Phaser.GameObjects.Graphics
  maxHealth = 100
  health = 100
  shootTimer: Phaser.Time.TimerEvent
  enemySprite: Phaser.GameObjects.Sprite
  hitArea: Phaser.GameObjects.Rectangle // For better hit detection

  constructor(scene: MyGame, x: number, y: number) {
    this.scene = scene

    // Create the enemy sprite
    this.enemySprite = scene.add.sprite(0, 0, "player").setScale(0.3)

    // Create the gun
    this.gun = scene.add.sprite(20, 0, "gun").setScale(0.08).setOrigin(0.2, 0.7)

    // Create a hit area for better collision detection
    this.hitArea = scene.add.rectangle(0, 0, 60, 60, 0xff0000, 0)

    // Add all components to the container
    this.sprite = scene.add.container(x, y, [
      this.hitArea,
      this.enemySprite,
      this.gun,
    ])

    // Enable physics on the container
    scene.physics.add.existing(this.sprite)

    this.body = this.sprite.body as Phaser.Physics.Arcade.Body
    this.body.setSize(60, 60) // Set proper collision size based on sprite
    this.body.setOffset(-30, -30) // Center the hitbox
    this.body.setCollideWorldBounds(true)
    this.body.setImmovable(true) // Makes the enemy not move when hit by bullets

    // Bullets
    this.bullets = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 20,
    })

    // Health bar
    this.healthBar = scene.add.graphics()
    this.updateHealthBar()

    // Shooting
    this.shootTimer = scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.shootAtPlayer,
      callbackScope: this,
    })

    // Debug visualization
    if (scene.game.config.physics.arcade?.debug) {
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

    console.log("Enemy created with body:", this.body)
  }

  update() {
    const { x, y } = this.sprite
    const player = this.scene.PlayerParent

    // Aim gun at player
    const angle = Phaser.Math.Angle.Between(x, y, player.x, player.y)
    this.gun.setRotation(angle)

    // Update health bar position
    this.updateHealthBar()
  }

  updateHealthBar() {
    const { x, y } = this.sprite
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

  shootAtPlayer() {
    const { x, y } = this.sprite
    const player = this.scene.PlayerParent
    const angle = Phaser.Math.Angle.Between(x, y, player.x, player.y)

    const bullet = this.bullets.get(
      x,
      y,
      "bullet"
    ) as Phaser.Physics.Arcade.Image
    if (!bullet) return

    bullet.setActive(true)
    bullet.setVisible(true)
    bullet.setScale(0.08)
    bullet!.body!.reset(x, y)
    bullet.setRotation(angle)
    bullet.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400)

    bullet.setCollideWorldBounds(true, undefined, undefined, true)
  }

  takeDamage(amount: number) {
    this.health -= amount
    this.updateHealthBar()
    console.log(`Enemy took ${amount} damage. Health: ${this.health}`)
    if (this.health <= 0) {
      this.destroy()
    }
  }

  destroy() {
    this.healthBar.destroy()
    this.sprite.destroy()
    this.bullets.clear(true, true)
    this.shootTimer.remove()
  }
}
