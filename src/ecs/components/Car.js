import { Component, Types } from 'ecsy'
import { Vector2, Vector2Type } from '../types/Vector2'

export class Car extends Component { }

Car.schema = {
  position: {
    type: Vector2Type,
    default: new Vector2(),
  },
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
}