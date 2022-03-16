import { World } from 'ecsy'
import { System } from 'ecsy'
import { min } from 'ramda'
import { Car } from '../components/Car'

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
   * @param {World} world
   * @param {Options} options
   */
  constructor(world, { canvas, priority }) {
    super(world, { priority })
    this.#canvas = canvas
    this.#ctx = canvas.getContext('2d')
  }

  execute = (_delta, _time) => {
    this._clear()
    this._renderStreets()
    this._renderCars()
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

  _rect = (x, y, width, height, fillColor='#000', strokeColor='#000') => {
    this.#ctx.fillStyle = fillColor
    this.#ctx.fillRect(x, y, width, height)

    this.#ctx.strokeStyle = strokeColor
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

  _renderCars = () => {
    this.queries.cars.results.forEach(this._renderCar)
  }

  _renderCar = (entity) => {
    const car = entity.getComponent(Car)

    const { x, y, width, height } = car
    this._rect(x, y, width, height, '#ff0000')
  }
}

Renderer.queries = {
  cars: {
    components: [Car],
  },
}

export { Renderer }