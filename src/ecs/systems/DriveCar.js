import { System } from 'ecsy'
import { head, sortBy } from 'ramda'
import { Car } from '../components/Car'
import { Observer } from '../components/Observer'
import { Position } from '../components/Position'
import { Rotation } from '../components/Rotation'
import { Timer } from '../components/Timer'
import { Vector2 } from '../types/Vector2'

const OBSERVATION_RELEVANCE = {
  'see-other-car': 4,
  'see-red-traffic-light': 3,
  'see-yellow-traffic-light': 2,
  'see-stop-sign': 1,
  'default': 0,
}

export class DriveCar extends System {
  execute = (delta, _time) => {
    if (!this.queries.timers.results[0]?.getComponent(Timer)?.running) return

    this.queries.cars.results.forEach(e => this.#driveCar(delta, e))
  }

  #driveCar = (delta, entity) => {
    this.#updateVelocity(entity)
    this.#applyVelocity(delta, entity)
  }

  #applyVelocity = (delta, entity) => {
    const car = entity.getMutableComponent(Car)
    // Why divide by 16? What's it to you? Don't be nosy.
    const increment = car.velocity.scalarMultiply(delta / 16)
    entity.getMutableComponent(Position).value.addMut(increment)
  }

  #updateVelocity = (entity) => {
    const car = entity.getComponent(Car)
    const observer = entity.getMutableComponent(Observer)

    const mostRelevantObservation = head(sortBy(this.#relevance, observer.observations))
    observer.observations.length = 0

    if (!this.#relevant(mostRelevantObservation)) {
      return this.#speedUp(entity, car.targetSpeed)
    }

    if (mostRelevantObservation.event === 'see-yellow-traffic-light') {
      return this.#speedUp(entity, car.maxSpeed)
    }

    return this.#slowDown(entity)
  }

  #relevance = (observation) => OBSERVATION_RELEVANCE[observation?.event]  ?? OBSERVATION_RELEVANCE.default

  #relevant = (observation) => this.#relevance(observation) > 0

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

  #speedUp = (entity, targetSpeed) => {
    const car = entity.getComponent(Car)
    if (car.velocity.magnitude() >= targetSpeed) return

    const { value: rotation } = entity.getComponent(Rotation)

    const targetUnit = new Vector2(Math.cos(rotation), Math.sin(rotation))
    const target = targetUnit.scalarMultiply(targetSpeed)

    const increment = target.scalarMultiply(car.accelerationForce)

    entity.getMutableComponent(Car).velocity.addMut(increment).limitMut(targetSpeed)
  }
}

DriveCar.queries = {
  cars: {
    components: [Car, Observer, Position, Rotation],
  },
  timers: {
    components: [Timer],
  },
}
