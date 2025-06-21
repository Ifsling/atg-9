import { SpawnableLocationsInGridCount } from "./ConstantsAndTypes"

export function getRandomSpawnLocation() {
  const randNum = Math.floor(
    Math.random() * SpawnableLocationsInGridCount.length
  )
  const randGridPoint = SpawnableLocationsInGridCount[randNum]

  return {
    x: (randGridPoint.x - 1) * 300 + 150,
    y: (randGridPoint.y - 1) * 300 + 150,
  }
}

export function getRandomSpawnLocationWithinRadius(
  x: number,
  y: number,
  radius: number
) {
  const randomPointsWithinReach = SpawnableLocationsInGridCount.filter(
    (roadPoint) => {
      // Convert grid coordinates to world coordinates
      const { x: gridX, y: gridY } = gridToWorldCoordinates(
        roadPoint.x,
        roadPoint.y
      )

      const distance = calculateDistance({ x, y }, { x: gridX, y: gridY })
      return distance <= radius
    }
  )

  if (randomPointsWithinReach.length === 0) {
    return { x: 0, y: 0 }
  }

  const randNum = Math.floor(Math.random() * randomPointsWithinReach.length)
  const randGridPoint = randomPointsWithinReach[randNum]

  return {
    x: (randGridPoint.x - 1) * 300 + 150,
    y: (randGridPoint.y - 1) * 300 + 150,
  }
}

export function calculateDistance(
  point1: { x: number; y: number },
  point2: { x: number; y: number }
) {
  const dx = point1.x - point2.x
  const dy = point1.y - point2.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function gridToWorldCoordinates(
  gridX: number,
  gridY: number
): { x: number; y: number } {
  return {
    x: (gridX - 1) * 300 + 150,
    y: (gridY - 1) * 300 + 150,
  }
}
