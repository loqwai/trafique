import { System } from 'ecsy'
import { Car } from '../components/Car'

/**
 * @typedef {object} Options
 * @property {number} interval
 */
export class DeSpawnCar extends System {
  execute = (_delta, time) => {
    this.queries.cars.results.forEach(this._maybeDeSpawn)
  }

  _maybeDeSpawn = (entity) => {
    const car = entity.getComponent(Car)
    if (car.y < 800) return

    entity.remove()
  }
}

DeSpawnCar.queries = {
  cars: {
    components: [Car],
  },
}