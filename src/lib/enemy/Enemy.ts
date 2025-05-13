import { MyGame } from "../MyGame"

export class Enemy {
  scene: MyGame // Make sure the scene is typed as MyGame
  sprite: Phaser.GameObjects.Container
  body: Phaser.Physics.Arcade.Body
  gun: Phaser.GameObjects.Sprite
  bullets: Phaser.Physics.Arcade.Group
  healthBar: Phaser.GameObjects.Graphics
  maxHealth = 100
  health = 100
  shootTimer: Phaser.Time.TimerEvent
  enemySprite: Phaser.GameObjects.Sprite // add this

  constructor(scene: MyGame, x: number, y: number) {
    this.scene = scene

    this.enemySprite = scene.add.sprite(0, 0, "player").setScale(0.3)
    this.gun = scene.add.sprite(20, 0, "gun").setScale(0.08).setOrigin(0.2, 0.7)

    this.sprite = scene.add.container(x, y, [this.enemySprite, this.gun])
    scene.physics.add.existing(this.sprite)

    this.body = this.sprite.body as Phaser.Physics.Arcade.Body
    this.body.setCollideWorldBounds(true)

    scene.physics.add.existing(this.enemySprite)

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
    this.body.setOffset(0, 0)

    if (!scene.physics.world.listeners("worldbounds").length) {
      scene.physics.world.on(
        "worldbounds",
        (body: Phaser.Physics.Arcade.Body) => {
          const bullet = body.gameObject as Phaser.Physics.Arcade.Image
          if (bullet && bullet.texture?.key === "bullet") {
            bullet.setActive(false)
            bullet.setVisible(false)
            bullet.destroy()
          }
        }
      )
    }

    console.log("Enemy body enabled:", this.body?.enable)

    const debugGraphics = this.scene.add
      .graphics()
      .setAlpha(0.5)
      .lineStyle(2, 0xff0000)
    debugGraphics.strokeRect(
      this.body.x - this.body.width / 2,
      this.body.y - this.body.height / 2,
      this.body.width,
      this.body.height
    )
  }

  update() {
    const { x, y } = this.sprite
    const player = (this.scene as MyGame).PlayerParent

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
    const player = (this.scene as MyGame).PlayerParent // Cast the scene to MyGame
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
    bullet.body!.reset(x, y)
    bullet.setRotation(angle)
    bullet.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400)

    bullet.setCollideWorldBounds(true, undefined, undefined, true)

    // Listen for worldbounds event instead of assigning to onWorldBounds
    // this.scene.physics.world.on(
    //   "worldbounds",
    //   (body: Phaser.Physics.Arcade.Body) => {
    //     if (body.gameObject === bullet) {
    //       bullet.setActive(false)
    //       bullet.setVisible(false)
    //     }
    //   }
    // )
  }

  takeDamage(amount: number) {
    this.health -= amount
    this.updateHealthBar()
    if (this.health <= 0) {
      this.destroy()
    }
  }

  destroy() {
    this.healthBar.destroy()
    this.sprite.destroy()
    this.gun.destroy()
    this.bullets.clear(true, true)
    this.shootTimer.remove()
  }
}
