import { showCenteredOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"

export function GameoverOverlay(scene: MyGame) {
  showCenteredOverlayText(scene, "GAME OVER", () => {
    scene.scene.restart()
    scene.storylineMission.started = false
    scene.missionEnemies = []
    scene.enemies = []
  })
}
