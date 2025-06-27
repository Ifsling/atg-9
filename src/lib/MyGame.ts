import EasyStar from "easystarjs"
import { handleShooting } from "./bullet/Bullet"
import { Car } from "./car/Car"
import { handleCheatCodeSystem } from "./cheat-system/CheatSystem"
import { CustomKeys, GunData, STORYLINE_MISSIONS } from "./ConstantsAndTypes"
import { Cop } from "./cops/Cop"
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
} from "./HelperFunctions"
import { createMap } from "./map/Map"
import { ShowMissionDirection } from "./mission/MissionDirectionPointer"
import { EnemyCar } from "./mission/MissionEnemyCar"
import {
  MissionToMissionGuideText,
  StartCurrentMission,
} from "./mission/MissionHelperFunctions"
import { manageNPCsCount } from "./npc/Npc"
import { cameraFollowPlayer } from "./player/Camera"
import {
  drawPlayerHealthBar,
  handlePlayerMovement,
  PlayerCharacter,
  setupPlayerParent,
} from "./player/Player"
import { preloadAssets } from "./PreloadAssets"

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

  // Enemies Related
  enemies: EnemyNew[] = []
  enemy1!: EnemyNew
  enemyParent!: Phaser.GameObjects.Container
  enemySprite!: Phaser.GameObjects.Sprite
  enemyParentBody!: Phaser.Physics.Arcade.Body
  enemyBullets!: Phaser.Physics.Arcade.Group
  enemyShootTimer!: Phaser.Time.TimerEvent
  enemyGun!: Phaser.GameObjects.Sprite

  // Particle Systems
  bloodParticleSystem!: Phaser.GameObjects.Particles.ParticleEmitter
  missionMarkerPickedParticleSystem!: Phaser.GameObjects.Particles.ParticleEmitter
  explosionParticleSystem!: Phaser.GameObjects.Particles.ParticleEmitter

  // Missions Related
  missionMarkerArrow: Phaser.GameObjects.Image | null = null
  missionMarkerDirectionText: Phaser.GameObjects.Text | null = null
  onceTimeUsuableFlag: boolean = false
  missionEnemies: EnemyNew[] = []
  storylineMission: {
    started: boolean
    currentMission: {
      missionFunction: (scene: MyGame) => void
      missionMarkerPosition: { x: number; y: number }
    }
  } = {
    started: false,
    currentMission: STORYLINE_MISSIONS.MISSION_THREE,
  }
  // LoadCurrentStorylineMission()

  missionEnemyCars: EnemyCar[] = []

  // Wanted Level Related
  wantedLevel: number = 0
  wantedStars: Phaser.GameObjects.Image[] = []
  cops: Cop[] = []

  // NPC Related
  npcsGroup!: Phaser.Physics.Arcade.Group
  readonly MAX_NPC_COUNT = 6
  readonly NPC_SPAWN_RADIUS = 1500
  readonly NPC_REMOVAL_DISTANCE = 2000

  // Cheat System related
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
    preloadAssets(this)
  }

  create() {
    this.carsGroup = this.physics.add.group()
    this.npcsGroup = this.physics.add.group()
    this.enemyBullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 0,
      runChildUpdate: true,
    })

    const music = this.sound.add("bgMusic", {
      loop: true,
      volume: 0.2,
    })

    // music.play()

    const { map, houses, roads, backgroundLayer, water } = createMap(this)
    this.map = map

    this.cursors = setupControls(this)
    this.gunsGroup = this.physics.add.group()

    this.mapGrid = SetupEasyStar(this)

    addingGunstoMap(this)

    this.PlayerParent = setupPlayerParent(this, 1900, 3390)

    // Bullet pool
    createPlayerBullets(this)

    // Camera follows the container
    cameraFollowPlayer(this, map)

    // UI
    handleUi(this)

    // Particle Systems
    setupParticleSystem(this)

    const missionKey = Object.keys(STORYLINE_MISSIONS).find(
      (key) =>
        STORYLINE_MISSIONS[key as keyof typeof STORYLINE_MISSIONS] ===
        this.storylineMission.currentMission
    ) as keyof typeof STORYLINE_MISSIONS | undefined

    if (missionKey !== undefined) {
      StartCurrentMission(this, MissionToMissionGuideText(missionKey), 6000)
    } else {
      console.error(
        "Unknown mission value:",
        this.storylineMission.currentMission
      )
    }

    // Colliders
    handleCollisions(this, houses, water)

    drawPlayerHealthBar(this, (this.PlayerParent as any).health)
  }

  // Modified MyGame update function with debug visualization
  update() {
    handleCheatCodeSystem(this, this.cursors)

    manageNPCsCount(this)

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

    this.missionEnemyCars.forEach((car) => {
      car.update()
    })

    ShowMissionDirection(this)
  }
}
