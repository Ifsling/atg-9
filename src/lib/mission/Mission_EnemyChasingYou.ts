import { STORYLINE_MISSIONS } from "../ConstantsAndTypes"
import { EnemyNew } from "../enemy/EnemyNew"
import { showTopLeftOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"
import { damagePlayer } from "../player/Player"
import { getRandomSpawnLocationWithinRadius } from "../utils"
import { MissionMarker } from "./MissionMarker"

export function Mission_EnemyChasingYou(
  scene: MyGame,
  noOfEnemies: number = 5,
  noOfMinuesOfMission: number = 0.1
) {
  const missionStartTime = scene.time.now
  localStorage.setItem("missionStartTime", missionStartTime.toString())

  // End mission after certain time
  scene.time.addEvent({
    delay: 1000 * 60 * noOfMinuesOfMission, // 2 minutes
    callback: () => {
      showTopLeftOverlayText(scene, "Mission Completed", 10, 70, 3000)

      // Clone array to avoid mutation during iteration
      const enemiesToDestroy = [...scene.missionEnemies]

      enemiesToDestroy.forEach((enemy) => {
        enemy.destroy()
      })

      if (scene.storylineMission.started) {
        scene.storylineMission.currentMission = STORYLINE_MISSIONS.MISSION_TWO

        new MissionMarker(
          scene,
          scene.storylineMission.currentMission.missionMarkerPosition.x,
          scene.storylineMission.currentMission.missionMarkerPosition.y,
          () => {
            showTopLeftOverlayText(scene, "Mission Started", 20, 70, 3000)

            scene.missionEnemies = []
            scene.storylineMission.started = true
            scene.storylineMission.currentMission.missionFunction(scene)
          }
        )
      }
    },
    callbackScope: scene,
  })

  const enemyPositions: { x: number; y: number }[] = []
  const spawnRadius = 700
  const offsetStep = 30 // How far to shift if position is already taken

  while (enemyPositions.length < noOfEnemies) {
    const basePosition = getRandomSpawnLocationWithinRadius(
      scene.playerParentBody.x,
      scene.playerParentBody.y,
      spawnRadius
    )

    let spawnX = basePosition.x
    let spawnY = basePosition.y

    // Check if this position is already taken (exact match or very close)
    const isTaken = enemyPositions.some((pos) => {
      const dx = pos.x - spawnX
      const dy = pos.y - spawnY
      const distSq = dx * dx + dy * dy
      return distSq < 10 * 10 // if within 10px
    })

    if (isTaken) {
      // Apply offset in a spiral or grid pattern (simple version: diagonal shift)
      const offset = enemyPositions.length * offsetStep
      spawnX += offset
      spawnY += offset
    }

    enemyPositions.push({ x: spawnX, y: spawnY })
    const enemy = new EnemyNew(scene, spawnX, spawnY, true)
    scene.enemies.push(enemy)
    scene.missionEnemies.push(enemy)
  }

  // Add collisions for each enemy
  scene.enemies.forEach((enemy) => {
    // Player collision
    scene.physics.add.overlap(
      enemy.enemyBullets,
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
        enemy.enemyBullets,
        car,
        (carGameObject, bullet) => {
          const enemyBullet = bullet as Phaser.Physics.Arcade.Image
          enemyBullet.destroy()

          // Call car damage logic if available
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
