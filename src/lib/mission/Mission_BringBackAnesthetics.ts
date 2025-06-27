import { STORYLINE_MISSIONS } from "../ConstantsAndTypes"
import { showTopLeftOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"
import { MissionEndMarker } from "./MissionEndMarker"
import { SaveCurrentMissionProgressInLocalStorage, StartCurrentMission } from "./MissionHelperFunctions"

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

    StartCurrentMission(
      scene,
      "Mission Started. Find and bring back the anesthetics within 2 minutes",
      7000
    )
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

        SaveCurrentMissionProgressInLocalStorage(scene)

        StartCurrentMission(
          scene,
          "Mission Started. Find and kill the correct Medicine Hider among 3",
          6000
        )
      },
      "only_player"
    )
  })
}
