import { Component, Types } from 'ecsy'
import { Vector2, Vector2Type } from '../types/Vector2'

export class StopSign extends Component { }

StopSign.schema = {
  locationName: {
    type: Types.String,
    default: '',
  },
  intersectionId: {
    type: Types.Number,
    default: -1,
  },
  position: {
    type: Vector2Type,
    default: new Vector2(),
  },
}