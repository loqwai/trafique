/* eslint-disable react/no-direct-mutation-state */
import { Component, Types } from 'ecsy'

const STATE_TRANSITIONS = {
  red: 'green',
  yellow: 'red',
  green: 'yellow',
}

export class TrafficLight extends Component { 
  cycle = () => {
    this.state = STATE_TRANSITIONS[this.state]
  }
}

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