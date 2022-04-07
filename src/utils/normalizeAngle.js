export const normalizeAngle = (angle) => {
  if (angle < 0) {
    const n = 1 + Math.floor(-angle / (Math.PI * 2))
    angle = angle + (n * Math.PI * 2)
  }

  return angle % (Math.PI * 2)
}