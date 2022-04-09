import { System, World } from 'ecsy'
import { Car } from '../components/Car'
import { Intersection } from '../components/Intersection'
import { sample } from '../../utils/sample'
import { SightArc } from '../components/SightArc'
import { Position } from '../components/Position'
import { Rotation } from '../components/Rotation'
import { Observer } from '../components/Observer'
import { Vector2 } from '../types/Vector2'

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
      this.#spawnCar()
    }
  }

  #spawnCar = () => {
    const { position, velocity, rotation } = this.#randomSpawnPoint()

    this.world.createEntity()
      .addComponent(Car, { velocity })
      .addComponent(Position, { value: position })
      .addComponent(Rotation, { value: rotation })
      .addComponent(SightArc, { arc: Math.PI, distance: 160 })
      .addComponent(Observer)
  }

  #randomSpawnPoint = () => sample(this.#spawnPoints())

  #spawnPoints = () => this.queries.intersections.results.map(this.#spawnPointsForIntersectionEntity).flat(1)

  #spawnPointsForIntersectionEntity = (entity) => {
    const intersection = entity.getComponent(Intersection)

    return [
      this.#southBoundSpawnPoint(intersection),
      this.#northBoundSpawnPoint(intersection),
      this.#westBoundSpawnPoint(intersection),
      this.#eastBoundSpawnPoint(intersection),
    ]
  }

  #southBoundSpawnPoint = ({ center, laneWidth, streetLength }) => ({
    position: new Vector2({
      x: center.x - (laneWidth / 2),
      y: center.y - streetLength - laneWidth,
    }),
    velocity: new Vector2({
      x: 0,
      y: 5,
    }),
    rotation: Math.PI / 2,
  })

  #northBoundSpawnPoint = ({ center, laneWidth, streetLength }) => ({
    position: new Vector2({
      x: center.x + (laneWidth / 2),
      y: center.y + streetLength + laneWidth,
    }),
    velocity: new Vector2({
      x: 0,
      y: -5,
    }),
    rotation: 3 * Math.PI / 2,
  })

  #westBoundSpawnPoint = ({ center, laneWidth, streetLength }) => ({
    position: new Vector2({
      x: center.x + streetLength + laneWidth,
      y: center.y - (laneWidth / 2),
    }),
    velocity: new Vector2({
      x: -5,
      y: 0,
    }),
    rotation: Math.PI,
  })

  #eastBoundSpawnPoint = ({ center, laneWidth, streetLength }) => ({
    position: new Vector2({
      x: center.x - streetLength - laneWidth,
      y: center.y + (laneWidth / 2),
    }),
    velocity: new Vector2({
      x: 5,
      y: 0,
    }),
    rotation: 0,
  })
}

SpawnCar.queries = {
  intersections: {
    components: [Intersection],
  },
}