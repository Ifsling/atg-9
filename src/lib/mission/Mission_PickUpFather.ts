import { STORYLINE_MISSIONS } from "../ConstantsAndTypes"
import { showTopLeftOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"
import { Mission_EnemyChasingYou } from "./Mission_EnemyChasingYou"
import { MissionEndMarker } from "./MissionEndMarker"
import { MissionFather } from "./MissionFather"
import {
  SaveCurrentMissionProgressInLocalStorage,
  StartCurrentMission,
} from "./MissionHelperFunctions"

let missionEndMarker: MissionEndMarker

export function Mission_PickUpFather(scene: MyGame) {
  const fatherSpawnPosition =
    STORYLINE_MISSIONS.MISSION_THREE.missionMarkerPosition

  const noOfEnemies = 4

  const father = new MissionFather(
    scene,
    {
      x: fatherSpawnPosition.x,
      y: fatherSpawnPosition.y,
    },
    () => {
      const destination = STORYLINE_MISSIONS.MISSION_ONE.missionMarkerPosition

      Mission_EnemyChasingYou(scene, noOfEnemies, 10)

      missionEndMarker = new MissionEndMarker(
        scene,
        destination.x,
        destination.y,
        () => {
          const currentCar = scene.carBeingDrivenByPlayer

          if (!currentCar) return

          const father = new MissionFather(
            scene,
            {
              x: currentCar.x + 50,
              y: currentCar.y + 50,
            },
            () => {},
            true
          )

          // Destroy father after 2 seconds
          scene.time.delayedCall(2000, () => {
            father.sprite.destroy()
            showTopLeftOverlayText(scene, "Mission Completed", 20, 70, 3000)
            scene.storylineMission.started = false

            const enemiesToDestroy = [...scene.missionEnemies]
            enemiesToDestroy.forEach((enemy) => {
              enemy.destroy()
            })

            scene.storylineMission.currentMission =
              STORYLINE_MISSIONS.MISSION_FOUR

            SaveCurrentMissionProgressInLocalStorage(scene)

            StartCurrentMission(
              scene,
              "Mission Started. Find and bring back the anesthetics within 2 minutes",
              7000
            )
          })
        },
        "only_car"
      )
    }
  )
}

export function FailMission(scene: MyGame) {
  if (missionEndMarker) {
    missionEndMarker.destroy()
  }

  showTopLeftOverlayText(
    scene,
    "Mission Failed, Father got blasted",
    20,
    70,
    3000
  )
  scene.storylineMission.started = false

  const enemiesToDestroy = [...scene.missionEnemies]
  enemiesToDestroy.forEach((enemy) => {
    enemy.destroy()
  })

  scene.storylineMission.currentMission = STORYLINE_MISSIONS.MISSION_THREE

  StartCurrentMission(
    scene,
    "Mission Started. Find and drop the father to his house.",
    5000,
    20,
    100
  )
}
