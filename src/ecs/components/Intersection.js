import { Component, Types } from 'ecsy'
import { Vector2, Vector2Type } from '../types/Vector2'

export class Intersection extends Component {
  getSpawnPoints = () => [
    this._southBoundSpawnPoint(),
    this._northBoundSpawnPoint(),
    this._westBoundSpawnPoint(),
    this._eastBoundSpawnPoint(),
  ]

  northBoundStopSign = () => ({
    position: new Vector2({
      x: this.center.x + (1.5 * this.laneWidth),
      y: this.center.y + (1.5 * this.laneWidth),
    }),
    rotation: Math.PI / 2,
  })

  southBoundStopSign = () => ({
    position: new Vector2({
      x: this.center.x - (1.5 * this.laneWidth),
      y: this.center.y - (1.5 * this.laneWidth),
    }),
    rotation: 3 * Math.PI / 2,
  })

  westBoundStopSign = () => ({
    position: new Vector2({
      x: this.center.x + (1.5 * this.laneWidth),
      y: this.center.y - (1.5 * this.laneWidth),
    }),
    rotation: 0,
  })

  eastBoundStopSign = () => ({
    position: new Vector2({
      x: this.center.x - (1.5 * this.laneWidth),
      y: this.center.y + (1.5 * this.laneWidth),
    }),
    rotation: Math.PI,
  })

  _southBoundSpawnPoint = () => ({
    position: new Vector2({
      x: this.center.x - (this.laneWidth / 2),
      y: this.center.y - this.streetLength - this.laneWidth,
    }),
    velocity: new Vector2({
      x: 0,
      y: 5,
    }),
    rotation: Math.PI / 2,
  })

  _northBoundSpawnPoint = () => ({
    position: new Vector2({
      x: this.center.x + (this.laneWidth / 2),
      y: this.center.y + this.streetLength + this.laneWidth,
    }),
    velocity: new Vector2({
      x: 0,
      y: -5,
    }),
    rotation: 3 * Math.PI / 2,
  })

  _westBoundSpawnPoint = () => ({
    position: new Vector2({
      x: this.center.x + this.streetLength + this.laneWidth,
      y: this.center.y - (this.laneWidth / 2),
    }),
    velocity: new Vector2({
      x: -5,
      y: 0,
    }),
    rotation: Math.PI,
  })

  _eastBoundSpawnPoint = () => ({
    position: new Vector2({
      x: this.center.x - this.streetLength - this.laneWidth,
      y: this.center.y + (this.laneWidth / 2),
    }),
    velocity: new Vector2({
      x: 5,
      y: 0,
    }),
    rotation: 0,
  })
}

Intersection.schema = {
  laneWidth: {
    type: Types.Number,
    default: 100,
  },
  streetLength: {
    type: Types.Number,
    default: 0,
  },
  center: {
    type: Vector2Type,
    default: new Vector2(0, 0),
  },
}