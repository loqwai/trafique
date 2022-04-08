import { World } from 'ecsy'
import { min } from 'ramda'

import { Car } from './components/Car'
import { CarCollisions } from './components/CarCollisions'
import { Collision } from './components/Collision'
import { Intersection } from './components/Intersection'
import { RadialSensor } from './components/RadialSensor'
import { Score } from './components/Score'
import { StopSign } from './components/StopSign'

import { DeSpawnCar } from './systems/DeSpawnCar'
import { DetectCarCollisions } from './systems/DetectCarCollisions'
import { DriveCar } from './systems/DriveCar'
import { RecordObservations } from './systems/RecordObservations'
import { Renderer } from './systems/Renderer'
import { SpawnCar } from './systems/SpawnCar'
import { SpawnStopSigns } from './systems/SpawnStopSigns'
import { UpdateIntersection } from './systems/UpdateIntersection'
import { UpdateScore } from './systems/UpdateScore'

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
      .registerComponent(RadialSensor)
      .registerComponent(Score)
      .registerComponent(StopSign)
      .registerSystem(UpdateIntersection, { canvas })
      .registerSystem(SpawnStopSigns)
      .registerSystem(Renderer, { canvas })
      .registerSystem(SpawnCar, { interval: 500 })
      .registerSystem(DeSpawnCar)
      .registerSystem(DriveCar)
      .registerSystem(RecordObservations)
      .registerSystem(DetectCarCollisions)
      .registerSystem(UpdateScore)
  }

  start = () => {
    this.#world.createEntity().addComponent(Intersection)
    this.#world.createEntity().addComponent(Score)
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