import { World } from 'ecsy'
import { min } from 'ramda'
import { calculateClickOffset } from '../utils/calculateClickOffset'

import { Car } from './components/Car'
import { CarCollisions } from './components/CarCollisions'
import { ClickEvent } from './components/ClickEvent'
import { Collision } from './components/Collision'
import { Intersection } from './components/Intersection'
import { Observer } from './components/Observer'
import { Position } from './components/Position'
import { Rotation } from './components/Rotation'
import { Score } from './components/Score'
import { SightArc } from './components/SightArc'
import { StopSign } from './components/StopSign'
import { Timer } from './components/Timer'
import { TrafficLight } from './components/TrafficLight'

import { ClearStopSignObservations } from './systems/ClearStopSignObservations'
import { CycleTrafficLightOnClick } from './systems/CycleTrafficLightOnClick'
import { DeSpawnCar } from './systems/DeSpawnCar'
import { DetectCarCollisions } from './systems/DetectCarCollisions'
import { DriveCar } from './systems/DriveCar'
import { ManageTimer } from './systems/ManageTimer'
import { ObserveOtherCars } from './systems/ObserveOtherCars'
import { ObserveStopSigns } from './systems/ObserveStopSigns'
import { ObserveTrafficLights } from './systems/ObserveTrafficLights'
import { Renderer } from './systems/Renderer'
import { SpawnCar } from './systems/SpawnCar'
import { SpawnTrafficLights } from './systems/SpawnTrafficLights'
import { UpdateScore } from './systems/UpdateScore'

import { Vector2 } from './types/Vector2'

export class Game {
  #animationFrameRequest = null
  #lastTime = performance.now()
  #numMsElapsed = 0

  #world = new World()
  #canvas

  constructor({ canvas }) {
    this.#canvas = canvas
    this.#world
      .registerComponent(Car)
      .registerComponent(CarCollisions)
      .registerComponent(ClickEvent)
      .registerComponent(Collision)
      .registerComponent(Intersection)
      .registerComponent(Observer)
      .registerComponent(Position)
      .registerComponent(Rotation)
      .registerComponent(Score)
      .registerComponent(SightArc)
      .registerComponent(StopSign)
      .registerComponent(Timer)
      .registerComponent(TrafficLight)
      .registerSystem(ManageTimer, { roundDuration: 30 * 1000 })
      .registerSystem(SpawnTrafficLights)
      .registerSystem(CycleTrafficLightOnClick)
      .registerSystem(SpawnCar, { interval: 500 })
      .registerSystem(DeSpawnCar)
      .registerSystem(DriveCar)
      .registerSystem(ObserveStopSigns)
      .registerSystem(ObserveTrafficLights)
      .registerSystem(ClearStopSignObservations)
      .registerSystem(Renderer, { canvas })
      .registerSystem(DetectCarCollisions)
      .registerSystem(ObserveOtherCars)
      .registerSystem(UpdateScore)
  }

  start = () => {
    this.#world.createEntity().addComponent(Intersection)
    this.#world.createEntity().addComponent(Score)
    this._run()
  }
  stop = () => this.#animationFrameRequest && cancelAnimationFrame(this.#animationFrameRequest)

  onClick = (e) => {
    const { clientX, clientY } = e

    const { width, height } = this.#canvas

    const { x, y } = calculateClickOffset({ width, height, x: clientX, y: clientY })

    this.#world.createEntity()
      .addComponent(ClickEvent)
      .addComponent(Position, { value: new Vector2({ x, y }) })
  }

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