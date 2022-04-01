import { Component, Types } from 'ecsy'

export class Score extends Component { }

Score.schema = {
  numCollisions: {
    type: Types.Number,
    default: 0,
  },
  numArrived: {
    type: Types.Number,
    default: 0,
  },
}