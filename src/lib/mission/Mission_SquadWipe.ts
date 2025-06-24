import { EnemyNew } from "../enemy/EnemyNew"
import { MyGame } from "../MyGame"
import { damagePlayer } from "../player/Player"
import { getRandomSpawnLocationWithinRadius } from "../utils"

export function Mission_SquadWipe(scene: MyGame, noOfEnemies = 8) {
  const spawnRadius = 700
  const offsetStep = 30
  const enemyPositions: { x: number; y: number }[] = []

  for (let i = 0; i < noOfEnemies; i++) {
    const basePos = getRandomSpawnLocationWithinRadius(
      scene.playerParentBody.x,
      scene.playerParentBody.y,
      spawnRadius
    )

    let spawnX = basePos.x
    let spawnY = basePos.y

    // Check if a similar position exists, then apply offset
    const isTooClose = enemyPositions.some((pos) => {
      const dx = pos.x - spawnX
      const dy = pos.y - spawnY
      return dx * dx + dy * dy < 20 * 20 // if within 20px
    })

    if (isTooClose) {
      const offset = i * offsetStep
      spawnX += offset
      spawnY += offset
    }

    enemyPositions.push({ x: spawnX, y: spawnY })

    const enemy = new EnemyNew(scene, spawnX, spawnY)
    scene.missionEnemies.push(enemy)
    scene.enemies.push(enemy)

    // Bullet-player overlap
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

    // Bullet-car overlap
    scene.carsGroup.getChildren().forEach((car: any) => {
      scene.physics.add.overlap(
        enemy.enemyBullets,
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
  }
}
