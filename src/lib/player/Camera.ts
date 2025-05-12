import { MyGame } from "../MyGame";

export function cameraFollowPlayer(scene: MyGame, map: Phaser.Tilemaps.Tilemap) {
  scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
  scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
  scene.cameras.main.startFollow(scene.PlayerParent, true, 0.08, 0.08)
}

// const map = scene.make.tilemap({ key: "map" })
