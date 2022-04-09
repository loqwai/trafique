import { System, World } from 'ecsy'
import { flatten } from 'ramda'
import { Car } from '../components/Car'
import { Intersection } from '../components/Intersection'
import { sample } from '../../utils/sample'
import { SightArc } from '../components/SightArc'
import { Position } from '../components/Position'
import { Rotation } from '../components/Rotation'
import { Observer } from '../components/Observer'

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
    const { position, velocity, rotation } = this._newSpawnPoint()

    this.world.createEntity()
      .addComponent(Car, { velocity })
      .addComponent(Position, { value: position })
      .addComponent(Rotation, { value: rotation })
      .addComponent(SightArc, { arc: Math.PI, distance: 160 })
      .addComponent(Observer)
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