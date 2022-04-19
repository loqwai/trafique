import { System } from 'ecsy'
import { Car } from '../components/Car'
import { Observer } from '../components/Observer'
import { Position } from '../components/Position'
import { Rotation } from '../components/Rotation'
import { Vector2 } from '../types/Vector2'

export class DriveCar extends System {
  execute = (delta, _time) => {
    this.queries.cars.results.forEach(e => this.#driveCar(delta, e))
  }

  #driveCar = (delta, entity) => {
    const car = entity.getComponent(Car)
    const observer = entity.getMutableComponent(Observer)

    const seeSomething = observer.observations.filter(this.#relevant).length > 0

    if (seeSomething) this.#slowDown(entity)
    if (!seeSomething) this.#speedUp(entity)

    // Why divide by 16? What's it to you? Don't be nosy.
    const increment = car.velocity.scalarMultiply(delta / 16)
    entity.getMutableComponent(Position).value.addMut(increment)

    observer.observations.length = 0
  }

  #relevant = (observation) => {
    if (observation.event === 'see-traffic-light') {
      return observation.meta.trafficLightState !== 'green'
    }
    return true
  }

  #slowDown = (entity) => {
    const car = entity.getMutableComponent(Car)

    if (car.velocity.y > 0) {
      car.velocity.y = Math.max(0, car.velocity.y - car.brakingForce)
    }

    if (car.velocity.y < 0) {
      car.velocity.y = Math.min(0, car.velocity.y + car.brakingForce)
    }

    if (car.velocity.x > 0) {
      car.velocity.x = Math.max(0, car.velocity.x - car.brakingForce)
    }

    if (car.velocity.x < 0) {
      car.velocity.x = Math.min(0, car.velocity.x + car.brakingForce)
    }
  }

  #speedUp = (entity) => {
    // return
    const car = entity.getComponent(Car)
    if (car.velocity.magnitude() >= car.maxSpeed) return

    const { value: rotation } = entity.getComponent(Rotation)

    const targetUnit = new Vector2(Math.cos(rotation), Math.sin(rotation))
    const target = targetUnit.scalarMultiply(car.targetSpeed)

    const increment = target.scalarMultiply(car.accelerationForce)

    entity.getMutableComponent(Car).velocity.addMut(increment).limitMut(car.targetSpeed)
  }
}

DriveCar.queries = {
  cars: {
    components: [Car, Observer, Position, Rotation],
  },
}
