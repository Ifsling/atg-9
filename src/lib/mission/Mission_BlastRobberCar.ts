import { showTopLeftOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"
import { EnemyCar } from "./MissionEnemyCar"
import { StartCurrentMission } from "./MissionHelperFunctions"
import { MissionMarker } from "./MissionMarker"

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

      StartCurrentMission(scene)
    }
  )
}
