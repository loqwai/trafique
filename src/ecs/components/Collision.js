import { Component, Types } from 'ecsy'
import { Vector2, Vector2Type } from '../types/Vector2'

export class Collision extends Component { }

Collision.schema = {
  position: {
    type: Vector2Type,
    default: new Vector2(),
  },
  carA: {
    type: Types.Number,
    default: -1,
  },
  carB: {
    type: Types.Number,
    default: -1,
  },
}