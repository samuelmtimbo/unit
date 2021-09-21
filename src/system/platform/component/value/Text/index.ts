import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'

export interface I {
  value: string
}

export interface O {}

export default class TextUnit extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['value'],
        o: [],
      },
      config
    )

    this._defaultState = {
      value: '',
    }
  }
}
