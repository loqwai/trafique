import { Types, SystemStateComponent } from 'ecsy'
import {  Vector2, Vector2Type } from '../types/Vector2'

export class RadialSensor extends SystemStateComponent { }

RadialSensor.schema = {
  position: {
    type: Vector2Type,
    default: new Vector2(),
  },
  radius: {
    type: Types.Number,
    default: 0,
  },
  collider: {
    type: Types.Ref,
  },
}