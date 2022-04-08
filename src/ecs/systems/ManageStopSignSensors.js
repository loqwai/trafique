import { System, Not } from 'ecsy'

import { Car } from '../components/Car'
import { RadialSensor } from '../components/RadialSensor'
import { StopSign } from '../components/StopSign'

export class ManageStopSignSensors extends System {
  execute() {
    this.queries.stopSignsAdded.results.forEach(this.#addRadialSensorToStopSign)
    this.queries.stopSignsRemoved.results.forEach(this.#removeRadialSensorFromStopSign)
    this.queries.stopSigns.results.forEach(this.#updateRadialSensorOnStopSign)
  }

  #addRadialSensorToStopSign = (entity) => {
    const stopSign = entity.getComponent(StopSign)

    entity.addComponent(RadialSensor, {
      position: stopSign.position,
      rotation: stopSign.rotation,
      radius: stopSign.sightDistance,
      arc: stopSign.sightArc,
    })
  }

  #removeRadialSensorFromStopSign = (entity) => {
    entity.removeComponent(RadialSensor)
  }

  #updateRadialSensorOnStopSign = (entity) => {
    const { position, rotation, sightDistance, sightArc } = entity.getComponent(StopSign)
    const radialSensor = entity.getMutableComponent(RadialSensor)
    radialSensor.position = position.clone()
    radialSensor.radius = sightDistance
    radialSensor.arc = sightArc
    radialSensor.rotation = rotation
  }
}

ManageStopSignSensors.queries = {
  stopSignsAdded: { components: [StopSign, Not(RadialSensor)] },
  stopSignsRemoved: { components: [Not(StopSign), RadialSensor, Not(Car)] },
  stopSigns: { components: [StopSign, RadialSensor] },
}
