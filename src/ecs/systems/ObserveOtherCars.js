import { System } from 'ecsy'
import { System as CollissionSystem } from 'detect-collisions'

import { Observation } from '../types/Observation'
import { Vector2 } from '../types/Vector2'

import { Car } from '../components/Car'
import { Observer } from '../components/Observer'
import { Position } from '../components/Position'
import { Rotation } from '../components/Rotation'
import { SightArc } from '../components/SightArc'
import { drawCollider } from '../../utils/drawCollider'

export class ObserveOtherCars extends System {
  #detector = new CollissionSystem()
  #collidersByObserver = new Map()
  #observersByCollider = new Map()
  #ctx

  constructor(world, { canvas }) {
    super(world)

    this.#ctx = canvas.getContext('2d')
  }

  execute() {
    this.queries.observers.results.forEach(this.#ensureCollider)
    this.#observersByCollider.forEach(this.#updateCollider)

    this.#detector.update()
    this.#detector.checkAll(this.#handleCollision)
  }

  #handleCollision = (collision) => {
    const a = this.#observersByCollider.get(collision.a)
    const b = this.#observersByCollider.get(collision.b)

    if (!this.#isInPath(a, b)) return

    const { distance } = a.getComponent(SightArc)

    a.getMutableComponent(Observer).observations.push(new Observation({
      event: 'see-other-car',
      distance: distance - collision.overlap,
    }))
  }

  #isInPath = (a, b) => {
    const { distance } = a.getComponent(SightArc)

    const aCar = a.getComponent(Car)
    const bCar = b.getComponent(Car)

    const { value: aPosition } = a.getComponent(Position)
    const { value: bPosition } = b.getComponent(Position)

    const { value: aRotation } = a.getComponent(Rotation)
    const { value: bRotation } = b.getComponent(Rotation)

    const detector = new CollissionSystem()
    const offset = new Vector2(Math.cos(aRotation), Math.sin(aRotation)).scalarMultiply(distance)
    const target = aPosition.add(offset)

    const aOffset = new Vector2(-aCar.width / 2, -aCar.height / 2)
    const aCollider = detector
      .createBox(target.toJSON(), aCar.width, distance)
      .translate(aOffset.x, aOffset.y)
      .setAngle((Math.PI / 2) + aRotation)

    const bOffset = new Vector2(-bCar.width / 2, -bCar.height / 2).toJSON()
    const bCollider = detector
      .createBox(bPosition.toJSON(), bCar.width, bCar.height)
      .translate(bOffset.x, bOffset.y)
      .setAngle((Math.PI / 2) + bRotation)

    drawCollider(this.#ctx, aCollider, '#ff7777')
    drawCollider(this.#ctx, bCollider, '#7777ff')

    const collision = Boolean(detector.checkCollision(aCollider, bCollider))
    detector.clear()
    return collision
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

ObserveOtherCars.queries = {
  observers: { components: [Car, Observer, Position, Rotation, SightArc] },
}
