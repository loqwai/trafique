import { createType, copyCopyable, cloneClonable } from 'ecsy'

/**
 * @typedef {object} Options
 * @property {number} x
 * @property {number} y
 *
 * @typedef {[] | [Options] | [number, number]} ConstructorArgs
 */

export class Vector2 {
  /**
   * @param  {ConstructorArgs} args
   */
  constructor(...args) { // x = 0, y = 0) {
    if (args.length === 0) {
      this.x = 0
      this.y = 0
      return
    }

    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      this.x = args[0] ?? 0
      this.y = args[1] ?? 0
      return
    }

    if (typeof args[0] === 'object' && args.length === 1) {
      this.x = args[0].x ?? 0
      this.y = args[0].y ?? 0
      return
    }

    throw new Error('Invalid arguments', args)
  }

  set = (x, y) => {
    this.x = x
    this.y = y
    return this
  }

  copy = (source) => {
    this.x = source.x
    this.y = source.y
    return this
  }

  clone = () => new Vector2(this.x, this.y)

  equals = (other) => this.x === other.x && this.y === other.y
  add = (other) => new Vector2(this.x + other.x, this.y + other.y)
  subtract = (other) => new Vector2(this.x - other.x, this.y - other.y)

  toJSON = () => ({ x: this.x, y: this.y })
}

export const Vector2Type = createType({
  name: 'Vector2',
  default: new Vector2(),
  copy: copyCopyable,
  clone: cloneClonable,
})