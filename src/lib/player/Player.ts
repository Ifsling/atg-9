export function handlePlayerMovement(
  player: Phaser.Physics.Arcade.Sprite,
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  speed = 200
) {
  if (!player || !cursors) return

  player.setVelocity(0)

  if (cursors.left.isDown) {
    player.setVelocityX(-speed)
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed)
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-speed)
  } else if (cursors.down.isDown) {
    player.setVelocityY(speed)
  }
}
