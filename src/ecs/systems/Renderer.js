import { System } from 'ecsy'
import { min } from 'ramda'

class Renderer extends System {
  #canvas
  #ctx

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

    const midX = this.#canvas.width / 2
    const midY = this.#canvas.height / 2

    const laneWidth = 100
    const streetLength = (min(this.#canvas.height, this.#canvas.width) / 2) - laneWidth

    this._hStreet(midX + laneWidth, midY, laneWidth, streetLength)
    this._hStreet(midX - laneWidth, midY, laneWidth, -streetLength)
    this._vStreet(midX, midY + laneWidth, laneWidth, streetLength)
    this._vStreet(midX, midY - laneWidth, laneWidth, -streetLength)
  }

  _hStreet = (x, y, width, length) => {
    this._rect(x, y, length, width)
    this._rect(x, y, length, -width)
  }

  _vStreet = (x, y, width, length) => {
    this._rect(x, y, width, length)
    this._rect(x, y, -width, length)
  }

  _rect = (x, y, width, height) => {
    this.#ctx.fillRect(x, y, width, height)
    this.#ctx.strokeRect(x, y, width, height)
  }

}

// Renderer.queries = {
//   bgCircles: { components: [Circle, Color, Position, InBackground] },
//   fgCircles: { components: [Circle, Color, Position, Not(InBackground)] },
//   rectangles: { components: [Rectangle, Color, Position] },
// }

export { Renderer }