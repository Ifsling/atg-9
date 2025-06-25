import { EnemyNew } from "../enemy/EnemyNew"
import { MyGame } from "../MyGame"
import { getRandomSpawnLocationWithinRadius } from "../utils"

export function Mission_KillTheMedHider(scene: MyGame) {
  const randomSpawnLocation = getRandomSpawnLocationWithinRadius(
    scene.playerParentBody.x,
    scene.playerParentBody.y,
    700
  )

  const enemy1 = new EnemyNew(
    scene,
    randomSpawnLocation.x,
    randomSpawnLocation.y,
    false,
    false
  )
  enemy1.isChoosenMissionEnemy = true

  const enemy2 = new EnemyNew(
    scene,
    randomSpawnLocation.x - 100,
    randomSpawnLocation.y,
    false,
    false
  )

  const enemy3 = new EnemyNew(
    scene,
    randomSpawnLocation.x + 100,
    randomSpawnLocation.y,
    false,
    false
  )

  const randEnemy = Math.floor(Math.random() * 3) + 1
  let targetEnemy: EnemyNew
  if (randEnemy === 1) {
    targetEnemy = enemy1
  } else if (randEnemy === 2) {
    targetEnemy = enemy2
  } else {
    targetEnemy = enemy3
  }

  scene.missionEnemies.push(enemy1, enemy2, enemy3)
  scene.enemies.push(enemy1, enemy2, enemy3)

  console.log(scene.missionEnemies)
}
