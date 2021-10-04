import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'

export interface I {
  value: number
  style: object
  min: number
  max: number
}

export interface O {}

export default class Slider extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['value', 'style', 'min', 'max'],
        o: [],
      },
      config
    )

    this._defaultState = {
      value: 0,
      min: 0,
      max: 100,
    }
  }
}
