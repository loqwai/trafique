import { Component, Types } from 'ecsy'

export class Car extends Component {

}

Car.schema = {
  horsepower: {
    type: Types.Number,
    default: 5,
  },
  x: {
    type: Types.Number,
    default: 0,
  },
  y: {
    type: Types.Number,
    default: 0,
  },
  height: {
    type: Types.Number,
    default: 80,
  },
  width: {
    type: Types.Number,
    default: 40,
  },
}