import { handleShooting } from "./bullet/Bullet"
import { Enemy } from "./enemy/Enemy"
import { handleGunRotation, handleGunThrow } from "./gun/Gun"
import {
  addingGunstoMap,
  createPlayerBullets,
  handleCollisions,
  handleUi,
  setupControls,
} from "./HelperFunctions"
import { createMap } from "./map/Map"
import { cameraFollowPlayer } from "./player/Camera"
import {
  createPlayer,
  handlePlayerMovement,
  PlayerCharacter,
  setupPlayerParent,
} from "./player/Player"

export interface GunData {
  sprite: Phaser.GameObjects.Sprite
  ammo: number
  fireRate: number
  maxAmmo: number
  gunType: string
}

export interface CustomKeys {
  up: Phaser.Input.Keyboard.Key
  down: Phaser.Input.Keyboard.Key
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
  upArrow: Phaser.Input.Keyboard.Key
  downArrow: Phaser.Input.Keyboard.Key
  leftArrow: Phaser.Input.Keyboard.Key
  rightArrow: Phaser.Input.Keyboard.Key
  t: Phaser.Input.Keyboard.Key
}

export class MyGame extends Phaser.Scene {
  bulletText!: Phaser.GameObjects.Text
  currentGun?: GunData
  player!: PlayerCharacter
  cursors!: CustomKeys
  gun!: Phaser.GameObjects.Sprite
  bullets!: Phaser.Physics.Arcade.Group
  PlayerParent!: Phaser.GameObjects.Container
  playerParentBody!: Phaser.Physics.Arcade.Body
  gunsGroup!: Phaser.Physics.Arcade.Group
  enemies!: Enemy[]
  playerHealthBackground!: Phaser.GameObjects.Graphics
  playerHealthBar!: Phaser.GameObjects.Graphics
  enemy1!: Enemy

  // global variables
  canPickupGun: boolean = true
  shootCooldown: number = 300
  maxBullets: number = 10

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
    const { map, houses, roads, backgroundLayer } = createMap(this)
    this.player = createPlayer(this, 0, 0)
    this.cursors = setupControls(this)
    this.gunsGroup = this.physics.add.group()

    addingGunstoMap(this)

    this.PlayerParent = setupPlayerParent(this)

    // Enemy
    this.enemies = []
    this.enemy1 = new Enemy(this, 1100, 100)
    this.enemies.push(this.enemy1)

    // Bullet pool
    createPlayerBullets(this)

    // Colliders
    handleCollisions(this, houses)

    // Camera follows the container
    cameraFollowPlayer(this, map)

    // UI
    handleUi(this)
  }

  update() {
    this.bulletText.setText(`Bullets: ${this.currentGun?.ammo || 0}`)
    handlePlayerMovement(this.PlayerParent, this.cursors)
    handleGunRotation(this)
    handleShooting(this)
    handleGunThrow(this, this.cursors)
    this.enemies.forEach((enemy) => enemy.update())
  }

  drawPlayerHealthBar(health: number) {
    const maxHealth = 100
    const currentHealth = Phaser.Math.Clamp(health, 0, maxHealth)
    const percent = currentHealth / maxHealth

    const barWidth = 200
    const barHeight = 20
    const x = this.scale.width - barWidth - 10
    const y = 10

    this.playerHealthBar.clear()
    this.playerHealthBar.fillStyle(0xff0000)
    this.playerHealthBar.fillRect(x, y, barWidth * percent, barHeight)
  }
}
