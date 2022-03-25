import { System } from 'ecsy'
import { Car } from '../components/Car'

class GoForward extends System {
  execute = (_delta, _time) => {
    this.queries.cars.results.forEach(entity => {
      const car = entity.getMutableComponent(Car)
      car.position = car.position.add(car.velocity)
    })
  }
}

GoForward.queries = {
  cars: {
    components: [Car],
  },
}

export { GoForward }