import EasyStar from "easystarjs"
import { MyGame } from "../MyGame"

export function SetupEasyStar(scene: MyGame) {
  const easystar = new EasyStar.js()
  const tileSize = scene.map.tileWidth
  const width = scene.map.width
  const height = scene.map.height

  const grid: number[][] = []

  for (let y = 0; y < height; y++) {
    grid[y] = []
    for (let x = 0; x < width; x++) {
      const roadTile = scene.map.getTileAt(x, y, false, "Road")

      // Only road tiles are walkable (0). Everything else is blocked (1)
      grid[y][x] = roadTile ? 0 : 1
    }
  }

  easystar.setGrid(grid)
  easystar.setAcceptableTiles([0]) // Only tiles marked 0 are walkable
  easystar.enableDiagonals() // Optional: allow diagonal walking

  scene.easystar = easystar

  return grid
}
