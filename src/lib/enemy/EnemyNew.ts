import { MyGame } from "../MyGame"

export class EnemyNew {
  scene: MyGame
  enemyParent!: Phaser.GameObjects.Container
  enemyGun!: Phaser.GameObjects.Sprite
  enemyBullets!: Phaser.Physics.Arcade.Group
  health: number

  constructor(scene: MyGame, x: number = 1100, y: number = 100) {
    this.scene = scene

    this.health = 100

    // Create the container first
    this.createEnemyParent(scene, x, y)

    this.enemyParent = this.createEnemyParent(scene, x, y)
    this.enemyGun = this.enemyParent.getByName(
      "gun"
    ) as Phaser.GameObjects.Sprite

    // Create bullets group
    this.enemyBullets = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 20,
      runChildUpdate: true,
    })

    // Create health bar
    // this.updateHealthBar()

    // Setup shooting timer
    scene.enemyShootTimer = scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.shootAtPlayer,
      callbackScope: this,
    })
  }

  createEnemyParent(scene: MyGame, x: number, y: number) {
    const enemySprite = scene.add.sprite(0, 0, "player").setScale(0.3)
    const gun = scene.add.sprite(0, 0, "gun").setName("gun").setScale(0.1)

    const parent = scene.add.container(x, y)
    parent.add(enemySprite)
    parent.add(gun)

    // Enable physics on the container
    scene.physics.add.existing(parent)

    // Set body size (if needed)
    const body = parent.body as Phaser.Physics.Arcade.Body
    body.setSize(enemySprite.width * 0.3, enemySprite.height * 0.3)
    body.setOffset(-enemySprite.width * 0.15, -enemySprite.height * 0.15) // center it

    return parent
  }

  createEnemySprite(scene: MyGame) {
    return scene.enemySprite
  }

  update(scene: MyGame) {
    // Aim gun at player
    const player = scene.PlayerParent
    const angle = Phaser.Math.Angle.Between(
      this.enemyParent.x,
      this.enemyParent.y,
      player.x,
      player.y
    )
    this.enemyGun.setRotation(angle)

    // Update health bar position
    // this.updateHealthBar()
  }

  // updateHealthBar() {
  //   const { x, y } = this.container
  //   this.healthBar.clear()
  //   this.healthBar.fillStyle(0x000000)
  //   this.healthBar.fillRect(x - 25, y - 40, 50, 6)
  //   this.healthBar.fillStyle(0xff0000)
  //   this.healthBar.fillRect(
  //     x - 25,
  //     y - 40,
  //     50 * (this.health / this.maxHealth),
  //     6
  //   )
  // }

  shootAtPlayer = () => {
    const player = this.scene.PlayerParent

    const angle = Phaser.Math.Angle.Between(
      this.enemyParent.x,
      this.enemyParent.y,
      player.x,
      player.y
    )

    const bullet = this.enemyBullets.get(
      this.enemyParent.x,
      this.enemyParent.y,
      "bullet"
    ) as Phaser.Physics.Arcade.Image

    if (!bullet) return

    bullet.setActive(true)
    bullet.setVisible(true)
    bullet.setScale(0.1)

    bullet.body!.reset(this.enemyParent.x, this.enemyParent.y)
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
    }

    console.log("Enemy took damage of: ", amount, "\nHealth: ", this.health)
  }

  destroy() {
    // this.healthBar.destroy()
    this.enemyBullets.clear(true, true)
    this.enemyParent.destroy()
  }
}
