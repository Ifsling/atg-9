import { MyGame } from "../MyGame"

export type ACCEPTANCE_ENTITIES =
  | "only_car"
  | "both_car_and_player"
  | "only_player"

export class MissionEndMarker {
  scene: MyGame
  container: Phaser.GameObjects.Container
  ring: Phaser.GameObjects.Graphics
  radius: number = 40
  callback: () => void

  constructor(
    scene: MyGame,
    x: number,
    y: number,
    callback: () => void,
    acceptanceEntities: ACCEPTANCE_ENTITIES = "both_car_and_player"
  ) {
    this.scene = scene
    this.callback = callback

    // Create pulsating ring
    this.ring = this.createPulsatingRing(
      scene,
      this.radius,
      this.radius,
      this.radius + 10,
      0x00ff00 // Green color for "mission complete"
    )

    // Add to container
    this.container = scene.add.container(x, y, [this.ring])
    this.container.setSize(this.radius * 2, this.radius * 2)

    // Enable physics
    scene.physics.add.existing(this.container)
    const body = this.container.body as Phaser.Physics.Arcade.Body
    const circleRadius = this.radius + 15
    body.setCircle(
      circleRadius,
      this.container.width / 2 - circleRadius,
      this.container.height / 2 - circleRadius
    )

    body.setImmovable(true)

    // Animate ring size (pulsating effect)
    scene.tweens.add({
      targets: this.container,
      scale: { from: 1, to: 1.2 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    })

    if (acceptanceEntities === "only_player") {
      // Enable overlap detection
      scene.physics.add.overlap(
        scene.PlayerParent,
        this.container,
        this.handleOverlap,
        undefined,
        this
      )
    } else if (acceptanceEntities === "only_car") {
      // Enable overlap detection with player car
      scene.physics.add.overlap(
        scene.carsGroup,
        this.container,
        this.handleOverlap,
        undefined,
        this
      )
    } else {
      // Enable overlap detection with both player and car
      scene.physics.add.overlap(
        scene.PlayerParent,
        this.container,
        this.handleOverlap,
        undefined,
        this
      )
      scene.physics.add.overlap(
        scene.carsGroup,
        this.container,
        this.handleOverlap,
        undefined,
        this
      )
    }
  }

  createPulsatingRing(
    scene: Phaser.Scene,
    x: number,
    y: number,
    outerRadius: number,
    color: number
  ) {
    const ring = scene.add.graphics({ x: 0, y: 0 })

    // Draw glow effect — multiple outer rings with fading alpha
    for (let i = 0; i < 4; i++) {
      ring.lineStyle(8 + i * 2, color, 0.1 * (1 - i * 0.2))
      ring.strokeCircle(0, 0, outerRadius + i * 4)
    }

    // Solid visible ring
    ring.lineStyle(6, color, 1)
    ring.strokeCircle(0, 0, outerRadius)

    return ring
  }

  handleOverlap() {
    this.callback()
    this.destroy()
  }

  destroy() {
    this.container.destroy()
    this.ring.destroy()
  }
}
