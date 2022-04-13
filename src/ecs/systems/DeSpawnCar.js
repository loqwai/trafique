import { System } from 'ecsy'
import { rotationCloseTo } from '../../utils/rotationCloseTo'
import { Car } from '../components/Car'
import { Intersection } from '../components/Intersection'
import { Position } from '../components/Position'
import { Rotation } from '../components/Rotation'

/**
 * @typedef {object} Options
 * @property {number} interval
 */
export class DeSpawnCar extends System {
  execute = (_delta, time) => {
    this.queries.cars.results.forEach(this._maybeDeSpawn)
  }

  _intersection = () => {
    const { center, streetLength, laneWidth } = this.queries.intersection.results[0].getComponent(Intersection)
    return { center, streetLength, laneWidth }
  }

  _maybeDeSpawn = (entity) => {
    const intersection = this._intersection()
    const { value: position } = entity.getComponent(Position)
    const { value: rotation } = entity.getComponent(Rotation)

    const bottom = intersection.center.y + intersection.streetLength + intersection.laneWidth
    const top = intersection.center.y - intersection.streetLength - intersection.laneWidth
    const left = intersection.center.x - intersection.streetLength - intersection.laneWidth
    const right = intersection.center.x + intersection.streetLength + intersection.laneWidth

    if (rotationCloseTo(rotation, Math.PI / 2, 0.1) && position.y < bottom) return // going down
    if (rotationCloseTo(rotation, 3 * Math.PI / 2, 0.1) && position.y > top) return // going up
    if (rotationCloseTo(rotation, 0, 0.1) && position.x < right) return // going right
    if (rotationCloseTo(rotation, Math.PI, 0.1) && position.x > left) return // going left

    entity.remove()
  }
}

DeSpawnCar.queries = {
  cars: {
    components: [Car, Rotation, Position],
  },
  intersection: {
    components: [Intersection],
  },
}