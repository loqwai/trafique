import { normalizeAngle } from './normalizeAngle'

export const rotationCloseTo = (a, b, epsilon) => {
  const na = normalizeAngle(a)
  const nb = normalizeAngle(b)
  return Math.abs(na - nb) < epsilon
}
