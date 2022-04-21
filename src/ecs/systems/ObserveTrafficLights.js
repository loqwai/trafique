import { System } from 'ecsy'
import { System as CollissionSystem } from 'detect-collisions'

import { Observation } from '../types/Observation'
import { normalizeAngle } from '../../utils/normalizeAngle'
import { SightArc } from '../components/SightArc'
import { Position } from '../components/Position'
import { Observer } from '../components/Observer'
import { Rotation } from '../components/Rotation'
import { Car } from '../components/Car'
import { TrafficLight } from '../components/TrafficLight'

export class ObserveTrafficLights extends System {
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

    if (!a.hasComponent(Car)) return
    if (!b.hasComponent(TrafficLight)) return

    if (!this.#isInArc(a, b)) return
    if (!this.#isInArc(b, a)) return

    const { distance } = a.getComponent(SightArc)
    const { state } = b.getComponent(TrafficLight)

    if (state === 'green') return

    const event = state === 'red' ? 'see-red-traffic-light' : 'see-yellow-traffic-light'

    a.getMutableComponent(Observer).observations.push(new Observation({
      event,
      distance: distance - collision.overlap,
      meta: {
        trafficLightState: state,
      },
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
    if (!entity.hasComponent(TrafficLight) && !entity.hasComponent(Car)) return

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

ObserveTrafficLights.queries = {
  observers: { components: [Observer, Position, Rotation, SightArc] },
}
