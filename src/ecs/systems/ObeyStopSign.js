import { System, Not } from 'ecsy'
import { System as CollissionSystem } from 'detect-collisions'

import { Car } from '../components/Car'
import { RadialSensor } from '../components/RadialSensor'
import { StopSign } from '../components/StopSign'
import { Observation } from '../types/Observation'
import { closeTo } from '../../utils/closeTo'

export class ObeyStopSign extends System {
  constructor(world) {
    super(world)
    this.world = world
    this.detector = new CollissionSystem()
  }

  execute() {
    this.queries.carsAdded.results.forEach(this._addRadialSensorToCar)
    this.queries.carsRemoved.results.forEach(this._removeRadialSensor)
    this.queries.cars.results.forEach(this._updateRadialSensorOnCar)

    this.queries.stopSignsAdded.results.forEach(this._addRadialSensorToStopSign)
    this.queries.stopSignsRemoved.results.forEach(this._removeRadialSensor)
    this.queries.stopSigns.results.forEach(this._updateRadialSensorOnStopSign)

    this.detector.update()
    this.detector.checkAll(this._handleCollision)
  }

  _addRadialSensorToCar = (entity) => {
    const car = entity.getComponent(Car)
    const position = car.position.toJSON()
    const collider = this.detector.createCircle(position, car.sightDistance)

    entity.addComponent(RadialSensor, { collider, radius: car.sightDistance, position: car.position })
  }

  _updateRadialSensorOnStopSign = (entity) => {
    const { position, radius } = entity.getComponent(StopSign)
    const radialSensor = entity.getMutableComponent(RadialSensor)
    radialSensor.collider.setPosition(position.x, position.y)
    radialSensor.position = position.clone()
    radialSensor.radius = radius
  }

  _addRadialSensorToStopSign = (entity) => {
    const stopSign = entity.getComponent(StopSign)
    const position = stopSign.position.toJSON()
    const collider = this.detector.createCircle(position, stopSign.radius)

    entity.addComponent(RadialSensor, { collider, radius: stopSign.radius, position: stopSign.position })
  }

  _removeRadialSensor = (entity) => {
    const { collider } = entity.getComponent(RadialSensor)

    this.detector.remove(collider)
    entity.removeComponent(RadialSensor)
  }

  _updateRadialSensorOnCar = (entity) => {
    const { position, sightDistance } = entity.getComponent(Car)
    const radialSensor = entity.getMutableComponent(RadialSensor)
    radialSensor.collider.setPosition(position.x, position.y)
    radialSensor.position = position.clone()
    radialSensor.radius = sightDistance
  }

  _handleCollision = (collision) => {
    const entity = this.queries.cars.results.find(e => e.getComponent(RadialSensor).collider === collision.a)

    if (!entity) return // it was probably a stop sign

    const car = entity.getMutableComponent(Car)
    const stopSignEntity = this.queries.stopSigns.results.find(e => e.getComponent(RadialSensor).collider === collision.b)

    if (!stopSignEntity) return // it was probably another car. Need to do a real hemisphere detection

    const stopSign = stopSignEntity.getComponent(StopSign)

    const distance = car.sightDistance - collision.overlap

    if (stopSign.locationName === 'northBound' && closeTo(car.rotation, Math.PI, 0.1)) {
      car.observations.push(new Observation({ event: 'see-stop-sign', distance }))
      return
    }

    if (stopSign.locationName === 'southBound' && closeTo(car.rotation, 0, 0.1)) {
      car.observations.push(new Observation({ event: 'see-stop-sign', distance }))
      return
    }
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
