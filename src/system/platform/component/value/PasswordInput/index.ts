import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'

export interface I {
  style: object
  value: string
}

export interface O {}

export default class Select extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'value'],
        o: [],
      },
      config
    )

    this._defaultState = {
      value: '',
    }
  }
}
