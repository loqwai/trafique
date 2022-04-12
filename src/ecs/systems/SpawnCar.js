import { System, World } from 'ecsy'
import { Car } from '../components/Car'
import { Intersection } from '../components/Intersection'
import { System as CollissionSystem } from 'detect-collisions'
import { shuffle } from '../../utils/shuffle'
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
    const spawnPoint = this.#randomSpawnPoint()
    if (!spawnPoint) return
    const { position, velocity, rotation } = spawnPoint

    this.world.createEntity()
      .addComponent(Car, { velocity })
      .addComponent(Position, { value: position })
      .addComponent(Rotation, { value: rotation })
      .addComponent(SightArc, { arc: Math.PI, distance: 160 })
      .addComponent(Observer)
  }

  #randomSpawnPoint = () => {
    for (let spawnPoint of shuffle(this.#spawnPoints())) {
      if (this.#occupied(spawnPoint)) continue

      return spawnPoint
    }
  }

  #occupied = (spawnPoint) => {
    const detector = new CollissionSystem()

    this.queries.cars.results.forEach(entity => {
      const { value: position } = entity.getComponent(Position)
      const car = entity.getComponent(Car)

      detector.createBox(position.toJSON(), car.width, car.height)
    })

    const newCar = detector.createBox(spawnPoint.position.toJSON(), Car.schema.width.default, Car.schema.height.default)

    const collision = detector.getPotentials(newCar).find(collider => detector.checkCollision(newCar, collider))
    detector.clear()
    return Boolean(collision)
  }

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
    velocity: new Vector2(),
    rotation: Math.PI / 2,
  })

  #northBoundSpawnPoint = ({ center, laneWidth, streetLength }) => ({
    position: new Vector2({
      x: center.x + (laneWidth / 2),
      y: center.y + streetLength + laneWidth,
    }),
    velocity: new Vector2(),
    rotation: 3 * Math.PI / 2,
  })

  #westBoundSpawnPoint = ({ center, laneWidth, streetLength }) => ({
    position: new Vector2({
      x: center.x + streetLength + laneWidth,
      y: center.y - (laneWidth / 2),
    }),
    velocity: new Vector2(),
    rotation: Math.PI,
  })

  #eastBoundSpawnPoint = ({ center, laneWidth, streetLength }) => ({
    position: new Vector2({
      x: center.x - streetLength - laneWidth,
      y: center.y + (laneWidth / 2),
    }),
    velocity: new Vector2(),
    rotation: 0,
  })
}

SpawnCar.queries = {
  intersections: {
    components: [Intersection],
  },
  cars: {
    components: [Car, Position],
  },
}