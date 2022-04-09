import { Component, Types } from 'ecsy'

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
  radius: {
    type: Types.Number,
    default: 40,
  },
}