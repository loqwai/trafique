import { World } from 'ecsy'
import { System } from 'ecsy'
import { calculateTransform } from '../../utils/calculateTransform'

import { Car } from '../components/Car'
import { Collision } from '../components/Collision'
import { Intersection } from '../components/Intersection'
import { Position } from '../components/Position'
import { Rotation } from '../components/Rotation'
import { Score } from '../components/Score'
import { SightArc } from '../components/SightArc'
import { StopSign } from '../components/StopSign'
import { Timer } from '../components/Timer'
import { TrafficLight } from '../components/TrafficLight'

const TRAFFIC_LIGHT_SIGHT_ARC_COLORS = {
  red: '#ff000033',
  yellow: '#ffff0033',
  green: '#00ff0033',
}

var TIMER_FORMAT = new Intl.NumberFormat('en-US', {
  minimumIntegerDigits: 1,
  minimumFractionDigits: 2,
})

/**
 * @typedef {object} Options
 * @property {HTMLCanvasElement} canvas
 * @property {number} priority
 */

class Renderer extends System {
  #canvas
  #ctx
  #fps

  /**
   * @param {World} world
   * @param {Options} options
   */
  constructor(world, { canvas, priority }) {
    super(world, { priority })
    this.#canvas = canvas
    this.#ctx = canvas.getContext('2d')
    this.#fps = 0
  }

  execute = (delta, _time) => {
    this.#fps *= 0.95
    this.#fps += 0.05 * (1000 / delta)

    this.#clear()
    this.#renderIntersections()
    this.#renderCars()
    this.#renderStopSigns()
    this.#renderTrafficLights()
    this.#renderTrafficLightSightArcs()
    this.#renderCarSightArcs()
    this.#renderStopSignSightArcs()
    this.#renderCollisions()
    this.#renderScore()
    this.#renderTimer()
  }

