import { Component } from 'ecsy'
import { Vector2, Vector2Type } from '../types/Vector2'


export class Position extends Component { }

Position.schema = {
  value: {
    type: Vector2Type,
    default: new Vector2(),
  },
}