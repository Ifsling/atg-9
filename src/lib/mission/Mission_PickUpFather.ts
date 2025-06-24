import { STORYLINE_MISSIONS } from "../ConstantsAndTypes"
import { showTopLeftOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"
import { MissionEndMarker } from "./MissionEndMarker"
import { MissionFather } from "./MissionFather"
import { MissionMarker } from "./MissionMarker"

export function Mission_PickUpFather(scene: MyGame) {
  const fatherSpawnPosition =
    STORYLINE_MISSIONS.MISSION_THREE.missionMarkerPosition

  const father = new MissionFather(
    scene,
    {
      x: fatherSpawnPosition.x,
      y: fatherSpawnPosition.y,
    },
    () => {
      const destination = STORYLINE_MISSIONS.MISSION_THREE.missionMarkerPosition
      destination.y += 500

      new MissionEndMarker(
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

            scene.storylineMission.currentMission =
              STORYLINE_MISSIONS.MISSION_FOUR

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
          })
        },
        "only_car"
      )
    }
  )
}
