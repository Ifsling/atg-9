import { showTopLeftOverlayText } from "../HelperFunctions"
import { MyGame } from "../MyGame"

export class MissionFather {
  scene: MyGame
  sprite: Phaser.Physics.Arcade.Sprite
  hasShownNoCarMessage: boolean = false // <-- Add this
  readonly PICKUP_RADIUS = 600

  constructor(
    scene: MyGame,
    spawnAt: { x: number; y: number },
    onFatherPickedUp?: () => void,
    missionEnded: boolean = false
  ) {
    this.scene = scene

    this.sprite = scene.physics.add
      .sprite(spawnAt.x, spawnAt.y, "father")
      .setScale(0.45)
      .setDepth(1)

    this.sprite.setCollideWorldBounds(true)
    this.sprite.setData("ref", this) // Store reference to this class instance

    scene.physics.add.existing(this.sprite)

    scene.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        if (!this.sprite.active || missionEnded) return

        const isPlayerInCar = scene.carBeingDrivenByPlayer
        const playerOrCar = scene.carBeingDrivenByPlayer
          ? scene.carBeingDrivenByPlayer
          : scene.playerParentBody

        const distance = Phaser.Math.Distance.Between(
          this.sprite.x,
          this.sprite.y,
          playerOrCar.x,
          playerOrCar.y
        )

        if (distance < this.PICKUP_RADIUS) {
          if (!isPlayerInCar) {
            if (!this.hasShownNoCarMessage) {
              this.hasShownNoCarMessage = true

              showTopLeftOverlayText(
                scene,
                "You need a Car to pick up the Father!",
                20,
                70,
                7000
              )
            }
            this.scene.time.delayedCall(
              7000,
              () => {
                this.hasShownNoCarMessage = false
              },
              [],
              this
            )
            return
          }

          const angle = Phaser.Math.Angle.Between(
            this.sprite.x,
            this.sprite.y,
            playerOrCar.x,
            playerOrCar.y
          )

          this.sprite.setVelocity(Math.cos(angle) * 100, Math.sin(angle) * 100)

          if (distance < 50) {
            if (onFatherPickedUp) {
              onFatherPickedUp()
            }

            this.sprite.destroy()
          }
        } else {
          this.sprite.setVelocity(0, 0) // stop moving if player is out of range
        }
      },
    })
  }
}
