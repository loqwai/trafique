import { System } from 'ecsy'
import { Intersection } from '../components/Intersection'
import { Observer } from '../components/Observer'
import { Position } from '../components/Position'
import { Rotation } from '../components/Rotation'
import { SightArc } from '../components/SightArc'
import { StopSign } from '../components/StopSign'
import { Vector2 } from '../types/Vector2'

export class SpawnStopSigns extends System {
  #stopSignsByIntersection = new Map()

  execute = () => {
    this.queries.intersections.results.forEach(this.#ensureIntersection)
    this.queries.intersections.results.forEach(this.#updateStopSignsForIntersection)
  }

  #ensureIntersection = (entity) => {
    if (this.#stopSignsByIntersection.has(entity)) return

    this.#stopSignsByIntersection.set(entity, new Map())
  }

  #updateStopSignsForIntersection = (entity) => {
    const intersection = entity.getComponent(Intersection)

    this.#spawnPoints(intersection).forEach(point => this.#updateStopSign(entity, point))
  }

  #updateStopSign = (intersection, { locationName, position, rotation }) => {
    const stopSign = this.#findOrCreateStopSign(intersection, locationName, position, rotation)

    stopSign.getMutableComponent(Position).position = position
  }

  #findOrCreateStopSign = (intersection, locationName, position, rotation) => {
    const existing = this.#stopSignsByIntersection.get(intersection).get(locationName)
    if (existing) return existing

    const entity = this.world
      .createEntity()
      .addComponent(StopSign, { locationName })
      .addComponent(SightArc, { arc: Math.PI, distance: 80 })
      .addComponent(Position, { value: position })
      .addComponent(Rotation, { value: rotation })
      .addComponent(Observer)

    this.#stopSignsByIntersection.get(intersection).set(locationName, entity)
    return entity
  }

  #spawnPoints = (intersection) => [
    // this.#southBoundSpawnPoint(intersection),
    // this.#northBoundSpawnPoint(intersection),
    this.#westBoundSpawnPoint(intersection),
    this.#eastBoundSpawnPoint(intersection),
  ]

  #northBoundSpawnPoint = ({ center, laneWidth }) => ({
    locationName: 'northBound',
    position: new Vector2({
      x: center.x + (1.5 * laneWidth),
      y: center.y + (1.5 * laneWidth),
    }),
    rotation: Math.PI / 2,
  })

  #southBoundSpawnPoint = ({ center, laneWidth }) => ({
    locationName: 'southBound',
    position: new Vector2({
      x: center.x - (1.5 * laneWidth),
      y: center.y - (1.5 * laneWidth),
    }),
    rotation: 3 * Math.PI / 2,
  })

  #westBoundSpawnPoint = ({ center, laneWidth }) => ({
    locationName: 'westBound',
    position: new Vector2({
      x: center.x + (1.5 * laneWidth),
      y: center.y - (1.5 * laneWidth),
    }),
    rotation: 0,
  })

  #eastBoundSpawnPoint = ({ center, laneWidth }) => ({
    locationName: 'eastBound',
    position: new Vector2({
      x: center.x - (1.5 * laneWidth),
      y: center.y + (1.5 * laneWidth),
    }),
    rotation: Math.PI,
  })
}

SpawnStopSigns.queries = {
  intersections: { components: [Intersection] },
  stopSigns: { components: [StopSign] },
}

