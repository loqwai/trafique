import { createType, copyCopyable, cloneClonable, copyJSON } from 'ecsy'

/**
 * @typedef {object} ConstructorArgs
 * @property {string} event
 * @property {number} distance
 * @property {number} vector
 * @property {object} meta
 */

export class Observation {
  /**
   * @param  {ConstructorArgs} args
   */
  constructor({ event, distance, vector, meta } = {}) {
    this.event = event
    this.distance = distance
    this.vector = vector
    this.meta = meta
  }

  copy = (other) => {
    other.event = this.event
    other.distance = this.distance
    other.vector = this.vector
    other.meta = copyJSON(this.meta)
  }

  clone = () => this.copy(new Observation())
}

export const ObservationType = createType({
  name: 'Observation',
  default: new Observation({}),
  copy: copyCopyable,
  clone: cloneClonable,
})