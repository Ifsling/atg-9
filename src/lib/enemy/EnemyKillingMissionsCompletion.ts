import { STORYLINE_MISSIONS } from "../ConstantsAndTypes"
import { showTopLeftOverlayText } from "../HelperFunctions"
import { MissionMarker } from "../mission/MissionMarker"
import { MyGame } from "../MyGame"

export function completeMission(scene: MyGame, isChoosenMissionEnemy: boolean) {
  if (
    scene.storylineMission.currentMission === STORYLINE_MISSIONS.MISSION_TWO &&
    scene.missionEnemies.length === 0
  ) {
    showTopLeftOverlayText(scene, "Mission Completed", 20, 70, 3000)
    scene.storylineMission.currentMission = STORYLINE_MISSIONS.MISSION_THREE

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
  } else if (
    scene.storylineMission.currentMission === STORYLINE_MISSIONS.MISSION_FIVE
  ) {
    if (isChoosenMissionEnemy) {
      showTopLeftOverlayText(scene, "Mission Completed", 20, 70, 3000)
      scene.storylineMission.currentMission = STORYLINE_MISSIONS.MISSION_SIX

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
  }
}
