import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'

export interface I {
  style: object
  value: string
  maxLength: number
}

export interface O {}

export default class InputUnit extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['value', 'style', 'maxLength'],
        o: [],
      },
      config
    )

    this._defaultState = {
      value: '',
    }
  }
}
