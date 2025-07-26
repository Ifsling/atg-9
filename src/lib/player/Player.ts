import * as Phaser from "phaser"
import { CustomKeys } from "../ConstantsAndTypes"
import { MyGame } from "../MyGame"
import { isCheatConsoleOpen } from "../cheat-system/CheatSystem"
import { GameoverOverlay } from "../gameover/Gameover"

export class Player extends Phaser.GameObjects.Sprite {
  canShoot: boolean = false

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)
    this.setScale(0.3)
  }
}

export type PlayerCharacter = Player

export function damagePlayer(scene: MyGame, damageAmount: number) {
  const playerParent = scene.PlayerParent as any

  if (playerParent.health > 0) {
    playerParent.health -= damageAmount
    drawPlayerHealthBar(scene, playerParent.health)

    if (playerParent.health <= 0) {
      damagePlayer(scene, 0)
    }
  } else {
    scene.bloodParticleSystem.explode(
      scene.playerParentBody.x,
      scene.playerParentBody.y,
      30
    )

    scene.isPlayerAlive = false
    scene.player.destroy()
    playerParent.destroy()
    scene.playerParentBody.destroy()

    if (scene.bullets) {
      scene.bullets.clear(true, true)
      scene.bullets.destroy()
      scene.bullets = scene.physics.add.group({
        classType: Phaser.Physics.Arcade.Image,
        maxSize: 0,
        runChildUpdate: true,
      })
    }

    drawPlayerHealthBar(scene, playerParent.health)

    const deathAudio = new Audio("/audio/death.wav")
    deathAudio.play()

    GameoverOverlay(scene)
  }
}

export function setupPlayerParent(scene: MyGame, x: number, y: number) {
  scene.player = createPlayer(scene, 0, 0)
  scene.PlayerParent = scene.add.container(x, y, [scene.player])
  scene.physics.add.existing(scene.PlayerParent)

  scene.playerParentBody = scene.PlayerParent.body as Phaser.Physics.Arcade.Body
  scene.playerParentBody.setCollideWorldBounds(true)
  scene.playerParentBody.setSize(
    scene.player.displayWidth,
    scene.player.displayHeight
  )
  scene.playerParentBody.setOffset(
    -scene.player.displayWidth / 2,
    -scene.player.displayHeight / 2
  )

  // Player state
  const playerParent = scene.PlayerParent as any
  playerParent.health = 100

  // Sprint system initialization
  playerParent.canSprint = true
  playerParent.isSprinting = false
  playerParent.sprintStartTime = 0
  playerParent.sprintCooldownStart = 0

  return scene.PlayerParent
}

export function createPlayer(
  scene: Phaser.Scene,
  xPos = 700,
  yPos = 600
): Player {
  const player = new Player(scene, xPos, yPos, "player")
  return player
}

export function handlePlayerMovement(
  playerParent: Phaser.GameObjects.Container,
  cursors: CustomKeys,
  baseSpeed = 200,
  sprintSpeed = 400
) {
  if (!playerParent || !playerParent.body || !playerParent.active) return
  if (isCheatConsoleOpen()) return

  const body = playerParent.body as Phaser.Physics.Arcade.Body
  body.setVelocity(0)

  const now = performance.now()
  const p: any = playerParent
  let speed = baseSpeed

  // Sprint logic
  const maxSprintDuration = 4000 // 3 seconds
  const cooldownDuration = 4000 // 4 seconds

  if (cursors.shift.isDown && p.canSprint) {
    if (!p.isSprinting) {
      p.isSprinting = true
      p.sprintStartTime = now
    }

    const sprintElapsed = now - p.sprintStartTime
    if (sprintElapsed < maxSprintDuration) {
      speed = sprintSpeed
    } else {
      // Sprint expired
      p.isSprinting = false
      p.canSprint = false
      p.sprintCooldownStart = now
    }
  } else {
    p.isSprinting = false
  }

  // Cooldown handling
  if (!p.canSprint) {
    const cooldownElapsed = now - (p.sprintCooldownStart || 0)
    if (cooldownElapsed >= cooldownDuration) {
      p.canSprint = true
      p.sprintStartTime = 0
    }
  }

  // Movement
  if (cursors.left.isDown || cursors.leftArrow.isDown) {
    body.setVelocityX(-speed)
  } else if (cursors.right.isDown || cursors.rightArrow.isDown) {
    body.setVelocityX(speed)
  }

  if (cursors.up.isDown || cursors.upArrow.isDown) {
    body.setVelocityY(-speed)
  } else if (cursors.down.isDown || cursors.downArrow.isDown) {
    body.setVelocityY(speed)
  }
}

export function drawPlayerHealthBar(scene: MyGame, health: number) {
  const maxHealth = 100
  const currentHealth = Phaser.Math.Clamp(health, 0, maxHealth)
  const percent = currentHealth / maxHealth

  const barWidth = 200
  const barHeight = 20
  const x = scene.scale.width - barWidth - 10
  const y = 10

  scene.playerHealthBar.clear()
  scene.playerHealthBar.fillStyle(0xff0000)
  scene.playerHealthBar.fillRect(x, y, barWidth * percent, barHeight)
}
