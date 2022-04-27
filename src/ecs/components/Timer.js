import { Component, Types } from 'ecsy'

export class Timer extends Component { }

Timer.schema = {
  remaining: {
    type: Types.Number,
    default: 0,
  },
  running: {
    type: Types.Boolean,
    default: true,
  },
}