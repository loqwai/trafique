import { System, World } from 'ecsy'
import { Car } from '../components/Car'
import { Intersection } from '../components/Intersection'
import { Vector2 } from '../types/Vector2'

/**
 * @typedef {object} Options
 * @property {number} interval
 */
export class SpawnCar extends System {
  #interval = 0
  #lastSpawn = 0
  #spawnedCount = 0
  /**
   * @param {World} world
   * @param {Options} options
   */
  constructor(world, { interval }) {
    super(world, { interval })
    this.#interval = interval
  }

  execute = (_delta, time) => {
    if (time - this.#lastSpawn > this.#interval) {
      this.#lastSpawn = time
      this._spawnCar()
    }
  }

  _spawnCar = () => {
    const entity = this.world.createEntity(`Car ${this.#spawnedCount}`)
    entity.addComponent(Car)

    const car = entity.getMutableComponent(Car)
    car.position = this._newSpawnPoint(car)
    this.#spawnedCount++
  }

  _newSpawnPoint = (car) => {
    const { center, streetLength, laneWidth } = this.queries.intersection.results[0].getComponent(Intersection)

    const yOffset = (streetLength + laneWidth + car.height)

    return new Vector2(
      center.x - (laneWidth / 2 + car.width / 2),
      // center.y + (Math.random() > 0.5 ? yOffset : -yOffset),
      center.y + -yOffset,
    )
  }
}

SpawnCar.queries = {
  intersection: {
    components: [Intersection],
  },
}