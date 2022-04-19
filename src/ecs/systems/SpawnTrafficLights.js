import { System } from 'ecsy'
import { Intersection } from '../components/Intersection'
import { Observer } from '../components/Observer'
import { Position } from '../components/Position'
import { Rotation } from '../components/Rotation'
import { SightArc } from '../components/SightArc'
import { TrafficLight } from '../components/TrafficLight'
import { Vector2 } from '../types/Vector2'

export class SpawnTrafficLights extends System {
  #trafficLightsByIntersection = new Map()

  execute = () => {
    this.queries.intersections.results.forEach(this.#ensureIntersection)
    this.queries.intersections.results.forEach(this.#updateTrafficLightForIntersection)
  }

  #ensureIntersection = (entity) => {
    if (this.#trafficLightsByIntersection.has(entity)) return

    this.#trafficLightsByIntersection.set(entity, new Map())
  }

  #updateTrafficLightForIntersection = (entity) => {
    const intersection = entity.getComponent(Intersection)

    this.#spawnPoints(intersection).forEach(point => this.#updateTrafficLight(entity, point))
  }

  #updateTrafficLight = (intersection, { locationName, position, rotation, state }) => {
    const trafficLight = this.#findOrCreateTrafficLight(intersection, locationName, position, rotation)

    trafficLight.getMutableComponent(Position).position = position
    trafficLight.getMutableComponent(TrafficLight).state = state
  }

  #findOrCreateTrafficLight = (intersection, locationName, position, rotation) => {
    const existing = this.#trafficLightsByIntersection.get(intersection).get(locationName)
    if (existing) return existing

    const entity = this.world
      .createEntity()
      .addComponent(TrafficLight, { locationName })
      .addComponent(SightArc, { arc: Math.PI, distance: 80 })
      .addComponent(Position, { value: position })
      .addComponent(Rotation, { value: rotation })
      .addComponent(Observer)

    this.#trafficLightsByIntersection.get(intersection).set(locationName, entity)
    return entity
  }

  #spawnPoints = (intersection) => [
    this.#southBoundSpawnPoint(intersection),
    this.#northBoundSpawnPoint(intersection),
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
    state: 'red',
  })

  #southBoundSpawnPoint = ({ center, laneWidth }) => ({
    locationName: 'southBound',
    position: new Vector2({
      x: center.x - (1.5 * laneWidth),
      y: center.y - (1.5 * laneWidth),
    }),
    rotation: 3 * Math.PI / 2,
    state: 'green',
  })

  #westBoundSpawnPoint = ({ center, laneWidth }) => ({
    locationName: 'westBound',
    position: new Vector2({
      x: center.x + (1.5 * laneWidth),
      y: center.y - (1.5 * laneWidth),
    }),
    rotation: 0,
    state: 'yellow',
  })

  #eastBoundSpawnPoint = ({ center, laneWidth }) => ({
    locationName: 'eastBound',
    position: new Vector2({
      x: center.x - (1.5 * laneWidth),
      y: center.y + (1.5 * laneWidth),
    }),
    rotation: Math.PI,
    state: 'red',
  })
}

SpawnTrafficLights.queries = {
  intersections: { components: [Intersection] },
  trafficLights: { components: [TrafficLight] },
}

