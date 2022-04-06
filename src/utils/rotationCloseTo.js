

export const normalizeRotation = (rotation) => {
  let n = (rotation < 0)
    ? 1 + Math.floor(-rotation / (Math.PI * 2))
    : 1

  return (rotation + (n * Math.PI)) % (Math.PI * 2)
}
export const rotationCloseTo = (a, b, epsilon) => {
  const na = normalizeRotation(a)
  const nb = normalizeRotation(b)
  return Math.abs(na - nb) < epsilon
}
