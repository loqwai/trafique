import { System, World } from 'ecsy'
import { flatten } from 'ramda'
import { Car } from '../components/Car'
import { Intersection } from '../components/Intersection'
import { sample } from '../../utils/sample'

/**
 * @typedef {object} Options
 * @property {number} interval
 */
export class SpawnCar extends System {
  #interval = 0
  #lastSpawn = 0
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
    const entity = this.world.createEntity(`Car ${this.queries.cars.results.length}`)
    entity.addComponent(Car)

    const car = entity.getMutableComponent(Car)
    const { position, velocity, rotation } = this._newSpawnPoint(car)
    car.position = position
    car.velocity = velocity
    car.rotation = rotation
  }

  _newSpawnPoint = () => {
    const spawnPoints = flatten(this.queries.intersection.results.map(e => e.getComponent(Intersection).getSpawnPoints()))
    return sample(spawnPoints)
  }
}

SpawnCar.queries = {
  intersection: {
    components: [Intersection],
  },
  cars: {
    components: [Car],
  },
}