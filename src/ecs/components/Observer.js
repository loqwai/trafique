import { Component, Types } from 'ecsy'

export class Observer extends Component { }

Observer.schema = {
  observations: {
    type: Types.Array,
    default: [],
  },
}