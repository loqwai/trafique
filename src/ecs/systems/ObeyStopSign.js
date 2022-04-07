import { System, Not } from 'ecsy'
import { System as CollissionSystem } from 'detect-collisions'

import { Car } from '../components/Car'
import { RadialSensor } from '../components/RadialSensor'
import { StopSign } from '../components/StopSign'
import { Observation } from '../types/Observation'
import { normalizeAngle } from '../../utils/normalizeAngle'

export class ObeyStopSign extends System {
  constructor(world) {
    super(world)
    this.world = world
    this.detector = new CollissionSystem()

    this.carSensors = new Map()
    this.stopSignSensors = new Map()
  }

  execute() {
    this.queries.carsAdded.results.forEach(this._addRadialSensorToCar)
    this.queries.carsRemoved.results.forEach(this._removeRadialSensorFromCar)
    this.queries.cars.results.forEach(this._updateRadialSensorOnCar)

    this.queries.stopSignsAdded.results.forEach(this._addRadialSensorToStopSign)
    this.queries.stopSignsRemoved.results.forEach(this._removeRadialSensorFromStopSign)
    this.queries.stopSigns.results.forEach(this._updateRadialSensorOnStopSign)

    this.detector.update()
    this.detector.checkAll(this._handleCollision)
  }

  _addRadialSensorToCar = (entity) => {
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

  _removeRadialSensorFromCar = (entity) => {
    const { collider } = entity.getComponent(RadialSensor)

    this.detector.remove(collider)
    entity.removeComponent(RadialSensor)
    this.carSensors.delete(collider)
  }

  _updateRadialSensorOnCar = (entity) => {
    const { position, rotation, sightDistance, sightArc } = entity.getComponent(Car)
    const radialSensor = entity.getMutableComponent(RadialSensor)
    radialSensor.collider.setPosition(position.x, position.y)
    radialSensor.position = position.clone()
    radialSensor.radius = sightDistance
    radialSensor.arc = sightArc
    radialSensor.rotation = rotation
  }

  _addRadialSensorToStopSign = (entity) => {
    const stopSign = entity.getComponent(StopSign)
    const position = stopSign.position.toJSON()
    const collider = this.detector.createCircle(position, stopSign.radius)

    entity.addComponent(RadialSensor, { collider, radius: stopSign.radius, position: stopSign.position })
    this.stopSignSensors.set(collider, entity)
  }

  _removeRadialSensorFromStopSign = (entity) => {
    const { collider } = entity.getComponent(RadialSensor)

    this.detector.remove(collider)
    entity.removeComponent(RadialSensor)
    this.stopSignSensors.delete(collider)
  }

  _updateRadialSensorOnStopSign = (entity) => {
    const { position, radius } = entity.getComponent(StopSign)
    const radialSensor = entity.getMutableComponent(RadialSensor)
    radialSensor.collider.setPosition(position.x, position.y)
    radialSensor.position = position.clone()
    radialSensor.radius = radius
  }

  _handleCollision = (collision) => {
    if (!this.carSensors.has(collision.a)) return // it was probably a stop sign, and they don't really obey things
    if (!this.stopSignSensors.has(collision.b)) return // it probably saw another car

    const car = this.carSensors.get(collision.a).getMutableComponent(Car)
    const stopSign = this.stopSignSensors.get(collision.b).getComponent(StopSign)

    const beginArc = car.rotation - car.sightArc / 2
    const endArc = car.rotation + car.sightArc / 2

    // const dy = stopSign.position.y - car.position.y

    const { x: dx, y: dy } = stopSign.position.subtract(car.position)

    const angle = normalizeAngle(Math.atan2(dy, dx))

    if (angle < beginArc || endArc < angle) return // the car is not in the arc of the stop sign

    car.observations.push(new Observation({
      event: 'see-stop-sign',
      distance: car.sightDistance - collision.overlap,
    }))
  }
}

ObeyStopSign.queries = {
  carsAdded: { components: [Car, Not(RadialSensor)] },
  carsRemoved: { components: [Not(Car), RadialSensor, Not(StopSign)] },
  cars: { components: [Car, RadialSensor] },

  stopSignsAdded: { components: [StopSign, Not(RadialSensor)] },
  stopSignsRemoved: { components: [Not(StopSign), RadialSensor, Not(Car)] },
  stopSigns: { components: [StopSign, RadialSensor] },
}
