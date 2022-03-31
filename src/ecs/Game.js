import { World } from 'ecsy'
import { min } from 'ramda'

import { Renderer } from './systems/Renderer'
import { SpawnCar } from './systems/SpawnCar'
import { Car } from './components/Car'
import { GoForward } from './systems/GoForward'
import { DeSpawnCar } from './systems/DeSpawnCar'
import { UpdateIntersection } from './systems/UpdateIntersection'
import { Intersection } from './components/Intersection'
import { CarCollisions } from './components/CarCollisions'
import { Collision } from './components/Collision'
import { DetectCarCollisions } from './systems/DetectCarCollisions'

export class Game {
  #animationFrameRequest = null
  #lastTime = performance.now()
  #numMsElapsed = 0

  #world = new World()

  constructor({ canvas }) {
    this.#world
      .registerComponent(Car)
      .registerComponent(CarCollisions)
      .registerComponent(Collision)
      .registerComponent(Intersection)
      .registerSystem(UpdateIntersection, { canvas })
      .registerSystem(Renderer, { canvas })
      .registerSystem(SpawnCar, { interval: 500 })
      .registerSystem(DeSpawnCar)
      .registerSystem(GoForward)
      .registerSystem(DetectCarCollisions)
  }

  start = () => {
    this.#world.createEntity('Intersection').addComponent(Intersection)
    this._run()
  }
  stop = () => this.#animationFrameRequest && cancelAnimationFrame(this.#animationFrameRequest)

  /**
   * Private function that runs on each animation frame. If you're trying to
   * run the game, use start() instead
   **/
  _run = () => {
    // Compute delta and elapsed time
    const time = performance.now()
    const delta = min(time - this.#lastTime, 50)
    this.#numMsElapsed += delta
    this.#lastTime = time

    // Run all the systems
    this.#world.execute(delta, this.#numMsElapsed)
    this.#animationFrameRequest = requestAnimationFrame(this._run)
  }
}