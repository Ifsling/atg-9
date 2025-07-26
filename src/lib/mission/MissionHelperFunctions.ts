import {
  LOCALSTORAGE_MISSION_SAVE_KEY,
  STORYLINE_MISSIONS,
} from "../ConstantsAndTypes"
import { showTopLeftOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"
import { MissionMarker } from "./MissionMarker"

type StorylineMissionKey = keyof typeof STORYLINE_MISSIONS

export function StartCurrentMission(
  scene: MyGame,
  text: string = "Mission Started",
  destroyAfter: number = 3000,
  x: number = 20,
  y: number = 70
) {
  new MissionMarker(
    scene,
    scene.storylineMission.currentMission.missionMarkerPosition.x,
    scene.storylineMission.currentMission.missionMarkerPosition.y,
    () => {
      showTopLeftOverlayText(scene, text, x, y, destroyAfter)
      scene.missionEnemies = []
      scene.storylineMission.started = true
      scene.storylineMission.currentMission.missionFunction(scene)
    }
  )
}

export function SaveCurrentMissionProgressInLocalStorage(scene: MyGame) {
  // Find the mission key based on the currentMission object
  const currentMissionKey =
    Object.entries(STORYLINE_MISSIONS).find(
      ([_, value]) => value === scene.storylineMission.currentMission
    )?.[0] ?? "MISSION_ONE" // Fallback in case not found

  localStorage.setItem(
    LOCALSTORAGE_MISSION_SAVE_KEY,
    JSON.stringify({
      currentMissionKey,
    })
  )
}

export function LoadCurrentStorylineMission() {
  const saved = localStorage.getItem(LOCALSTORAGE_MISSION_SAVE_KEY)
  const parsed = saved
    ? (JSON.parse(saved) as {
        currentMissionKey: StorylineMissionKey
      })
    : null

  const storylineMission = {
    started: false,
    currentMission:
      STORYLINE_MISSIONS[parsed?.currentMissionKey ?? "MISSION_ONE"],
  }

  return {
    started: false,
    currentMission: STORYLINE_MISSIONS.MISSION_ONE,
  }
}

export function MissionToMissionGuideText(
  missionName: keyof typeof STORYLINE_MISSIONS
) {
  switch (missionName) {
    case "MISSION_ONE":
      return "Mission Started: Run from enemies for 2 minutes"
    case "MISSION_TWO":
      return "Mission Started. Kill all the enemies"
    case "MISSION_THREE":
      return "Mission Started. Find and drop the father to his house."
    case "MISSION_FOUR":
      return "Mission Started. Find and bring back the anesthetics within 2 minutes"
    case "MISSION_FIVE":
      return "Mission Started. Find and kill the correct Medicine Hider among 3"
    case "MISSION_SIX":
      return "Mission Started. Blast the robber car before it reaches its destination"
    case "MISSION_SEVEN":
      return "Mission Started. Wipe out the final squad of enemies"
    default:
      return ""
  }
}
