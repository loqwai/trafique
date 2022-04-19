import { Vector2 } from '../ecs/types/Vector2'
import { calculateTransform } from './calculateTransform'

export const drawCollider = (ctx, collider, color) => {
  const points = collider.points

  const { x, y } = new Vector2(collider.pos).add(collider.offset).toJSON()
  const { scale, offsetX, offsetY } = calculateTransform(ctx.canvas)

  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY)
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.translate(x, y)
  ctx.rotate(collider.angle)
  ctx.beginPath()
  points.forEach(point => ctx.lineTo(point.x, point.y))
  ctx.closePath()
  ctx.stroke()
}