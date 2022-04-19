import { Component, Types } from 'ecsy'
import { Vector2, Vector2Type } from '../types/Vector2'

export class Intersection extends Component { }

// Assuming the play field is a 1000x1000 space
Intersection.schema = {
  laneWidth: {
    type: Types.Number,
    default: 100,
  },
  streetLength: {
    type: Types.Number,
    default: 400, // (1000 - (laneWidth * 2)) / 2
  },
  center: {
    type: Vector2Type,
    default: new Vector2(500, 500),
  },
}