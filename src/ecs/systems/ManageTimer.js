import { System, World } from 'ecsy'
import { Timer } from '../components/Timer'

/**
 * @typedef {object} Options
 * @property {number} priority
 * @property {number} roundDuration
 */

export class ManageTimer extends System {
  #roundDuration

  /**
   * @param {World} world
   * @param {Options} options
   */
  constructor(world, { priority, roundDuration }) {
    super(world, { priority })

    this.#roundDuration = roundDuration
  }

  execute(delta) {
    const entity = this.#ensureTimer()
    const timer = entity.getComponent(Timer)

    if (timer.remaining <= 0) return

    const mutableTimer = entity.getMutableComponent(Timer)
    mutableTimer.remaining = Math.max(0, timer.remaining - delta)
    mutableTimer.running = 0 < mutableTimer.remaining
  }

  #ensureTimer = () => {
    const entity = this.queries.timers.results[0]
    if (entity) return entity

    return this.world.createEntity().addComponent(Timer, { remaining: this.#roundDuration })
  }
}

ManageTimer.queries = {
  timers: { components: [Timer] },
}