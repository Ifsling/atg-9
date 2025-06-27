import { STORYLINE_MISSIONS } from "../ConstantsAndTypes"
import { showTopLeftOverlayText } from "../HelperFunctions"
import {
  SaveCurrentMissionProgressInLocalStorage,
  StartCurrentMission,
} from "../mission/MissionHelperFunctions"
import { MyGame } from "../MyGame"

export function completeMission(scene: MyGame, isChoosenMissionEnemy: boolean) {
  if (
    scene.storylineMission.currentMission === STORYLINE_MISSIONS.MISSION_TWO &&
    scene.missionEnemies.length === 0
  ) {
    showTopLeftOverlayText(scene, "Mission Completed", 20, 70, 3000)
    scene.storylineMission.currentMission = STORYLINE_MISSIONS.MISSION_THREE

    SaveCurrentMissionProgressInLocalStorage(scene)

    StartCurrentMission(
      scene,
      "Mission Started. Find and drop the father to his house.",
      5000,
      20,
      100
    )
  } else if (
    scene.storylineMission.currentMission === STORYLINE_MISSIONS.MISSION_FIVE
  ) {
    if (isChoosenMissionEnemy) {
      showTopLeftOverlayText(scene, "Mission Completed", 20, 70, 3000)
      scene.storylineMission.currentMission = STORYLINE_MISSIONS.MISSION_SIX

      SaveCurrentMissionProgressInLocalStorage(scene)

      StartCurrentMission(
        scene,
        "Mission Started. Blast the robber car before it reaches its destination",
        8000
      )
    } else {
      scene.storylineMission.started = false

      showTopLeftOverlayText(
        scene,
        "Mission Failed. You killed an innocent one.",
        20,
        70,
        4000
      )

      const enemiesToDestroy = [...scene.missionEnemies]

      enemiesToDestroy.forEach((enemy) => {
        enemy.isChoosenMissionEnemy = false
        enemy.destroy()
      })

      StartCurrentMission(
        scene,
        "Mission Started. Find and kill the correct Medicine Hider among 3",
        6000
      )
    }
  } else if (
    scene.storylineMission.currentMission ===
      STORYLINE_MISSIONS.MISSION_SEVEN &&
    scene.missionEnemies.length === 0
  ) {
    showTopLeftOverlayText(scene, "Mission Completed", 20, 70, 3000)
    scene.storylineMission.currentMission =
      STORYLINE_MISSIONS.MISSIONS_COMPLETED

    SaveCurrentMissionProgressInLocalStorage(scene)

    // Play final get together cutscene here
  }
}
