// components/PhaserGame.js
"use client"

import * as Phaser from "phaser"
import { useEffect, useRef, useState } from "react"
import { MyGame } from "../lib/MyGame"
import MenuScreen from "./MenuScreen"

type GameStates = "menu" | "gameplay"

export default function PhaserGame() {
  const gameRef = useRef<Phaser.Game | null>(null)
  const [currentGameState, setCurrentGameState] = useState<GameStates>("menu")

  // Create the Phaser game only when the state is 'gameplay'
  useEffect(() => {
    if (currentGameState !== "gameplay" || gameRef.current) return

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      dom: {
        createContainer: true,
      },
      scene: [MyGame],
      parent: "phaser-container",
    }

    gameRef.current = new Phaser.Game(config)

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      if (gameRef.current) {
        gameRef.current.scale.resize(width, height)

        const scene = gameRef.current.scene.getAt(0)
        if (scene?.cameras?.main) {
          scene.cameras.main.setSize(width, height)
        }
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [currentGameState])

  if (currentGameState === "menu") {
    return (
      <MenuScreen
        onStartGame={() => {
          setCurrentGameState("gameplay")
        }}
      />
    )
  }

  return <div id="phaser-container" className="w-full h-screen" />
}
