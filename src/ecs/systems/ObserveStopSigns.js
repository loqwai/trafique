import { System } from 'ecsy'
import { System as CollissionSystem } from 'detect-collisions'

import { Observation } from '../types/Observation'
import { normalizeAngle } from '../../utils/normalizeAngle'
import { SightArc } from '../components/SightArc'
import { Position } from '../components/Position'
import { Observer } from '../components/Observer'
import { Rotation } from '../components/Rotation'

export class ObserveStopSigns extends System {
  #detector = new CollissionSystem()
  #collidersByObserver = new Map()
  #observersByCollider = new Map()

  execute() {
    this.queries.observers.results.forEach(this.#ensureCollider)
    this.#observersByCollider.forEach(this.#updateCollider)

    this.#detector.update()
    this.#detector.checkAll(this.#handleCollision)
  }

  #handleCollision = (collision) => {
    const a = this.#observersByCollider.get(collision.a)
    const b = this.#observersByCollider.get(collision.b)

    if (!this.#isInArc(a, b)) return
    if (!this.#isInArc(b, a)) return

    const { distance } = a.getComponent(SightArc)

    a.getMutableComponent(Observer).observations.push(new Observation({
      event: 'see-stop-sign',
      distance: distance - collision.overlap,
    }))
  }

  #isInArc = (a, b) => {
    const { arc } = a.getComponent(SightArc)
    const { value: rotation } = a.getComponent(Rotation)

    const { value: aPosition } = a.getComponent(Position)
    const { value: bPosition } = b.getComponent(Position)

    const beginArc = rotation - arc / 2
    const endArc = rotation + arc / 2

    const { x: dx, y: dy } = bPosition.subtract(aPosition)

    const angle = normalizeAngle(Math.atan2(dy, dx))

    return beginArc <= angle && angle <= endArc
  }

  #ensureCollider = (entity) => {
    if (this.#collidersByObserver.has(entity)) return

    const { distance } = entity.getComponent(SightArc)
    const { value: position } = entity.getComponent(Position)

    const collider = this.#detector.createCircle(position.toJSON(), distance)
    this.#collidersByObserver.set(entity, collider)
    this.#observersByCollider.set(collider, entity)
  }

  #updateCollider = (entity, collider) => {
    if (!entity.alive) {
      this.#detector.remove(collider)
      this.#observersByCollider.delete(collider)
      this.#collidersByObserver.delete(entity)
      return
    }

    const { value: { x, y } } = entity.getComponent(Position)
    collider.setPosition(x, y)
  }
}

ObserveStopSigns.queries = {
  observers: { components: [Observer, Position, Rotation, SightArc] },
}
