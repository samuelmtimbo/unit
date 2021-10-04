import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'

export interface I {
  style: object
  value: number
}

export interface O {}

export default class NumberInput extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'value', 'min', 'max'],
        o: [],
      },
      config
    )

    this._defaultState = {
      value: 0,
    }
  }
}
