import EasyStar from "easystarjs"
import { handleShooting } from "./bullet/Bullet"
import { Car } from "./car/Car"
import { handleCheatCodeSystem } from "./cheat-system/CheatSystem"
import { CustomKeys, GunData, MISSIONS } from "./ConstantsAndTypes"
import { SetupEasyStar } from "./easystar/Easystar"
import { EnemyNew } from "./enemy/EnemyNew"
import { handleGunRotation, handleGunThrow } from "./gun/Gun"
import {
  addingGunstoMap,
  checkBulletAndOtherObjectsCollision,
  createPlayerBullets,
  detectWeaponCheatWeaponChange,
  handleCollisions,
  handleUi,
  setupControls,
  setupParticleSystem,
  showTopLeftOverlayText,
} from "./HelperFunctions"
import { createMap } from "./map/Map"
import { MissionMarker } from "./mission/MissionMarker"
import { NPC } from "./npc/Npc"
import { cameraFollowPlayer } from "./player/Camera"
import {
  handlePlayerMovement,
  PlayerCharacter,
  setupPlayerParent,
} from "./player/Player"

export class MyGame extends Phaser.Scene {
  easystar!: EasyStar.js
  mapGrid!: number[][]
  map!: Phaser.Tilemaps.Tilemap

  bulletText!: Phaser.GameObjects.Text
  currentGun?: GunData
  player!: PlayerCharacter
  cursors!: CustomKeys
  gun!: Phaser.GameObjects.Sprite
  bullets!: Phaser.Physics.Arcade.Group
  PlayerParent!: Phaser.GameObjects.Container
  playerParentBody!: Phaser.Physics.Arcade.Body
  gunsGroup!: Phaser.Physics.Arcade.Group
  playerHealthBackground!: Phaser.GameObjects.Graphics
  playerHealthBar!: Phaser.GameObjects.Graphics
  isPlayerAlive: boolean = true
  carsGroup!: Phaser.Physics.Arcade.Group
  isPlayerIncar: boolean = false
  carBeingDrivenByPlayer: Car | null = null

  enemies: EnemyNew[] = []
  enemy1!: EnemyNew
  enemyParent!: Phaser.GameObjects.Container
  enemySprite!: Phaser.GameObjects.Sprite
  enemyParentBody!: Phaser.Physics.Arcade.Body
  enemyBullets!: Phaser.Physics.Arcade.Group
  enemyShootTimer!: Phaser.Time.TimerEvent
  enemyGun!: Phaser.GameObjects.Sprite

  bloodParticleSystem!: Phaser.GameObjects.Particles.ParticleEmitter
  missionMarkerPickedParticleSystem!: Phaser.GameObjects.Particles.ParticleEmitter
  explosionParticleSystem!: Phaser.GameObjects.Particles.ParticleEmitter

  missionStarted: boolean = false
  missionEnemies: EnemyNew[] = []

  npcsGroup!: Phaser.Physics.Arcade.Group

  weaponCheatActivation: {
    status: boolean
    index: number
    sprite: Phaser.GameObjects.Sprite | null
  } = {
    status: false,
    index: 0,
    sprite: null,
  }

  // global variables
  canPickupGun: boolean = true
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
    this.load.image("pistol", "/images/pistol.png")
    this.load.image("player-with-gun", "/images/player-with-gun.png")
    this.load.image("bullet", "/images/bullet.png")
    this.load.image("blood-drop", "/images/blood-drop.png")
    this.load.image("diamond-shape", "/images/diamond-shape.png")
    this.load.image("topdown-car", "/images/topdown-car.png")
    this.load.image("white-circle", "/images/white-circle.png")
    this.load.image("npc", "/images/npc.png")
    this.load.audio("bgMusic", "/audio/bg-music.mp3")
    this.load.image("shotgun", "/images/shotgun.png")
    this.load.image("sniper", "/images/sniper.png")
    this.load.image("smg", "/images/smg.png")
    this.load.image("rocket-launcher", "/images/rocket-launcher.png")
    this.load.image(
      "rocket-launcher-bullet",
      "/images/rocket-launcher-bullet.png"
    )
  }

  create() {
    this.carsGroup = this.physics.add.group()
    this.npcsGroup = this.physics.add.group()

    const music = this.sound.add("bgMusic", {
      loop: true,
      volume: 0.2,
    })

    // music.play()

    const { map, houses } = createMap(this)
    this.map = map

    this.cursors = setupControls(this)
    this.gunsGroup = this.physics.add.group()

    this.mapGrid = SetupEasyStar(this, houses!)

    addingGunstoMap(this)

    this.PlayerParent = setupPlayerParent(this, 1100, 300)

    // Bullet pool
    createPlayerBullets(this)

    // Camera follows the container
    cameraFollowPlayer(this, map)

    // UI
    handleUi(this)

    // Particle Systems
    setupParticleSystem(this)

    new MissionMarker(this, 1100, 400, () => {
      showTopLeftOverlayText(this, "Mission Started", 20, 70, 3000)

      this.missionStarted = true

      const missionKeys = Object.keys(MISSIONS) as Array<keyof typeof MISSIONS>
      const randomIndex = Math.floor(Math.random() * missionKeys.length)
      const randomMissionKey: keyof typeof MISSIONS = missionKeys[randomIndex]
      const randomMission = MISSIONS[randomMissionKey]

      randomMission(this)
    })

    // const car = new Car(this, 1100, 500, "topdown-car", this.cursors)
    // this.carsGroup.add(car)

    for (let i = 0; i < 2; i++) {
      new NPC(this, "npc") // you can pass different sprite keys like "npc2", "npcGuard", etc.
    }
    ;``
    // Colliders
    handleCollisions(this, houses, this.cursors)
    this.drawPlayerHealthBar((this.PlayerParent as any).health)
  }

  // Modified MyGame update function with debug visualization
  update() {
    handleCheatCodeSystem(this, this.cursors)

    this.bulletText.setText(`Bullets: ${this.currentGun?.ammo || 0}`)
    handlePlayerMovement(this.PlayerParent, this.cursors)
    handleGunRotation(this)
    handleShooting(this)
    handleGunThrow(this, this.cursors)

    // Update enemies
    this.enemies.forEach((enemy) => enemy.update(this))

    // Car movement
    if (this.carsGroup)
      this.carsGroup.getChildren().forEach((car: any) => car.update())

    checkBulletAndOtherObjectsCollision(this)
    detectWeaponCheatWeaponChange(this)
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
