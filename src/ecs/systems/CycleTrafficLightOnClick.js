import { System } from 'ecsy'
import { System as CollissionSystem } from 'detect-collisions'
import { ClickEvent } from '../components/ClickEvent'
import { Position } from '../components/Position'
import { TrafficLight } from '../components/TrafficLight'

export class CycleTrafficLightOnClick extends System {
  #detector = new CollissionSystem()
  #collidersByTrafficLight = new Map()
  #trafficLightsByCollider = new Map()

  execute() {
    this.queries.trafficLights.results.forEach(this.#ensureTrafficLights)
    this.#collidersByTrafficLight.forEach(this.#updateTrafficLight)
    this.#detector.update()

    this.queries.clickEvents.results.forEach(this.#processClickEvent)
  }

  #processClickEvent = (entity) => {
    const { value: position } = entity.getComponent(Position)
    const click = this.#detector.createCircle(position.toJSON(), 1)

    const potentials = this.#detector.getPotentials(click)
    potentials.forEach(collider => {
      if (this.#detector.checkCollision(click, collider)) {
        const entity = this.#trafficLightsByCollider.get(collider)
        entity.getMutableComponent(TrafficLight).cycle()

      }
    })  
    this.#detector.remove(click)
    entity.remove()
  }

  #ensureTrafficLights = (entity) => {
    if (this.#collidersByTrafficLight.has(entity)) return

    const { radius } = entity.getComponent(TrafficLight)
    const { value: position } = entity.getComponent(Position)

    const collider = this.#detector.createCircle(position.toJSON(), radius)
    this.#collidersByTrafficLight.set(entity, collider)
    this.#trafficLightsByCollider.set(collider, entity)
  }

  #updateTrafficLight = (collider, entity) => {
    if (!entity.alive) {
      this.#detector.remove(collider)
      this.#collidersByTrafficLight.delete(entity)
      this.#trafficLightsByCollider.delete(collider)
      return
    }

    const { value: { x, y } } = entity.getComponent(Position)
    collider.setPosition(x, y)
  }

}

CycleTrafficLightOnClick.queries = {
  clickEvents: { components: [ClickEvent, Position] },
  trafficLights: { components: [TrafficLight, Position] },
}
