import EasyStar from "easystarjs"
import { createGridFromLayer } from "../HelperFunctions"
import { MyGame } from "../MyGame"

export function SetupEasyStar(
  scene: MyGame,
  acceptableLayer: Phaser.Tilemaps.TilemapLayer
) {
  scene.easystar = new EasyStar.js()

  const grid = createGridFromLayer(acceptableLayer!)

  scene.easystar.setGrid(grid)
  scene.easystar.setAcceptableTiles([0])
  scene.easystar.enableDiagonals()

  return grid
}
