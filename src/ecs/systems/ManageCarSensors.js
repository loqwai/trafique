import { System, Not } from 'ecsy'

import { Car } from '../components/Car'
import { RadialSensor } from '../components/RadialSensor'
import { StopSign } from '../components/StopSign'

export class ManageCarSensors extends System {
  execute() {
    this.queries.carsAdded.results.forEach(this.#addRadialSensorToCar)
    this.queries.carsRemoved.results.forEach(this.#removeRadialSensorFromCar)
    this.queries.cars.results.forEach(this.#updateRadialSensorOnCar)
  }

  #addRadialSensorToCar = (entity) => {
    const car = entity.getComponent(Car)

    entity.addComponent(RadialSensor, {
      position: car.position,
      rotation: car.rotation,
      radius: car.sightDistance,
      arc: car.sightArc,
    })
  }

  #removeRadialSensorFromCar = (entity) => {
    entity.removeComponent(RadialSensor)
  }

  #updateRadialSensorOnCar = (entity) => {
    const { position, rotation, sightDistance, sightArc } = entity.getComponent(Car)
    const radialSensor = entity.getMutableComponent(RadialSensor)
    radialSensor.position = position.clone()
    radialSensor.radius = sightDistance
    radialSensor.arc = sightArc
    radialSensor.rotation = rotation
  }
}

ManageCarSensors.queries = {
  carsAdded: { components: [Car, Not(RadialSensor)] },
  carsRemoved: { components: [Not(Car), RadialSensor, Not(StopSign)] },
  cars: { components: [Car, RadialSensor] },
}
