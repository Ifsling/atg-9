import { MyGame } from "../MyGame"

export class EnemyNew {
  scene: MyGame
  enemySprite!: Phaser.Physics.Arcade.Sprite
  enemyGun!: Phaser.GameObjects.Sprite
  enemyBullets!: Phaser.Physics.Arcade.Group
  health: number = 100
  maxHealth: number = 100
  healthBar!: Phaser.GameObjects.Graphics
  shootTimer!: Phaser.Time.TimerEvent

  constructor(scene: MyGame, x: number = 1100, y: number = 300) {
    this.scene = scene

    // Create enemy sprite with physics
    this.enemySprite = scene.physics.add.sprite(x, y, "player").setScale(0.3)
    this.enemySprite.setCollideWorldBounds(true)
    this.enemySprite.setImmovable(false)

    // Create enemy gun as a separate sprite
    this.enemyGun = scene.add.sprite(x, y, "gun").setScale(0.1)

    // Create bullets group
    this.enemyBullets = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 20,
      runChildUpdate: true,
    })

    // Create health bar
    this.healthBar = this.scene.add.graphics()
    this.drawHealthBar()

    // Setup shooting timer
    this.shootTimer = scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.shootAtPlayer,
      callbackScope: this,
    })

    console.log(this.enemySprite.body?.x, this.enemySprite.body?.y)
  }

  update(scene: MyGame) {
    if (!this.enemySprite || !this.enemySprite.body) return

    const player = scene.PlayerParent

    // Aim gun at player
    const angle = Phaser.Math.Angle.Between(
      this.enemySprite.x,
      this.enemySprite.y,
      player.x,
      player.y
    )

    this.enemyGun.setRotation(angle)

    // Manually position the gun to follow the enemy
    this.enemyGun.setPosition(this.enemySprite.x, this.enemySprite.y)

    // Update health bar position
    this.drawHealthBar()

    // Stop movement unless you add pathfinding
    this.enemySprite.setVelocity(0)
  }

  // Draw or update the health bar above the enemy
  drawHealthBar() {
    const x = this.enemySprite.x
    const y = this.enemySprite.y - 40

    const width = 50
    const height = 6

    const ratio = Phaser.Math.Clamp(this.health / this.maxHealth, 0, 1)

    this.healthBar.clear()

    // Background (black)
    this.healthBar.fillStyle(0x000000)
    this.healthBar.fillRect(x - width / 2, y, width, height)

    // Foreground (red)
    this.healthBar.fillStyle(0xff0000)
    this.healthBar.fillRect(x - width / 2, y, width * ratio, height)
  }

  shootAtPlayer = () => {
    if (this.scene.isPlayerAlive === false) return

    const player = this.scene.PlayerParent

    const angle = Phaser.Math.Angle.Between(
      this.enemySprite.x,
      this.enemySprite.y,
      player.x,
      player.y
    )

    const bullet = this.enemyBullets.get(
      this.enemySprite.x,
      this.enemySprite.y,
      "bullet"
    ) as Phaser.Physics.Arcade.Image

    if (!bullet) return

    bullet.setActive(true)
    bullet.setVisible(true)
    bullet.setScale(0.1)
    bullet.body!.reset(this.enemySprite.x, this.enemySprite.y)
    bullet.body!.setSize(bullet.width, bullet.height)
    bullet.body!.setOffset(bullet.width * 0.1, bullet.height * 0.1)

    bullet.setRotation(angle)
    bullet.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400)
    bullet.setCollideWorldBounds(true)

    if (!this.enemyBullets.contains(bullet)) {
      this.enemyBullets.add(bullet)
    }
  }

  takeDamage(amount: number) {
    this.health -= amount
    if (this.health <= 0) {
      this.destroy()
    } else {
      this.drawHealthBar()
    }

    console.log("Enemy took damage:", amount, "Remaining health:", this.health)
  }

  destroy() {
    this.scene.bloodParticleSystem.explode(
      30,
      (this.enemySprite.body?.x || 0) - 35,
      this.enemySprite.body?.y
    )

    this.shootTimer.remove()

    this.enemyBullets.clear(true, true)
    this.enemyGun.destroy()
    this.enemySprite.destroy()
    this.healthBar.destroy()

    // Remove from the enemy list
    const index = this.scene.enemies.indexOf(this)
    if (index !== -1) {
      this.scene.enemies.splice(index, 1)
    }
  }
}
