import { System } from 'ecsy'
import { System as CollissionSystem } from 'detect-collisions'
import { Car } from '../components/Car'
import { Collision } from '../components/Collision'
import { Vector2 } from '../types/Vector2'
import { Position } from '../components/Position'
import { Rotation } from '../components/Rotation'

export class DetectCarCollisions extends System {
  #detector = new CollissionSystem()
  #knownCollisions = new Set()
  #collidersByCar = new Map()
  #carsByCollider = new Map()

  execute = () => {
    this.queries.cars.results.forEach(this.#ensureCollider)
    this.#carsByCollider.forEach(this.#updateCollider)

    this.#detector.update()
    this.#detector.checkAll(this._handleCollision)
  }

  #ensureCollider = (entity) => {
    if (this.#collidersByCar.has(entity)) return

    const car = entity.getComponent(Car)
    const { value: position } = entity.getComponent(Position)

    const collider = this.#detector.createBox(position.toJSON(), car.width, car.height)
    this.#collidersByCar.set(entity, collider)
    this.#carsByCollider.set(collider, entity)
  }

  #updateCollider = (entity, collider) => {
    if (!entity.alive) {
      this.#detector.remove(collider)
      this.#collidersByCar.delete(entity)
      this.#carsByCollider.delete(collider)
      return
    }

    const { value: { x, y } } = entity.getComponent(Position)
    collider.setPosition(x, y)
  }

  _handleCollision = (collision) => {
    const carA = this.#carsByCollider.get(collision.a)
    const carB = this.#carsByCollider.get(collision.b)

    if (!carA || !carB) {
      console.warn('Detected a collision, but couldn\'t find the cars', { carA, carB })
      return
    }

    const key = [carA.id, carB.id].sort().join('-')

    if (this.#knownCollisions.has(key)) {
      return
    }

    const position = new Vector2({
      x: (collision.a.pos.x + collision.b.pos.x) / 2,
      y: (collision.a.pos.y + collision.b.pos.y) / 2,
    })

    this.world.createEntity().addComponent(Collision, { position, involvedParties: [carA.id, carB.id].sort() })
    this.#knownCollisions.add(key)
  }
}

DetectCarCollisions.queries = {
  cars: { components: [Car, Position, Rotation] },
}