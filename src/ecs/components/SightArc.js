import { Types, Component } from 'ecsy'

export class SightArc extends Component { }

SightArc.schema = {
  arc: {
    type: Types.Number,
    default: 0,
  },
  distance: {
    type: Types.Number,
    default: 0,
  },
}