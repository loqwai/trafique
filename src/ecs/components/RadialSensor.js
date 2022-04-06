import { Types, SystemStateComponent } from 'ecsy'
import {  Vector2, Vector2Type } from '../types/Vector2'

export class RadialSensor extends SystemStateComponent { }

RadialSensor.schema = {
  position: {
    type: Vector2Type,
    default: new Vector2(),
  },
  rotation: {
    type: Types.Number,
    default: 0,
  },
  radius: {
    type: Types.Number,
    default: 0,
  },
  arc: {
    type: Types.Number,
    default: 2 * Math.PI,
  },
  collider: {
    type: Types.Ref,
  },
}