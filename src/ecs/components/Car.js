import { Component, Types } from 'ecsy'
import { Vector2, Vector2Type } from '../types/Vector2'


export class Car extends Component { }

Car.schema = {
  velocity: {
    type: Vector2Type,
    default: new Vector2(),
  },
  height: {
    type: Types.Number,
    default: 80,
  },
  width: {
    type: Types.Number,
    default: 40,
  },
  brakingForce: {
    type: Types.Number,
    default: 0.1,
  },
  targetSpeed: {
    type: Types.Number,
    default: 5,
  },
  maxSpeed: {
    type: Types.Number,
    default: 10,
  },
  accelerationForce: {
    type: Types.Number,
    default: 0.1,
  },
}