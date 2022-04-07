import { System } from 'ecsy'
import { Car } from '../components/Car'

export class DriveCar extends System {
  execute = (_delta, _time) => {
    this.queries.cars.results.forEach(this._driveCar)
  }

  _driveCar = (entity) => {
    const car = entity.getMutableComponent(Car)
    car.position = car.position.add(car.velocity)

    if (car.observations.length === 0) return

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

    car.observations.length = 0
  }
}

DriveCar.queries = {
  cars: {
    components: [Car],
  },
}
