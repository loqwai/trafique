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
  observations: {
    type: Types.Array,
    default: [],
  },
  brakingForce: {
    type: Types.Number,
    default: 0.1,
  },
  maxSpeed: {
    type: Types.Number,
    default: 0.5,
  },
}