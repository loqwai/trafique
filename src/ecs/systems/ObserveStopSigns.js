import { System } from 'ecsy'
import { System as CollissionSystem } from 'detect-collisions'

import { Car } from '../components/Car'
import { RadialSensor } from '../components/RadialSensor'
import { StopSign } from '../components/StopSign'
import { Observation } from '../types/Observation'
import { normalizeAngle } from '../../utils/normalizeAngle'

export class ObserveStopSigns extends System {
  constructor(world) {
    super(world)
    this.world = world
    this.detector = new CollissionSystem()

    this.carsByCollider = new Map()
    this.collidersByCar = new Map()
    this.stopSignsByCollider = new Map()
    this.collidersByStopSign = new Map()
  }

  execute() {
    this.queries.cars.results.forEach(this.#ensureCarCollider)
    this.carsByCollider.forEach(this.#cleanupCarCollider)
    this.carsByCollider.forEach(this.#updateCarCollider)

    this.queries.stopSigns.results.forEach(this.#ensureStopSignCollider)
    this.stopSignsByCollider.forEach(this.#cleanupStopSignCollider)
    this.stopSignsByCollider.forEach(this.#updateStopSignCollider)

    this.detector.update()
    this.detector.checkAll(this.#handleCollision)
  }

  #handleCollision = (collision) => {
    if (this.#isCarSeesStopSign(collision)) {
      this.#handleStopSignObservation(collision)
      return
    }
  }

  #isCarSeesStopSign = (collision) => this.carsByCollider.has(collision.a) && this.stopSignsByCollider.has(collision.b)

  #handleStopSignObservation = (collision) => {
    const car = this.carsByCollider.get(collision.a).getMutableComponent(Car)
    const stopSign = this.stopSignsByCollider.get(collision.b).getComponent(StopSign)

    if (!this.#isStopSignInCarSightArc(car, stopSign)) return
    if (!this.#isCarInStopSignSightArc(car, stopSign)) return

    car.observations.push(new Observation({
      event: 'see-stop-sign',
      distance: car.sightDistance - collision.overlap,
    }))
  }

  #isStopSignInCarSightArc = (car, stopSign) => {
    const beginArc = car.rotation - car.sightArc / 2
    const endArc = car.rotation + car.sightArc / 2

    const { x: dx, y: dy } = stopSign.position.subtract(car.position)

    const angle = normalizeAngle(Math.atan2(dy, dx))

    return beginArc < angle && angle < endArc
  }

  #isCarInStopSignSightArc = (car, stopSign) => {
    const beginArc = stopSign.rotation - stopSign.sightArc / 2
    const endArc = stopSign.rotation + stopSign.sightArc / 2

    const { x: dx, y: dy } = car.position.subtract(stopSign.position)

    const angle = normalizeAngle(Math.atan2(dy, dx))

    return beginArc < angle && angle < endArc
  }

  #ensureCarCollider = (entity) => {
    if (this.collidersByCar.has(entity)) return

    const car = entity.getComponent(Car)
    const position = car.position.toJSON()
    const collider = this.detector.createCircle(position, car.sightDistance)
    this.collidersByCar.set(entity, collider)
    this.carsByCollider.set(collider, entity)
  }

  #cleanupCarCollider = (entity, collider) => {
    if (entity.alive && entity.hasComponent(RadialSensor)) return

    this.detector.remove(collider)
    this.carsByCollider.delete(collider)
    this.collidersByCar.delete(entity)
  }

  #updateCarCollider = (entity, collider) => {
    const { position } = entity.getComponent(Car)
    collider.setPosition(position.x, position.y)
  }

  #ensureStopSignCollider = (entity) => {
    if (this.collidersByStopSign.has(entity)) return

    const stopSign = entity.getComponent(StopSign)
    const position = stopSign.position.toJSON()
    const collider = this.detector.createCircle(position, stopSign.sightDistance)

    this.collidersByStopSign.set(entity, collider)
    this.stopSignsByCollider.set(collider, entity)
  }

  #cleanupStopSignCollider = (entity, collider) => {
    if (entity.alive && entity.hasComponent(RadialSensor)) return

    this.detector.remove(collider)
    this.stopSignsByCollider.delete(collider)
    this.collidersByStopSign.delete(entity)
  }

  #updateStopSignCollider = (entity, collider) => {
    const { position } = entity.getComponent(StopSign)
    collider.setPosition(position.x, position.y)
  }
}

ObserveStopSigns.queries = {
  cars: { components: [Car, RadialSensor] },
  stopSigns: { components: [StopSign, RadialSensor] },
}
