import { World } from 'ecsy'
import { System } from 'ecsy'
import { min } from 'ramda'

const laneWidth = 100

/**
 * @typedef {object} Options
 * @property {HTMLCanvasElement} canvas
 * @property {number} priority
 */

class Renderer extends System {
  #canvas
  #ctx

  /**
   *
   * @param {World} world
   * @param {Options} param1
   */
  constructor(world, { canvas, priority }) {
    super(world, { priority })
    this.#canvas = canvas
    this.#ctx = canvas.getContext('2d')
  }

  execute = (_delta, _time) => {
    this._clear()
    this._renderStreets()
  }

  _clear = () => {
    this.#ctx.fillStyle = '#ffffff'
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height)
  }

  _renderStreets = () => {
    this.#ctx.fillStyle = '#cccccc'
    this.#ctx.strokeStyle = '#000000'

    const xMid = this.#canvas.width / 2
    const yMid = this.#canvas.height / 2

    const streetLength = (min(this.#canvas.height, this.#canvas.width) / 2) - laneWidth

    this._horizontalStreet(xMid + laneWidth, yMid, laneWidth, streetLength)
    this._horizontalStreet(xMid - laneWidth, yMid, laneWidth, -streetLength)
    this._verticalStreet(xMid, yMid + laneWidth, laneWidth, streetLength)
    this._verticalStreet(xMid, yMid - laneWidth, laneWidth, -streetLength)
    this._intersection(xMid, yMid, laneWidth)
  }

  _horizontalStreet = (xMid, yMid, laneWidth, streetLength) => {
    this._rect(xMid, yMid - laneWidth, streetLength, 2 * laneWidth)
    this._dashedLine(xMid, yMid, xMid + streetLength, yMid)
  }

  _verticalStreet = (xMid, yMid, laneWidth, streetLength) => {
    this._rect(xMid - laneWidth, yMid, 2 * laneWidth, streetLength)
    this._dashedLine(xMid, yMid, xMid, yMid + streetLength)
  }

  _intersection(xMid, yMid, laneWidth) {
    this._rect(
      xMid - laneWidth,
      yMid - laneWidth,
      (laneWidth * 2),
      (laneWidth * 2),
    )
  }

  _rect = (x, y, width, height) => {
    this.#ctx.fillStyle = '#000'
    this.#ctx.fillRect(x, y, width, height)

    this.#ctx.strokeStyle = '#000'
    this.#ctx.lineWidth = 1
    this.#ctx.setLineDash([])
    this.#ctx.strokeRect(x, y, width, height)
  }

  _dashedLine = (x0, y0, x1, y1) => {
    this.#ctx.beginPath()
    this.#ctx.strokeStyle = '#fff'
    this.#ctx.lineWidth = 5
    this.#ctx.setLineDash([25, 35])
    this.#ctx.moveTo(x0, y0)
    this.#ctx.lineTo(x1, y1)
    this.#ctx.stroke()
  }
}

export { Renderer }