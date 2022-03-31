
import { Types, SystemStateComponent } from 'ecsy'

export class CarCollisions extends SystemStateComponent { }

CarCollisions.schema = {
  collider: {
    type: Types.Ref,
  },
}