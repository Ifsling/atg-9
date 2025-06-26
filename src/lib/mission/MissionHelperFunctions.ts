import { showTopLeftOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"
import { MissionMarker } from "./MissionMarker"

export function StartCurrentMission(scene: MyGame) {
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
