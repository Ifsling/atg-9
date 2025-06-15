import { MyGame } from "../MyGame"

export class MissionMarker {
  scene: MyGame
  container: Phaser.GameObjects.Container
  glow: Phaser.GameObjects.Graphics
  radius: number = 40
  callback: () => void

  constructor(scene: MyGame, x: number, y: number, callback: () => void) {
    this.scene = scene
    this.callback = callback

    this.glow = this.createGlowingCircle(
      scene,
      this.radius,
      this.radius,
      this.radius,
      0xffff00
    )

    // Add to container, position glow so it’s centered inside container
    this.container = scene.add.container(x, y, [this.glow])

    // Set container size explicitly (important for physics body)
    this.container.setSize(this.radius * 2, this.radius * 2)

    // Enable physics body on container
    scene.physics.add.existing(this.container)

    const body = this.container.body as Phaser.Physics.Arcade.Body

    // Set circular physics body with radius
    body.setCircle(this.radius + 15)

    body.setOffset(27, 27)

    body.setImmovable(true)

    // Animate pulse
    scene.tweens.add({
      targets: this.container,
      scale: { from: 0.9, to: 1.1 },
      duration: 600,
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

  createGlowingCircle(
    scene: Phaser.Scene,
    x: number,
    y: number,
    radius: number,
    color: number
  ) {
    const glow = scene.add.graphics({ x, y })

    // Draw glow effect using multiple circles with decreasing alpha
    for (let i = 0; i < 5; i++) {
      glow.fillStyle(color, 0.1 * (1 - i * 0.15))
      glow.fillCircle(0, 0, radius + i * 6)
    }

    // Inner solid circle
    glow.fillStyle(color, 1)
    glow.fillCircle(0, 0, radius)

    return glow
  }

  handleOverlap() {
    this.scene.missionMarkerPickedParticleSystem.explode(
      1,
      (this.container.x || 0) - 100,
      (this.container.y || 0) - 100
    )

    this.callback()
    this.destroy()
  }

  destroy() {
    this.container.destroy()
    this.glow.destroy()
  }
}
