import { showCenteredOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"

export function GameoverOverlay(scene: MyGame) {
  showCenteredOverlayText(scene, "GAME OVER", () => {
    ResetEverything(scene)
    scene.scene.restart()
  })
}

function ResetEverything(scene: MyGame) {
  scene.cops.forEach((cop) => {
    cop.enemyBullets?.clear(true, true)
    cop.sprite.destroy()
  })
  scene.cops = []

  scene.enemies.forEach((enemy) => enemy.enemySprite.destroy())
  scene.enemies = []

  scene.missionEnemies.forEach((enemy) => enemy.enemySprite.destroy())
  scene.missionEnemies = []

  scene.storylineMission.started = false

  scene.wantedLevel = 0
  scene.wantedStars.forEach((star) => star.destroy())
  scene.isPlayerAlive = true
}
