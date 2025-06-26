import { STORYLINE_MISSIONS } from "../ConstantsAndTypes"
import { showTopLeftOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"
import { MissionEndMarker } from "./MissionEndMarker"
import { StartCurrentMission } from "./MissionHelperFunctions"
import { MissionMarker } from "./MissionMarker"

export function Mission_BringBackAnesthetics(scene: MyGame) {
  let missionCompleted = false
  let initialMissionEndMarker: MissionEndMarker
  let secondMissionEndMarker: MissionEndMarker

  const failTimeout = scene.time.delayedCall(1000 * 60 * 2, () => {
    if (missionCompleted) return

    showTopLeftOverlayText(
      scene,
      "Mission Failed, You didn't bring the med within 2 mins",
      20,
      70,
      3000
    )
    scene.storylineMission.currentMission = STORYLINE_MISSIONS.MISSION_FOUR
    scene.missionEnemies = []
    scene.storylineMission.started = false

    if (initialMissionEndMarker) initialMissionEndMarker.destroy()
    if (secondMissionEndMarker) secondMissionEndMarker.destroy()

    StartCurrentMission(scene)
  })

  initialMissionEndMarker = new MissionEndMarker(scene, 2250, 7950, () => {
    secondMissionEndMarker = new MissionEndMarker(
      scene,
      scene.storylineMission.currentMission.missionMarkerPosition.x,
      scene.storylineMission.currentMission.missionMarkerPosition.y,
      () => {
        missionCompleted = true
        failTimeout.remove(false)

        showTopLeftOverlayText(scene, "Mission Completed", 20, 70, 3000)
        scene.storylineMission.started = false

        // Set the next mission
        scene.storylineMission.currentMission = STORYLINE_MISSIONS.MISSION_FIVE
      },
      "only_player"
    )
  })
}
