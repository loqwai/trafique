import { System } from 'ecsy'
import { Car } from '../components/Car'

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
    const car = this.world.createEntity(`Car ${this.#spawnedCount}`)
    car.addComponent(Car, {
      x: 400,
      y: -100,
    })
    this.#spawnedCount++
  }
}