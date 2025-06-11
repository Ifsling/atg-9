import { EnemyNew } from "../enemy/EnemyNew"
import { showTopLeftOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"
import { damagePlayer } from "../player/Player"

export function MissionTwo_KillSquad(scene: MyGame) {
  scene.missionStarted = true

  const missionStartTime = scene.time.now
  localStorage.setItem("missionStartTime", missionStartTime.toString())

  // do something after 2 minutes
  scene.time.addEvent({
    delay: 40000,
    callback: () => {
      scene.missionStarted = false

      console.log("Mission time complete!")
      showTopLeftOverlayText(scene, "Mission Completed", 10, 70, 3000)

      // Clone array to avoid mutation during iteration
      const enemiesToDestroy = [...scene.missionEnemies]

      enemiesToDestroy.forEach((enemy) => {
        enemy.destroy()
      })

      console.log(scene.missionEnemies)

      // Maybe trigger a cutscene or next mission
    },
    callbackScope: scene,
  })

  // Add enemies to the scene
  const enemy1 = new EnemyNew(scene, 1100, 100, true)
  const enemy2 = new EnemyNew(scene, 1100, 500, true)
  const enemy3 = new EnemyNew(scene, 100, 1100, true)
  const enemy4 = new EnemyNew(scene, 500, 1100, true)
  const enemy5 = new EnemyNew(scene, 1100, 1100, true)

  scene.missionEnemies = []
  scene.missionEnemies.push(enemy1, enemy2, enemy3, enemy4, enemy5)
  scene.enemies.push(enemy1, enemy2, enemy3, enemy4, enemy5)

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
          console.log("COLLIDEDDDDDDDD")
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
