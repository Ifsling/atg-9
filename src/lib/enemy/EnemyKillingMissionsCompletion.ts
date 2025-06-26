import { STORYLINE_MISSIONS } from "../ConstantsAndTypes"
import { showTopLeftOverlayText } from "../HelperFunctions"
import { StartCurrentMission } from "../mission/MissionHelperFunctions"
import { MissionMarker } from "../mission/MissionMarker"
import { MyGame } from "../MyGame"

export function completeMission(scene: MyGame, isChoosenMissionEnemy: boolean) {
  if (
    scene.storylineMission.currentMission === STORYLINE_MISSIONS.MISSION_TWO &&
    scene.missionEnemies.length === 0
  ) {
    showTopLeftOverlayText(scene, "Mission Completed", 20, 70, 3000)
    scene.storylineMission.currentMission = STORYLINE_MISSIONS.MISSION_THREE

    StartCurrentMission(scene)
  } else if (
    scene.storylineMission.currentMission === STORYLINE_MISSIONS.MISSION_FIVE
  ) {
    if (isChoosenMissionEnemy) {
      showTopLeftOverlayText(scene, "Mission Completed", 20, 70, 3000)
      scene.storylineMission.currentMission = STORYLINE_MISSIONS.MISSION_SIX

      StartCurrentMission
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

      StartCurrentMission(scene)
    }
  } else if (
    scene.storylineMission.currentMission ===
      STORYLINE_MISSIONS.MISSION_SEVEN &&
    scene.missionEnemies.length === 0
  ) {
    showTopLeftOverlayText(scene, "Mission Completed", 20, 70, 3000)
    scene.storylineMission.currentMission =
      STORYLINE_MISSIONS.MISSIONS_COMPLETED

    // Play final get together cutscene here
  }
}
