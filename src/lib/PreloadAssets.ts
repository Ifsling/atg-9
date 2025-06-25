import { MyGame } from "./MyGame"

export function preloadAssets(scene: MyGame) {
  scene.load.image("tileset", "/map-elements/tileset.png")
  scene.load.tilemapTiledJSON("map", "/map-elements/tiled-tilemap-json.json")
  scene.load.image("player", "/images/player.png")
  scene.load.image("pistol", "/images/pistol.png")
  scene.load.image("player-with-gun", "/images/player-with-gun.png")
  scene.load.image("bullet", "/images/bullet.png")
  scene.load.image("blood-drop", "/images/blood-drop.png")
  scene.load.image("diamond-shape", "/images/diamond-shape.png")
  scene.load.image("topdown-car", "/images/topdown-car.png")
  scene.load.image("white-circle", "/images/white-circle.png")
  scene.load.image("npc", "/images/npc.png")
  scene.load.audio("bgMusic", "/audio/bg-music.mp3")
  scene.load.image("shotgun", "/images/shotgun.png")
  scene.load.image("sniper", "/images/sniper.png")
  scene.load.image("smg", "/images/smg.png")
  scene.load.image("rocket-launcher", "/images/rocket-launcher.png")
  scene.load.image(
    "rocket-launcher-bullet",
    "/images/rocket-launcher-bullet.png"
  )
  scene.load.image("cop", "/images/cop.png")
  scene.load.image("npc-male", "/images/npc-male.png")
  scene.load.image("npc-female", "/images/npc-female.png")
  scene.load.image("star", "/images/star.png")
  scene.load.image("father", "/images/father.png")
  scene.load.image("enemy-car", "/images/enemy-car.png")
}
