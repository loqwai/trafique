import { System } from 'ecsy'
import { closeTo } from '../../utils/closeTo'
import { Car } from '../components/Car'
import { Intersection } from '../components/Intersection'

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

    const bottom = intersection.center.y + intersection.streetLength + intersection.laneWidth
    const top = intersection.center.y - intersection.streetLength - intersection.laneWidth
    const left = intersection.center.x - intersection.streetLength - intersection.laneWidth
    const right = intersection.center.x + intersection.streetLength + intersection.laneWidth

    const car = entity.getComponent(Car)
    if (closeTo(car.rotation, 0, 0.1) && car.position.y < bottom) return // going down
    if (closeTo(car.rotation, Math.PI, 0.1) && car.position.y > top) return // going up
    if (closeTo(car.rotation, Math.PI / 2, 0.1) && car.position.x < right) return // going right
    if (closeTo(car.rotation, 3 * Math.PI / 2, 0.1) && car.position.x > left) return // going left

    entity.remove()
  }
}

DeSpawnCar.queries = {
  cars: {
    components: [Car],
  },
  intersection: {
    components: [Intersection],
  },
}