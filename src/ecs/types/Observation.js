import { createType, copyCopyable, cloneClonable } from 'ecsy'

/**
 * @typedef {object} ConstructorArgs
 * @property {string} event
 * @property {number} distance
 * @property {number} vector
 */

export class Observation {
  /**
   * @param  {ConstructorArgs} args
   */
  constructor({ event, distance, vector }) {
    this.event = event
    this.distance = distance
    this.vector = vector
  }
}

export const ObservationType = createType({
  name: 'Observation',
  default: new Observation({}),
  copy: copyCopyable,
  clone: cloneClonable,
})