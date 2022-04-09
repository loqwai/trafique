import { Component, Types } from 'ecsy'


export class Rotation extends Component { }

Rotation.schema = {
  value: {
    type: Types.Number,
    default: 0,
  },
}