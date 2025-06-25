import { showTopLeftOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"
import { EnemyCar } from "./MissionEnemyCar"
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
  )
}
