import { Element } from '../../../../../Class/Element/Element'

export interface I {
  style: object
  value: number
}

export interface O {}

export default class NumberInput extends Element<I, O> {
  constructor() {
    super({
      i: ['style', 'value', 'min', 'max'],
      o: [],
    })

    this._defaultState = {
      value: 0,
    }
  }
}
