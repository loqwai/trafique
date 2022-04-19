import { Component, Types } from 'ecsy'

export class TrafficLight extends Component { }

TrafficLight.schema = {
  state: {
    type: Types.String,
    default: 'red',
  },
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