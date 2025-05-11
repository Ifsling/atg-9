import Phaser from "phaser"
import { handlePlayerMovement } from "./player/Player"

export class MyGame extends Phaser.Scene {
  player!: Phaser.Physics.Arcade.Sprite
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super("MyGame")
  }

  preload() {
    this.load.image("player", "/images/player.png")
  }

  create() {
    const svg = `
      <svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e0e0e0"/>
        ${[...Array(10)]
          .map(
            (_, i) => `
          <rect x="${i * 100}" y="0" width="20" height="1000" fill="#999" />
          <rect x="0" y="${i * 100}" width="1000" height="20" fill="#999" />
        `
          )
          .join("")}
        ${[...Array(9)]
          .map((_, row) =>
            [...Array(9)]
              .map(
                (_, col) => `
          <rect 
            x="${col * 100 + 20}" 
            y="${row * 100 + 20}" 
            width="60" 
            height="60" 
            fill="#d35400" 
            stroke="#333" 
            stroke-width="2"
          />
        `
              )
              .join("")
          )
          .join("")}
    </svg>`

    const svgBase64 = "data:image/svg+xml;base64," + btoa(svg)

    this.textures.addBase64("citymap", svgBase64)

    this.textures.once(Phaser.Textures.Events.ADD, (key: string) => {
      if (key === "citymap") {
        const city = this.add.image(0, 0, "citymap").setOrigin(0).setScale(4)
        const width = city.width * 4
        const height = city.height * 4

        this.physics.world.setBounds(0, 0, width, height)
        this.cameras.main.setBounds(0, 0, width, height)

        this.player = this.physics.add.sprite(400, 300, "player").setScale(0.02)
        this.player.setCollideWorldBounds(true)
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08)

        this.cursors = this.input!.keyboard!.createCursorKeys()
      }
    })
  }

  update() {
    handlePlayerMovement(this.player, this.cursors)
  }
}
