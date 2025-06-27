// lib/MenuScene.ts
import Phaser from "phaser"

export default class MenuScene extends Phaser.Scene {
  private settingsModal?: Phaser.GameObjects.Container
  private escKey?: Phaser.Input.Keyboard.Key

  constructor() {
    super("MenuScene")
  }

  preload() {
    this.load.image("menuBg", "/images/menu-screen-bg.png")
  }

  create() {
    const { width, height } = this.scale

    // Background image
    this.add
      .image(width / 2, height / 2, "menuBg")
      .setDisplaySize(width, height)

    // Left-to-right gradient rectangle overlay
    const gradient = this.add.graphics()
    const gradientWidth = width * 0.6
    const gradientHeight = height
    const gradientTexture = this.textures.createCanvas(
      "gradient",
      gradientWidth,
      gradientHeight
    )

    const ctx = gradientTexture.getContext()
    const grd = ctx.createLinearGradient(0, 0, gradientWidth, 0)
    grd.addColorStop(0, "rgba(0,0,0,1)")
    grd.addColorStop(0.7, "rgba(0,0,0,0.7)")
    grd.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, gradientWidth, gradientHeight)
    gradientTexture.refresh()

    this.add.image(0, 0, "gradient").setOrigin(0, 0)

    // Padding like `pl-12 md:pl-24` (approx 48px–96px)
    const paddingLeft = width < 768 ? 48 : 96
    const buttonX = paddingLeft + 160 // approximate text center alignment

    // START GAME Button
    const startText = this.add
      .text(buttonX, height / 2 - 60, "Start Game", {
        fontSize: "28px",
        color: "#ffffff",
        backgroundColor: "#dc2626", // Tailwind red-600
        padding: { x: 20, y: 14 },
        fontFamily: "sans-serif",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("MyGame"))
      .on("pointerover", () =>
        startText.setStyle({ backgroundColor: "#b91c1c" })
      )
      .on("pointerout", () =>
        startText.setStyle({ backgroundColor: "#dc2626" })
      )

    // SETTINGS Button
    const settingsText = this.add
      .text(buttonX, height / 2 + 20, "Settings", {
        fontSize: "28px",
        color: "#ffffff",
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: { x: 20, y: 14 },
        fontFamily: "sans-serif",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.showSettingsModal())

    // ESC key to close modal
    this.escKey = this.input.keyboard?.addKey("ESC")
  }

  update() {
    if (
      this.settingsModal &&
      this.settingsModal.visible &&
      Phaser.Input.Keyboard.JustDown(this.escKey!)
    ) {
      this.hideSettingsModal()
    }
  }

  private showSettingsModal() {
    const { width, height } = this.scale

    if (this.settingsModal) {
      this.settingsModal.setVisible(true)
      return
    }

    const modalWidth = 400
    const modalHeight = 200

    const bg = this.add
      .rectangle(0, 0, modalWidth, modalHeight, 0x111827)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0xffffff)

    const title = this.add
      .text(0, -60, "Settings", {
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0.5)

    const msg = this.add
      .text(
        0,
        -20,
        "There are no settings available.\nAll you can do is play the game.",
        {
          fontSize: "16px",
          color: "#d1d5db",
          align: "center",
          wordWrap: { width: 360 },
        }
      )
      .setOrigin(0.5)

    const closeBtn = this.add
      .text(0, 60, "Close", {
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#374151",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.hideSettingsModal())
      .on("pointerover", () =>
        closeBtn.setStyle({ backgroundColor: "#4b5563" })
      )
      .on("pointerout", () => closeBtn.setStyle({ backgroundColor: "#374151" }))

    this.settingsModal = this.add.container(width / 2, height / 2, [
      bg,
      title,
      msg,
      closeBtn,
    ])
  }

  private hideSettingsModal() {
    if (this.settingsModal) {
      this.settingsModal.setVisible(false)
    }
  }
}
