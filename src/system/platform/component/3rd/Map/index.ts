import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'

export interface I {
  style: object
}

export interface O {}

export default class Map extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['value', 'style'],
        o: [],
      },
      config
    )

    this._defaultState = {
      value: '',
    }
  }
}
