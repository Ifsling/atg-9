import { STORYLINE_MISSIONS } from "../ConstantsAndTypes"
import { MyGame } from "../MyGame"

let arrow: Phaser.GameObjects.Image
let label: Phaser.GameObjects.Text

export function ShowMissionDirection(scene: MyGame) {
  if (
    scene.storylineMission.currentMission ===
      STORYLINE_MISSIONS.MISSIONS_COMPLETED ||
    scene.storylineMission.started
  ) {
    scene.missionMarkerArrow?.setAlpha(0)
    scene.missionMarkerDirectionText?.setAlpha(0)
    return
  }

  scene.missionMarkerArrow?.setAlpha(1)
  scene.missionMarkerDirectionText?.setAlpha(1)

  const missionMarkerPosition =
    scene.storylineMission.currentMission.missionMarkerPosition
  const playerPosition = scene.playerParentBody

  const angle = Phaser.Math.Angle.Between(
    playerPosition.x,
    playerPosition.y,
    missionMarkerPosition.x,
    missionMarkerPosition.y
  )

  const arrowX = 100
  const arrowY = scene.scale.height - 50

  if (!arrow) {
    arrow = scene.add.image(arrowX, arrowY, "arrow-right")
    arrow.setOrigin(0.5)
    arrow.setScrollFactor(0)
    arrow.setDepth(2000)
  }

  if (!label) {
    if (
      scene.storylineMission.currentMission ===
        STORYLINE_MISSIONS.MISSION_THREE &&
      scene.storylineMission.started
    ) {
      label = scene.add.text(
        arrowX,
        arrowY - 20,
        "Drop Father in this direction",
        {
          fontSize: "10px",
          color: "#ffffff",
        }
      )
    } else {
      label = scene.add.text(arrowX, arrowY - 20, "mission marker direction", {
        fontSize: "10px",
        color: "#ffffff",
      })
    }
    label.setOrigin(0.5)
    label.setScrollFactor(0)
    label.setDepth(2000)
  }

  arrow.setPosition(arrowX, arrowY)
  arrow.setRotation(angle)

  label.setPosition(arrowX, arrowY - 20)

  scene.missionMarkerArrow = arrow
  scene.missionMarkerDirectionText = label
}
