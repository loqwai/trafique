import { Component, Types } from 'ecsy'
import { Vector2, Vector2Type } from '../types/Vector2'

export class Intersection extends Component {
  getSpawnPoints = () => [
    this._northSpawnPoint(),
    this._southSpawnPoint(),
    this._eastSpawnPoint(),
    this._westSpawnPoint(),
  ]

  northBoundStopSignPosition = () => new Vector2({
    x: this.center.x + (1.5 * this.laneWidth),
    y: this.center.y + (1.5 * this.laneWidth),
  })

  southBoundStopSignPosition = () => new Vector2({
    x: this.center.x - (1.5 * this.laneWidth),
    y: this.center.y - (1.5 * this.laneWidth),
  })

  _northSpawnPoint = () => ({
    position: new Vector2({
      x: this.center.x - (this.laneWidth / 2),
      y: this.center.y - this.streetLength - this.laneWidth,
    }),
    velocity: new Vector2({
      x: 0,
      y: 5,
    }),
    rotation: 0,
  })

  _southSpawnPoint = () => ({
    position: new Vector2({
      x: this.center.x + (this.laneWidth / 2),
      y: this.center.y + this.streetLength + this.laneWidth,
    }),
    velocity: new Vector2({
      x: 0,
      y: -5,
    }),
    rotation: Math.PI,
  })

  _eastSpawnPoint = () => ({
    position: new Vector2({
      x: this.center.x + this.streetLength + this.laneWidth,
      y: this.center.y - (this.laneWidth / 2),
    }),
    velocity: new Vector2({
      x: -5,
      y: 0,
    }),
    rotation: Math.PI / 2,
  })

  _westSpawnPoint = () => ({
    position: new Vector2({
      x: this.center.x - this.streetLength - this.laneWidth,
      y: this.center.y + (this.laneWidth / 2),
    }),
    velocity: new Vector2({
      x: 5,
      y: 0,
    }),
    rotation: -Math.PI / 2,
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