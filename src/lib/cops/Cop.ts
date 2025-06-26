import * as Phaser from "phaser"
import { displayWantedLevelStars } from "../HelperFunctions"
import { MyGame } from "../MyGame"
import { damagePlayer } from "../player/Player"
import { getRandomSpawnLocationWithinRadius } from "../utils"

export class Cop {
  scene: MyGame
  sprite: Phaser.Physics.Arcade.Sprite
  speed: number = 200
  shootRange: number = 800
  shootCooldown: number = 1000
  lastShotTime: number = 0
  bulletSpeed: number = 300
  enemyBullets!: Phaser.Physics.Arcade.Group
  health: number = 100

  constructor(scene: MyGame, spawn: { x: number; y: number }) {
    this.scene = scene

    this.sprite = scene.physics.add
      .sprite(spawn.x, spawn.y, "cop")
      .setScale(0.4)
      .setDepth(1)
    this.sprite.setCollideWorldBounds(true)
    this.sprite.setData("ref", this)

    // Create bullets group
    this.enemyBullets = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 200,
      runChildUpdate: true,
    })

    scene.time.addEvent({
      delay: 100,
      loop: true,
      callback: this.updateBehavior,
      callbackScope: this,
    })
  }

  updateBehavior() {
    if (!this.sprite.active || this.scene.isPlayerAlive === false) return

    const player = this.scene.isPlayerIncar
      ? this.scene.carBeingDrivenByPlayer
      : this.scene.PlayerParent

    const playerX = player?.x
    const playerY = player?.y

    const dist = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      playerX!,
      playerY!
    )
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      playerX!,
      playerY!
    )

    if (dist > this.shootRange) {
      this.sprite?.setVelocity(
        Math.cos(angle) * this.speed,
        Math.sin(angle) * this.speed
      )
    } else {
      this.sprite?.setVelocity(0)
      this.shootAtPlayer(angle, player!)
    }
  }

  shootAtPlayer(angle: number, player?: Phaser.GameObjects.GameObject) {
    const now = this.scene.time.now
    if (now - this.lastShotTime < this.shootCooldown) return

    this.lastShotTime = now
    const bullet = this.enemyBullets.get(
      this.sprite.x,
      this.sprite.y,
      "bullet"
    ) as Phaser.Physics.Arcade.Image

    if (!this.enemyBullets.contains(bullet)) {
      this.enemyBullets.add(bullet)
    }
    bullet.setActive(true)
    bullet.setVisible(true)
    bullet.setScale(0.1)
    bullet.body!.reset(this.sprite.x, this.sprite.y)
    bullet.body!.setSize(bullet.width, bullet.height)
    bullet.body!.setOffset(bullet.width * 0.1, bullet.height * 0.1)

    bullet.setRotation(angle)
    bullet?.setVelocity(
      Math.cos(angle) * this.bulletSpeed,
      Math.sin(angle) * this.bulletSpeed
    )
    bullet.setCollideWorldBounds(true)

    this.scene.time.delayedCall(30000, () => bullet.destroy())
  }

  takeDamage(amount: number) {
    this.health -= amount

    if (this.health <= 0) {
      // Use body position if available
      const body = this.sprite.body as Phaser.Physics.Arcade.Body
      const bloodX = body ? body.x - 10 : this.sprite.x
      const bloodY = body ? body.y - 10 : this.sprite.y

      this.scene.bloodParticleSystem.explode(40, bloodX, bloodY)

      const deathAudio = new Audio("/audio/explosion.wav")
      deathAudio.play()

      this.sprite.destroy()

      // Remove from scene.cops array
      const index = this.scene.cops.indexOf(this)
      if (index !== -1) {
        this.scene.cops.splice(index, 1)
      }

      this.scene.wantedLevel = Math.min(this.scene.wantedLevel + 2, 5)
      displayWantedLevelStars(this.scene)
      createCop(this.scene)
    }
  }
}

export function createCop(scene: MyGame) {
  const existingCops = scene.cops
  const existingCopsLength = existingCops.length

  let noOfCops = 0
  switch (scene.wantedLevel) {
    case 0:
      noOfCops = 0
      break
    case 1:
      noOfCops = 2
      break
    case 2:
      noOfCops = 4
      break
    case 3:
      noOfCops = 6
      break
    case 4:
      noOfCops = 8
      break
    case 5:
      noOfCops = 10
      break
  }

  noOfCops -= existingCopsLength

  while (noOfCops > 0) {
    const { x, y } = getRandomSpawnLocationWithinRadius(
      scene.playerParentBody.x,
      scene.playerParentBody.y,
      1000
    )

    scene.cops.forEach((element) => {
      if (element.sprite.x === x && element.sprite.y === y) {
        noOfCops--
      }
    })

    const cop = new Cop(scene, { x, y })
    scene.cops.push(cop)
    noOfCops--
  }

  for (let i = 0; i < noOfCops; i++) {
    const x = Phaser.Math.Between(100, 900)
    const y = Phaser.Math.Between(100, 900)
    const cop = new Cop(scene, { x, y })
    scene.cops.push(cop)
  }

  // Add collisions for each enemy
  scene.cops.forEach((cop) => {
    // Player collision
    scene.physics.add.overlap(
      cop.enemyBullets,
      scene.PlayerParent,
      (player, bullet) => {
        const enemyBullet = bullet as Phaser.Physics.Arcade.Image
        enemyBullet.destroy()
        damagePlayer(scene, 10)
      },
      undefined,
      scene
    )

    // 🚗 Add collision between enemy bullets and cars
    scene.carsGroup.getChildren().forEach((car: any) => {
      scene.physics.add.overlap(
        cop.enemyBullets,
        car,
        (carGameObject, bullet) => {
          const enemyBullet = bullet as Phaser.Physics.Arcade.Image
          enemyBullet.destroy()

          if (typeof car.takeDamage === "function") {
            car.takeDamage(10)
          } else {
            console.warn("Car object missing takeDamage method")
          }
        },
        undefined,
        scene
      )
    })
  })
}
