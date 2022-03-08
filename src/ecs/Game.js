import { World } from 'ecsy'
import { min } from 'ramda'

import { Renderer } from './systems/Renderer'

export class Game {
  #animationFrameRequest = null
  #lastTime = performance.now()
  #numMsElapsed = 0

  #world = new World()

  constructor({ canvas }) {
    this.#world
      .registerSystem(Renderer, { canvas })
  }

  start = () => this._run()
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