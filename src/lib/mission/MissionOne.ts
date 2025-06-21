import { EnemyNew } from "../enemy/EnemyNew"
import { MyGame } from "../MyGame"
import { damagePlayer } from "../player/Player"

export const StartedMissionsLocations = [
  { x: 1100, y: 100 },
  { x: 1100, y: 500 },
  { x: 100, y: 1100 },
  { x: 500, y: 1100 },
  { x: 1100, y: 1100 },
]

export function Mission_SquadWipe(scene: MyGame) {
  const randSpawnPoint =
    StartedMissionsLocations[
      Math.floor(Math.random() * StartedMissionsLocations.length)
    ]

  scene.randomMissionStarted = true

  const enemy1 = new EnemyNew(scene, randSpawnPoint.x, randSpawnPoint.y)
  const enemy2 = new EnemyNew(scene, randSpawnPoint.x + 250, randSpawnPoint.y)
  const enemy3 = new EnemyNew(scene, randSpawnPoint.x, randSpawnPoint.y + 250)
  const enemy4 = new EnemyNew(
    scene,
    randSpawnPoint.x + 250,
    randSpawnPoint.y + 250
  )
  const enemy5 = new EnemyNew(scene, randSpawnPoint.x + 1100, randSpawnPoint.y)
  const enemy6 = new EnemyNew(
    scene,
    randSpawnPoint.x + 1100,
    randSpawnPoint.y + 250
  )
  const enemy7 = new EnemyNew(
    scene,
    randSpawnPoint.x + 1100 + 150,
    randSpawnPoint.y
  )
  const enemy8 = new EnemyNew(
    scene,
    randSpawnPoint.x + 1100 + 250,
    randSpawnPoint.y + 250
  )

  scene.missionEnemies = []
  scene.missionEnemies.push(
    enemy1,
    enemy2,
    enemy3,
    enemy4,
    enemy5,
    enemy6,
    enemy7,
    enemy8
  )
  scene.enemies.push(
    enemy1,
    enemy2,
    enemy3,
    enemy4,
    enemy5,
    enemy6,
    enemy7,
    enemy8
  )

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
