import { World } from 'ecsy'
import { System } from 'ecsy'
import { normalizeRotation } from '../../utils/rotationCloseTo'

import { Car } from '../components/Car'
import { Collision } from '../components/Collision'
import { Intersection } from '../components/Intersection'
import { RadialSensor } from '../components/RadialSensor'
import { Score } from '../components/Score'
import { StopSign } from '../components/StopSign'

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
    this._renderStopSigns()
    this._renderCarRadialSensors()
    this._renderCollisions()
    this._renderScore()
  }

  _clear = () => {
    this.#ctx.fillStyle = '#ffffff'
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height)
  }

  _renderStreets = () => {
    this.#ctx.fillStyle = '#cccccc'
    this.#ctx.strokeStyle = '#000000'

    this.queries.intersection.results.forEach(this._renderIntersection)
  }

  _renderIntersection = (entity) => {
    this.#ctx.rotate(0)
    this.#ctx.fillStyle = '#cccccc'
    this.#ctx.strokeStyle = '#000000'

    const { center, streetLength, laneWidth } = entity.getComponent(Intersection)

    this._horizontalStreet(center.x + laneWidth, center.y, laneWidth, streetLength)
    this._horizontalStreet(center.x - laneWidth, center.y, laneWidth, -streetLength)
    this._verticalStreet(center.x, center.y + laneWidth, laneWidth, streetLength)
    this._verticalStreet(center.x, center.y - laneWidth, laneWidth, -streetLength)
    this._intersectionCenter(center.x, center.y, laneWidth)
  }

  _horizontalStreet = (xMid, yMid, laneWidth, streetLength) => {
    this._rect(xMid, yMid - laneWidth, streetLength, 2 * laneWidth)
    this._dashedLine(xMid, yMid, xMid + streetLength, yMid)
  }

  _verticalStreet = (xMid, yMid, laneWidth, streetLength) => {
    this._rect(xMid - laneWidth, yMid, 2 * laneWidth, streetLength)
    this._dashedLine(xMid, yMid, xMid, yMid + streetLength)
  }

  _intersectionCenter(xMid, yMid, laneWidth) {
    this.#ctx.rotate(0)
    this._rect(
      xMid - laneWidth,
      yMid - laneWidth,
      (laneWidth * 2),
      (laneWidth * 2),
    )
  }

  _rect = (x, y, width, height, fillColor = '#000', strokeColor = '#000') => {
    this.#ctx.fillStyle = fillColor
    this.#ctx.fillRect(x, y, width, height)

    this.#ctx.strokeStyle = strokeColor
    this.#ctx.lineWidth = 1
    this.#ctx.setLineDash([])
    this.#ctx.strokeRect(x, y, width, height)
  }

  _arc = (x, y, radius, startArc, endArc, fillColor = '#000', strokeColor = '#000') => {
    const nStartArc = normalizeRotation(startArc - (Math.PI / 2))
    const nEndArc = normalizeRotation(endArc - (Math.PI / 2))

    this.#ctx.fillStyle = fillColor
    this.#ctx.strokeStyle = strokeColor
    this.#ctx.beginPath()
    this.#ctx.moveTo(x, y)
    this.#ctx.arc(x, y, radius, nStartArc, nEndArc)
    this.#ctx.closePath()
    this.#ctx.fill()
    this.#ctx.stroke()
  }

  _circ = (x, y, radius, fillColor = '#000', strokeColor = '#000') => {
    this.#ctx.fillStyle = fillColor
    this.#ctx.strokeStyle = strokeColor
    this.#ctx.beginPath()
    this.#ctx.arc(x, y, radius, 0, Math.PI * 2)
    this.#ctx.stroke()
    this.#ctx.fill()
  }

  _dashedLine = (x0, y0, x1, y1) => {
    this.#ctx.beginPath()
    this.#ctx.strokeStyle = '#fff'
    this.#ctx.lineWidth = 5
    this.#ctx.setLineDash([25, 35])
    this.#ctx.moveTo(x0, y0)
    this.#ctx.lineTo(x1, y1)
    this.#ctx.stroke()
    this.#ctx.closePath()
  }

  _renderCars = () => {
    this.queries.cars.results.forEach(this._renderCar)
  }

  _renderCar = (entity) => {
    const car = entity.getComponent(Car)

    const { position, width, height, rotation } = car
    const { x, y } = position

    this.#ctx.translate(x, y)
    this.#ctx.rotate(rotation)
    this._rect(0 - width / 2, 0 - height / 2, width, height, '#999999')
    // render car mid-point. helps debug car rendering
    // this._circ(x, y, 5, '#ff0000')
    this.#ctx.setTransform(1, 0, 0, 1, 0, 0)
  }

  _renderCollisions = () => {
    this.queries.collisions.results.forEach(this._renderCollision)
  }

  _renderCollision = (entity) => {
    const { position } = entity.getComponent(Collision)

    this._circ(position.x, position.y, 10, '#f59042')
  }

  _renderStopSigns = () => {
    this.queries.stopSigns.results.forEach(this._renderStopSign)
  }

  _renderStopSign = (entity) => {
    const { position, radius } = entity.getComponent(StopSign)

    this._circ(position.x, position.y, radius, '#ff0000')
  }

  _renderCarRadialSensors = () => {
    this.queries.carRadialSensors.results.forEach(this._renderCarRadialSensor)
  }

  _renderCarRadialSensor = (entity) => {
    const { position, rotation, radius, arc } = entity.getComponent(RadialSensor)

    this.#ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.#ctx.fillStyle = '#000000'
    this.#ctx.font = '10px sans-serif'
    this.#ctx.fillText(Math.round(10 * rotation) / 10, position.x, position.y)

    // const beginArc = normalizeRotation(rotation - (arc / 2) - (Math.PI / 2))
    // const endArc = normalizeRotation(rotation + (arc / 2) - (Math.PI / 2))

    // ctx.beginPath();
    // ctx.moveTo(cx,cy);
    // ctx.arc(cx,cy,radius,startAngle,endAngle);
    // ctx.closePath();
    // ctx.fillStyle=fillcolor;
    // ctx.fill();

    // this.#ctx.setTransform(1, 0, 0, 1, 0, 0)
    // this.#ctx.fillStyle = '#33ff0033'
    // this.#ctx.strokeStyle = '#000000'
    // this.#ctx.beginPath()
    // this.#ctx.moveTo(position.x, position.y)
    // this.#ctx.arc(position.x, position.y, radius, beginArc, endArc)
    // this.#ctx.closePath()
    // this.#ctx.fill()
    // this.#ctx.stroke()
    // this.#ctx.setTransform(1, 0, 0, 1, 0, 0)

    const startArc = rotation - (arc / 2)
    const endArc = rotation + (arc / 2)

    this._arc(position.x, position.y, radius, startArc, endArc, '#33ff0033', '#000000')
  }

  _renderScore = () => {
    const score = this.queries.score.results[0].getComponent(Score)

    this.#ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.#ctx.fillStyle = '#000000'
    this.#ctx.font = '48px sans-serif'
    this.#ctx.fillText(`Arrived: ${score.numArrived}`, 10, 58)
    this.#ctx.fillText(`Collisions: ${score.numCollisions}`, 10, 2 * 58)
  }
}

Renderer.queries = {
  cars: { components: [Car] },
  collisions: { components: [Collision] },
  intersection: { components: [Intersection] },
  score: { components: [Score] },
  stopSigns: { components: [StopSign] },

  carRadialSensors: { components: [Car, RadialSensor] },
}

export { Renderer }