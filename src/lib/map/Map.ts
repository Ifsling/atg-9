export function createMap(scene: Phaser.Scene) {
  const map = scene.make.tilemap({ key: "map" })
  const tileset = map.addTilesetImage(
    map.tilesets[0]?.name || "tileset",
    "tileset"
  )
  if (!tileset) throw new Error("Failed to load tileset")

  const backgroundLayer = map
    .createLayer("Ground", tileset, 0, 0)
    ?.setScale(1.5)

  const houses =
    map.getLayerIndex("Houses") !== null
      ? map.createLayer("Houses", tileset, 0, 0)?.setScale(1.5)
      : null
  const roads =
    map.getLayerIndex("Road") !== null
      ? map.createLayer("Road", tileset, 0, 0)?.setScale(1.5)
      : null
  const water =
    map.getLayerIndex("Water") !== null
      ? map.createLayer("Water", tileset, 0, 0)?.setScale(1.5)
      : null

  houses?.setCollisionBetween(0, 43)
  water?.setCollisionBetween(0, 43)

  return { map, tileset, houses, roads, backgroundLayer, water }
}
