import { showTopLeftOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"
import { EnemyCar } from "./MissionEnemyCar"
import { StartCurrentMission } from "./MissionHelperFunctions"

export function Mission_BlastRobberCar(scene: MyGame) {
  const enemyCar = new EnemyCar(
    scene,
    {
      x: scene.storylineMission.currentMission.missionMarkerPosition.x + 300,
      y: scene.storylineMission.currentMission.missionMarkerPosition.y + 300,
    },
    {
      x: 450,
      y: 5550,
    },
    () => {
      showTopLeftOverlayText(
        scene,
        "Mission Failed. The robbers escaped",
        20,
        70,
        4000
      )

      scene.storylineMission.started = false
      scene.missionEnemies = []
      enemyCar.destroy()

      StartCurrentMission(
        scene,
        "Mission Started. Blast the robber car before it reaches its destination",
        8000
      )
    }
  )
}
