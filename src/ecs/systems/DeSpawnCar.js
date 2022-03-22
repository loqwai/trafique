import { System } from 'ecsy'
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

    const car = entity.getComponent(Car)
    if (car.position.y < bottom) return

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