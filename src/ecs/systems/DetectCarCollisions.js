import { System, Not } from 'ecsy'
import { System as CollissionSystem } from 'detect-collisions'
import { Car } from '../components/Car'
import { CarCollisions } from '../components/CarCollisions'
import { Collision } from '../components/Collision'
import { Vector2 } from '../types/Vector2'

export class DetectCarCollisions extends System {
  constructor(world) {
    super(world)
    this.world = world
    this.detector = new CollissionSystem()
    this.knownCollisions = new Set()
    this.carCache = new Map()
  }

  execute = () => {
    this.queries.added.results.forEach(this._addCarPhysics)
    this.queries.removed.results.forEach(this._removeCarPhysics)
    this.queries.normal.results.forEach(this._updateCollider)

    this.detector.update()
    this.detector.checkAll(this._handleCollision)
  }

  _addCarPhysics = (entity) => {
    const car = entity.getComponent(Car)
    const position = car.position.toJSON()
    const collider = this.detector.createBox(position, car.width, car.height)

    entity.addComponent(CarCollisions, { collider })

    this.carCache.set(collider, entity)
  }

  _removeCarPhysics = (entity) => {
    const { collider } = entity.getComponent(CarCollisions)

    this.detector.remove(collider)
    entity.removeComponent(CarCollisions)

    this.carCache.delete(collider)
  }

  _updateCollider = (entity) => {
    const { position } = entity.getComponent(Car)
    const { collider } = entity.getComponent(CarCollisions)
    collider.setPosition(position.x, position.y)
  }

  _handleCollision = (collision) => {
    const carA = this.carCache.get(collision.a)
    const carB = this.carCache.get(collision.b)

    if (!carA || !carB) {
      console.warn('Detected a collision, but couldn\'t find the cars', { carA, carB })
      return
    }

    const key = [carA.id, carB.id].sort().join('-')

    if (this.knownCollisions.has(key)) {
      return
    }

    const position = new Vector2({
      x: (collision.a.pos.x + collision.b.pos.x) / 2,
      y: (collision.a.pos.y + collision.b.pos.y) / 2,
    })

    this.world.createEntity().addComponent(Collision, { position, involvedParties: [carA.id, carB.id].sort() })
    this.knownCollisions.add(key)
  }
}

DetectCarCollisions.queries = {
  added: { components: [Car, Not(CarCollisions)] },
  removed: { components: [Not(Car), CarCollisions] },
  normal: { components: [Car, CarCollisions] },
  collisions: { components: [Collision] },
}