import { CustomKeys } from "../ConstantsAndTypes"
import { MyGame } from "../MyGame"

let consoleOpen = false
let inputElement: Phaser.GameObjects.DOMElement | null = null

export function handleCheatCodeSystem(scene: MyGame, cursors: CustomKeys) {
  // Only toggle if not focused on DOM input
  if (Phaser.Input.Keyboard.JustDown(cursors.tilde)) {
    if (!consoleOpen) {
      openCheatConsole(scene)
    } else {
      closeCheatConsole(scene)
    }
  }
}

function openCheatConsole(scene: MyGame) {
  consoleOpen = true

  // Disable keyboard input so WASD doesn’t trigger player movement
  scene!.input!.keyboard!.enabled = false

  const width = scene.scale.width
  const height = scene.scale.height

  // Wrap input in a div to center it better
  inputElement = scene.add.dom(width / 2, height / 2).createFromHTML(`
    <div style="display: flex; justify-content: center; align-items: center;">
      <input id="cheatInput" type="text" 
        placeholder="Enter cheat code..." 
        style="
          width: 60vw; 
          font-size: 24px;
          padding: 10px;
          background: black;
          color: lime;
          border: 2px solid lime;
          border-radius: 5px;
          outline: none;
          text-align: center;
        "
      />
    </div>
  `)

  inputElement.setOrigin(0.5)

  // Wait for DOM to render before calling focus
  scene.time.delayedCall(10, () => {
    const input = inputElement?.getChildByID("cheatInput") as HTMLInputElement
    if (input) {
      input.focus()
      input.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          const value = input.value.trim()
          if (value.length > 0) {
            console.log("Cheat Code Entered:", value)
          }
          closeCheatConsole(scene)
        } else if (e.key === "Escape") {
          closeCheatConsole(scene)
        }
      })
    }
  })

  // Re-center on resize
  scene.scale.on("resize", () => {
    if (inputElement) {
      const { width, height } = scene.scale
      inputElement.setPosition(width / 2, height / 2)
    }
  })
}

function closeCheatConsole(scene: MyGame) {
  if (inputElement) {
    inputElement.destroy()
    inputElement = null
  }
  consoleOpen = false
  scene!.input!.keyboard!.enabled = true
}
