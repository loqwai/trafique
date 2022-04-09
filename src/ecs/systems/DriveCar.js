import { System } from 'ecsy'
import { Car } from '../components/Car'
import { Observer } from '../components/Observer'
import { Position } from '../components/Position'

export class DriveCar extends System {
  execute = (delta, _time) => {
    this.queries.cars.results.forEach(e => this.#driveCar(delta, e))
  }

  #driveCar = (delta, entity) => {
    const car = entity.getComponent(Car)
    const observer = entity.getMutableComponent(Observer)
    const position = entity.getMutableComponent(Position)

    position.value = position.value.add(car.velocity.scalarMultiply(delta / 16)) // Why 16? What's it to you? Don't be nosy.

    if (observer.observations.length === 0) return

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

    observer.observations.length = 0
  }
}

DriveCar.queries = {
  cars: {
    components: [Car, Observer, Position],
  },
}
