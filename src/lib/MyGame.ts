import { handleShooting } from "./bullet/Bullet"
import { handleGunPickup } from "./gun/Gun"
import { setupControls } from "./HelperFunctions"
import { createMap } from "./map/Map"
import {
  createPlayer,
  handlePlayerMovement,
  PlayerCharacter,
} from "./player/Player"

export interface CustomKeys {
  up: Phaser.Input.Keyboard.Key
  down: Phaser.Input.Keyboard.Key
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
  upArrow: Phaser.Input.Keyboard.Key
  downArrow: Phaser.Input.Keyboard.Key
  leftArrow: Phaser.Input.Keyboard.Key
  rightArrow: Phaser.Input.Keyboard.Key
}

export class MyGame extends Phaser.Scene {
  player!: PlayerCharacter
  cursors!: any
  gun!: Phaser.Physics.Arcade.Sprite
  bullets!: Phaser.Physics.Arcade.Group
  canShoot: boolean = true
  shootCooldown: number = 300 // Cooldown in milliseconds
  maxBullets: number = 10
  PlayerParent!: Phaser.GameObjects.Container

  constructor() {
    super("MyGame")
  }

  preload() {
    this.load.image("tileset", "/tiled-software-datas/map-tileset/tileset.png")
    this.load.tilemapTiledJSON(
      "map",
      "/tiled-software-datas/tiled-tilemap-json.json"
    )
    this.load.image("player", "/images/player.png")
    this.load.image("gun", "/images/gun.png")
    this.load.image("player-with-gun", "/images/player-with-gun.png")
    this.load.image("bullet", "/images/bullet.png")
  }

  create() {
    const { map, houses } = createMap(this)
    this.player = createPlayer(this, 1100, 100)
    this.cursors = setupControls(this)
    this.gun = this.physics.add
      .staticSprite(1000, 500, "gun")
      .setScale(0.1)
      .setOrigin(0.2, 0.7)

    // this.PlayerParent = this.add.container(1100, 300, [this.player])
    // this.physics.add.existing(this.PlayerParent)

    // const body = this.PlayerParent.body as Phaser.Physics.Arcade.Body
    // body.setCollideWorldBounds(true)
    // body.setSize(this.player.displayWidth, this.player.displayHeight)
    // body.setOffset(
    //   -this.player.displayWidth / 2,
    //   -this.player.displayHeight / 2
    // )

    if (houses) {
      this.physics.add.collider(this.player, houses)
      this.physics.add.collider(this.gun, houses)
    }

    this.physics.add.overlap(
      this.player,
      this.gun,
      () => handleGunPickup(this),
      undefined,
      this
    )

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08)

    this.bullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: this.maxBullets,
      runChildUpdate: true,
    })
  }

  update() {
    handlePlayerMovement(this.player, this.cursors)
    handleShooting(this)

    if (this.player.canShoot) {
      // Update gun position and rotation to follow player and point to cursor
      this.gun.setPosition(this.player.x + 40, this.player.y + 40)

      const angle = Phaser.Math.Angle.Between(
        this.gun.x,
        this.gun.y,
        this.input.activePointer.worldX,
        this.input.activePointer.worldY
      )

      this.gun.setRotation(angle)
    }
  }
}