  #clear = () => {
    this.#ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.#ctx.fillStyle = '#ffffff'
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height)
  }

  #resetTransform = () => {
    const { scale, offsetX, offsetY } = calculateTransform(this.#canvas)

    this.#ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY)
  }

  #renderIntersections = () => {
    this.queries.intersection.results.forEach(this.#renderIntersection)
  }

  #renderIntersection = (entity) => {
    this.#ctx.rotate(0)
    this.#ctx.fillStyle = '#cccccc'
    this.#ctx.strokeStyle = '#000000'

    const { center, streetLength, laneWidth } = entity.getComponent(Intersection)

    this.#resetTransform()

    this.#horizontalStreet(center.x + laneWidth, center.y, laneWidth, streetLength)
    this.#horizontalStreet(center.x - laneWidth, center.y, laneWidth, -streetLength)
    this.#verticalStreet(center.x, center.y + laneWidth, laneWidth, streetLength)
    this.#verticalStreet(center.x, center.y - laneWidth, laneWidth, -streetLength)
    this.#intersectionCenter(center.x, center.y, laneWidth)
  }

  #horizontalStreet = (xMid, yMid, laneWidth, streetLength) => {
    this.#rect(xMid, yMid - laneWidth, streetLength, 2 * laneWidth)
    this.#dashedLine(xMid, yMid, xMid + streetLength, yMid)
  }

  #verticalStreet = (xMid, yMid, laneWidth, streetLength) => {
    this.#rect(xMid - laneWidth, yMid, 2 * laneWidth, streetLength)
    this.#dashedLine(xMid, yMid, xMid, yMid + streetLength)
  }

  #intersectionCenter(xMid, yMid, laneWidth) {
    this.#rect(
      xMid - laneWidth,
      yMid - laneWidth,
      (laneWidth * 2),
      (laneWidth * 2),
    )
  }

  #rect = (x, y, width, height, fillColor = '#000', strokeColor = '#000') => {
    this.#ctx.fillStyle = fillColor
    this.#ctx.fillRect(x, y, width, height)

    this.#ctx.strokeStyle = strokeColor
    this.#ctx.lineWidth = 1
    this.#ctx.setLineDash([])
    this.#ctx.strokeRect(x, y, width, height)
  }

  #arc = (x, y, radius, startArc, endArc, fillColor = '#000', strokeColor = '#000') => {
    this.#ctx.fillStyle = fillColor
    this.#ctx.strokeStyle = strokeColor
    this.#ctx.beginPath()
    this.#ctx.moveTo(x, y)
    this.#ctx.arc(x, y, radius, startArc, endArc)
    this.#ctx.closePath()
    this.#ctx.fill()
    this.#ctx.stroke()
  }

  #circ = (x, y, radius, fillColor = '#000', strokeColor = '#000') => {
    this.#ctx.fillStyle = fillColor
    this.#ctx.strokeStyle = strokeColor
    this.#ctx.beginPath()
    this.#ctx.arc(x, y, radius, 0, Math.PI * 2)
    this.#ctx.stroke()
    this.#ctx.fill()
  }

  #dashedLine = (x0, y0, x1, y1) => {
    this.#ctx.beginPath()
    this.#ctx.strokeStyle = '#fff'
    this.#ctx.lineWidth = 5
    this.#ctx.setLineDash([25, 35])
    this.#ctx.moveTo(x0, y0)
    this.#ctx.lineTo(x1, y1)
    this.#ctx.stroke()
    this.#ctx.closePath()
  }

  #renderCars = () => {
    this.queries.cars.results.forEach(this.#renderCar)
  }

  #renderCar = (entity) => {
    const { width, height } = entity.getComponent(Car)
    const { value: { x, y } } = entity.getComponent(Position)
    const { value: rotation } = entity.getComponent(Rotation)

    this.#resetTransform()
    this.#ctx.translate(x, y)
    this.#ctx.rotate(rotation)
    this.#rect(0 - height / 2, 0 - width / 2, height, width, '#999999', '#000000')
    // render car mid-point. helps debug car rendering
    // this._circ(0, 0, 5, '#ff0000')
  }

  #renderCollisions = () => {
    this.queries.collisions.results.forEach(this.#renderCollision)
  }

  #renderCollision = (entity) => {
    const { position } = entity.getComponent(Collision)

    this.#circ(position.x, position.y, 10, '#f59042')
  }

  #renderStopSigns = () => {
    this.queries.stopSigns.results.forEach(this.#renderStopSign)
  }

  #renderStopSign = (entity) => {
    const { radius } = entity.getComponent(StopSign)
    const { value: { x, y } } = entity.getComponent(Position)

    this.#resetTransform()
    this.#circ(x, y, radius, '#ff0000')
    this.#ctx.fillStyle = '#ffffff'
    this.#ctx.strokeStyle = '#000000'
    this.#ctx.font = '36px sans-serif'
    this.#ctx.textAlign = 'center'
    this.#ctx.textBaseline = 'middle'
    this.#ctx.fillText('Stop', x, y)
  }

  #renderTrafficLights = () => {
    this.queries.trafficLights.results.forEach(this.#renderTrafficLight)
  }

  #renderTrafficLight = (entity) => {
    const { radius, state } = entity.getComponent(TrafficLight)
    const { value: { x, y } } = entity.getComponent(Position)

    this.#resetTransform()
    this.#circ(x, y, radius, state)
  }

  #renderCarSightArcs = () => this.queries.carSightArcs.results.forEach(e => this.#renderSightArc(e, '#33ff0033'))

  #renderStopSignSightArcs = () => this.queries.stopSignSightArcs.results.forEach(e => this.#renderSightArc(e, '#ff000033'))

  #renderTrafficLightSightArcs = () => this.queries.trafficLightSightArcs.results.forEach(this.#renderTrafficLightSightArc)

  #renderTrafficLightSightArc = (entity) => {
    const { state } = entity.getComponent(TrafficLight)
    const color = TRAFFIC_LIGHT_SIGHT_ARC_COLORS[state]
    return this.#renderSightArc(entity, color)
  }

  #renderSightArc = (entity, fill, stroke = '#000000') => {
    const { value: { x, y } } = entity.getComponent(Position)
    const { value: rotation } = entity.getComponent(Rotation)
    const { arc, distance } = entity.getComponent(SightArc)

    const startArc = rotation - (arc / 2)
    const endArc = rotation + (arc / 2)

    this.#resetTransform()
    this.#arc(x, y, distance, startArc, endArc, fill, stroke)
  }

  #renderScore = () => {
    const score = this.queries.score.results[0].getComponent(Score)

    this.#resetTransform()
    this.#ctx.fillStyle = '#000000'
    this.#ctx.font = '48px sans-serif'
    this.#ctx.textAlign = 'start'
    this.#ctx.textBaseline = 'alphabetic'
    this.#ctx.fillText(`Arrived: ${score.numArrived}`, 10, 58)
    this.#ctx.fillText(`Collisions: ${score.numCollisions}`, 10, 2 * 58)
    this.#ctx.fillText(`Cars: ${this.queries.cars.results.length}`, 10, 3 * 58)
    this.#ctx.fillText(`FPS: ${Math.round(this.#fps)}`, 10, 4 * 58)
  }

  #renderTimer = () => {
    const timer = this.queries.timers.results[0]?.getComponent(Timer)
    if (!timer) return

    const timeRemaining = Math.round((timer.remaining) / 10) / 100
    const formattedTimeRemaining = `${TIMER_FORMAT.format(timeRemaining)}`.padEnd()

    this.#resetTransform()
    this.#ctx.fillStyle = '#000000'
    this.#ctx.font = '48px sans-serif'
    this.#ctx.textAlign = 'end'
    this.#ctx.textBaseline = 'alphabetic'
    this.#ctx.fillText(`${formattedTimeRemaining}s remaining`, 990, 58)
  }
}

Renderer.queries = {
  cars: { components: [Car, Position, Rotation] },
  collisions: { components: [Collision] },
  intersection: { components: [Intersection] },
  score: { components: [Score] },
  stopSigns: { components: [StopSign, Position] },
  timers: { components: [Timer] },
  trafficLights: { components: [TrafficLight, Position] },

  carSightArcs: { components: [Car, SightArc, Position, Rotation] },
  stopSignSightArcs: { components: [StopSign, SightArc, Position, Rotation] },
  trafficLightSightArcs: { components: [TrafficLight, SightArc, Position, Rotation] },
}

export { Renderer }