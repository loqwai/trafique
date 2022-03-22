import { World } from 'ecsy'
import { System } from 'ecsy'
import { min } from 'ramda'
import { Intersection } from '../components/Intersection'
import { Vector2 } from '../types/Vector2'

/**
 * @typedef {object} Options
 * @property {HTMLCanvasElement} canvas
 * @property {number} priority
 */

export class UpdateIntersection extends System {
  #canvas

  /**
   * @param {World} world
   * @param {Options} options
   */
  constructor(world, { canvas, priority }) {
    super(world, { priority })
    this.#canvas = canvas
  }

  execute = (_delta, _time) => {
    this.queries.intersections.results.forEach(this._updateIntersection)
  }

  _updateIntersection = (entity) => {
    const intersection = entity.getComponent(Intersection)

    const streetLength = (min(this.#canvas.height, this.#canvas.width) / 2) - intersection.laneWidth
    const xMid = this.#canvas.width / 2
    const yMid = this.#canvas.height / 2

    if (intersection.streetLength === streetLength && intersection.center.x === xMid && intersection.center.y === yMid) return

    const mutableIntersection = entity.getMutableComponent(Intersection)
    mutableIntersection.streetLength = streetLength
    mutableIntersection.center = new Vector2(xMid, yMid)
  }
}

UpdateIntersection.queries = {
  intersections: {
    components: [Intersection],
  },
}