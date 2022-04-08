import { System, Not } from 'ecsy'
import { System as CollissionSystem } from 'detect-collisions'

import { Car } from '../components/Car'
import { RadialSensor } from '../components/RadialSensor'
import { StopSign } from '../components/StopSign'
import { Observation } from '../types/Observation'
import { normalizeAngle } from '../../utils/normalizeAngle'

export class RecordObservations extends System {
  constructor(world) {
    super(world)
    this.world = world
    this.detector = new CollissionSystem()

    this.carSensors = new Map()
    this.stopSignSensors = new Map()
  }

  execute() {
    this.queries.carsAdded.results.forEach(this.#addRadialSensorToCar)
    this.queries.carsRemoved.results.forEach(this.#removeRadialSensorFromCar)
    this.queries.cars.results.forEach(this.#updateRadialSensorOnCar)

    this.queries.stopSignsAdded.results.forEach(this.#addRadialSensorToStopSign)
    this.queries.stopSignsRemoved.results.forEach(this.#removeRadialSensorFromStopSign)
    this.queries.stopSigns.results.forEach(this.#updateRadialSensorOnStopSign)

    this.detector.update()
    this.detector.checkAll(this.#handleCollision)
  }

  #handleCollision = (collision) => {
    if (this.#isCarSeesStopSign(collision)) {
      this.handleStopSignObservation(collision)
      return
    }
  }

  #isCarSeesStopSign = (collision) => this.carSensors.has(collision.a) && this.stopSignSensors.has(collision.b)

  handleStopSignObservation = (collision) => {
    const car = this.carSensors.get(collision.a).getMutableComponent(Car)
    const stopSign = this.stopSignSensors.get(collision.b).getComponent(StopSign)

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

  #addRadialSensorToCar = (entity) => {
    const car = entity.getComponent(Car)
    const position = car.position.toJSON()
    const collider = this.detector.createCircle(position, car.sightDistance)

    entity.addComponent(RadialSensor, {
      collider,
      position: car.position,
      rotation: car.rotation,
      radius: car.sightDistance,
      arc: car.sightArc,
    })

    this.carSensors.set(collider, entity)
  }

  #removeRadialSensorFromCar = (entity) => {
    const { collider } = entity.getComponent(RadialSensor)

    this.detector.remove(collider)
    entity.removeComponent(RadialSensor)
    this.carSensors.delete(collider)
  }

  #updateRadialSensorOnCar = (entity) => {
    const { position, rotation, sightDistance, sightArc } = entity.getComponent(Car)
    const radialSensor = entity.getMutableComponent(RadialSensor)
    radialSensor.collider.setPosition(position.x, position.y)
    radialSensor.position = position.clone()
    radialSensor.radius = sightDistance
    radialSensor.arc = sightArc
    radialSensor.rotation = rotation
  }

  #addRadialSensorToStopSign = (entity) => {
    const stopSign = entity.getComponent(StopSign)
    const position = stopSign.position.toJSON()
    const collider = this.detector.createCircle(position, stopSign.radius)

    entity.addComponent(RadialSensor, { collider, radius: stopSign.sightDistance, position: stopSign.position, arc: stopSign.sightArc })
    this.stopSignSensors.set(collider, entity)
  }

  #removeRadialSensorFromStopSign = (entity) => {
    const { collider } = entity.getComponent(RadialSensor)

    this.detector.remove(collider)
    entity.removeComponent(RadialSensor)
    this.stopSignSensors.delete(collider)
  }

  #updateRadialSensorOnStopSign = (entity) => {
    const { position, sightDistance, sightArc, rotation } = entity.getComponent(StopSign)
    const radialSensor = entity.getMutableComponent(RadialSensor)
    radialSensor.collider.setPosition(position.x, position.y)
    radialSensor.position = position.clone()
    radialSensor.radius = sightDistance
    radialSensor.arc = sightArc
    radialSensor.rotation = rotation
  }
}

RecordObservations.queries = {
  carsAdded: { components: [Car, Not(RadialSensor)] },
  carsRemoved: { components: [Not(Car), RadialSensor, Not(StopSign)] },
  cars: { components: [Car, RadialSensor] },

  stopSignsAdded: { components: [StopSign, Not(RadialSensor)] },
  stopSignsRemoved: { components: [Not(StopSign), RadialSensor, Not(Car)] },
  stopSigns: { components: [StopSign, RadialSensor] },
}
