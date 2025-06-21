import { MyGame } from "../MyGame"

export class MissionEndMarker {
  scene: MyGame
  container: Phaser.GameObjects.Container
  ring: Phaser.GameObjects.Graphics
  radius: number = 40
  callback: () => void

  constructor(scene: MyGame, x: number, y: number, callback: () => void) {
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
    body.setCircle(this.radius + 15)
    body.setOffset(27, 27)
    body.setImmovable(true)

    // Animate ring size (pulsating effect)
    scene.tweens.add({
      targets: this.container,
      scale: { from: 1, to: 1.2 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    })

    // Enable overlap detection
    scene.physics.add.overlap(
      scene.PlayerParent,
      this.container,
      this.handleOverlap,
      undefined,
      this
    )
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
    // this.scene.missionCompleteParticleSystem?.explode(
    //   1,
    //   this.container.x - 100,
    //   this.container.y - 100
    // )

    this.callback()
    this.destroy()
  }

  destroy() {
    this.container.destroy()
    this.ring.destroy()
  }
}
