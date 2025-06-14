import { CustomKeys } from "../ConstantsAndTypes"
import {
  SpawnPistol,
  SpawnRocketLauncher,
  SpawnShotgun,
  SpawnSMG,
} from "../gun/GenerateGuns"
import { handleGunPickup } from "../gun/Gun"
import { showTopLeftOverlayText } from "../HelperFunctions"
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

export function isCheatConsoleOpen(): boolean {
  return consoleOpen
}

function openCheatConsole(scene: MyGame) {
  consoleOpen = true

  const width = scene.scale.width
  const height = scene.scale.height

  // Create overlay background that can be clicked to close
  const overlay = scene.add.rectangle(
    0,
    0,
    width * 2,
    height * 2,
    0x000000,
    0.5
  )
  overlay.setOrigin(0)
  overlay.setScrollFactor(0)
  overlay.setDepth(9999)
  overlay.setInteractive()

  // Close console when clicking outside
  overlay.on("pointerdown", () => {
    closeCheatConsole(scene)
  })

  // Create input element
  inputElement = scene.add.dom(width / 2, height / 2).createFromHTML(`
    <div style="
      display: flex; 
      justify-content: center; 
      align-items: center; 
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10000;
    ">
      <input id="cheatInput" type="text" 
        placeholder="Enter cheat code..." 
        style="
          width: 400px;
          max-width: 80vw;
          font-size: 24px;
          padding: 15px;
          background: black;
          color: lime;
          border: 2px solid lime;
          border-radius: 8px;
          outline: none;
          text-align: center;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        "
      />
    </div>
  `)

  inputElement.setOrigin(0.5, 0.5)
  inputElement.setDepth(10000)
  inputElement.setScrollFactor(0)

  // Store overlay reference so we can destroy it later
  ;(inputElement as any).overlay = overlay

  // Focus the input after a brief delay
  scene.time.delayedCall(50, () => {
    const input = inputElement?.getChildByID("cheatInput") as HTMLInputElement
    if (input) {
      input.focus()

      // Handle input events
      const handleKeyDown = (e: KeyboardEvent) => {
        // Stop event from bubbling to Phaser
        e.stopPropagation()

        if (e.key === "Enter") {
          e.preventDefault()
          const value = input.value.trim()
          if (value.length > 0) {
            console.log("Cheat Code Entered:", value)
            processCheatCode(scene, value)
          }
          closeCheatConsole(scene)
        } else if (e.key === "Escape" || e.key === "`" || e.key === "~") {
          e.preventDefault()
          closeCheatConsole(scene)
        }
        // Allow normal typing for other keys
      }

      // Handle input blur (when clicking outside)
      const handleBlur = () => {
        // Small delay to prevent immediate closing when clicking input
        scene.time.delayedCall(100, () => {
          if (consoleOpen) {
            closeCheatConsole(scene)
          }
        })
      }

      input.addEventListener("keydown", handleKeyDown)
      input.addEventListener("blur", handleBlur)

      // Store event handlers for cleanup
      ;(input as any)._keydownHandler = handleKeyDown
      ;(input as any)._blurHandler = handleBlur
    }
  })

  // Re-center on resize
  const resizeHandler = () => {
    if (inputElement && overlay) {
      const { width, height } = scene.scale
      inputElement.setPosition(width / 2, height / 2)
      overlay.setSize(width * 2, height * 2)
    }
  }

  scene.scale.on("resize", resizeHandler)
  ;(inputElement as any)._resizeHandler = resizeHandler
}

function closeCheatConsole(scene: MyGame) {
  if (inputElement) {
    // Clean up input event listeners
    const input = inputElement.getChildByID("cheatInput") as HTMLInputElement
    if (input) {
      const keydownHandler = (input as any)._keydownHandler
      const blurHandler = (input as any)._blurHandler

      if (keydownHandler) {
        input.removeEventListener("keydown", keydownHandler)
      }
      if (blurHandler) {
        input.removeEventListener("blur", blurHandler)
      }
    }

    // Clean up resize handler
    const resizeHandler = (inputElement as any)._resizeHandler
    if (resizeHandler) {
      scene.scale.off("resize", resizeHandler)
    }

    // Destroy overlay
    const overlay = (inputElement as any).overlay
    if (overlay) {
      overlay.destroy()
    }

    // Destroy input element
    inputElement.destroy()
    inputElement = null
  }

  consoleOpen = false
}

function processCheatCode(scene: MyGame, code: string) {
  switch (code.toLowerCase()) {
    case "atglifemod":
      ;(scene.PlayerParent as any).health = 100
      scene.drawPlayerHealthBar(100)
      showTopLeftOverlayText(
        scene,
        "Cheat activated: Full Health",
        10,
        70,
        5000
      )
      break

    case "godmode":
      ;(scene.PlayerParent as any).health = 1000
      scene.drawPlayerHealthBar(1000)
      showTopLeftOverlayText(scene, "Cheat activated: God Mode", 10, 70, 5000)
      break

    case "ammo":
      if (scene.currentGun) {
        scene.currentGun.ammo = scene.currentGun.maxAmmo
        showTopLeftOverlayText(
          scene,
          "Cheat activated: Full Ammo",
          10,
          70,
          5000
        )
      }
      break

    case "weapons":
      // Give all weapons
      handleWeaponsCheatSystem(scene)
      showTopLeftOverlayText(
        scene,
        "Cheat activated: All Weapons",
        10,
        70,
        5000
      )
      break

    default:
      showTopLeftOverlayText(scene, `Unknown cheat code: ${code}`, 10, 70, 3000)
      break
  }
}

export function handleWeaponsCheatSystem(scene: MyGame) {
  const pistonSprite = SpawnPistol(scene, 0, 0)
  const smgSprite = SpawnSMG(scene, 0, 0)
  const shotgunSprite = SpawnShotgun(scene, 0, 0)
  const rocketLauncherSprite = SpawnRocketLauncher(scene, 0, 0)

  const gunSprites = [
    pistonSprite,
    smgSprite,
    shotgunSprite,
    rocketLauncherSprite,
  ]

  if (scene.weaponCheatActivation.sprite) {
    scene.weaponCheatActivation.sprite.destroy()
  }

  if (scene.weaponCheatActivation.status === false) {
    scene.weaponCheatActivation = {
      status: true,
      index: 0,
      sprite: gunSprites[0],
    }
  } else {
    // If already activated, cycle through weapons
    scene.weaponCheatActivation.index =
      (scene.weaponCheatActivation.index + 1) % 4
    scene.weaponCheatActivation.sprite =
      gunSprites[scene.weaponCheatActivation.index]
  }

  scene.canPickupGun = true
  handleGunPickup(scene, gunSprites[scene.weaponCheatActivation.index])
}
