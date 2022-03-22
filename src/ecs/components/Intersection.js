import { Component, Types } from 'ecsy'
import { Vector2, Vector2Type } from '../types/Vector2'

export class Intersection extends Component { }

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