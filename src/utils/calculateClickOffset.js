
export const calculateClickOffset = ({ width, height, x, y }) => {
  const factor = Math.min(width, height)
  const scale = factor / 1000
  const offsetX = factor === width ? 0 : (width - height) / 2
  const offsetY = factor === height ? 0 : (height - width) / 2

  return { x:  (x - offsetX) / scale, y:  (y - offsetY) / scale }
}