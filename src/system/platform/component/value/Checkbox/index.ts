import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'
import { Dict } from '../../../../../types/Dict'

export interface I {
  style: Dict<string>
  attr: Dict<string>
  class: string
  value: boolean
}

export interface O {}

export default class Checkbox extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['class', 'style', 'attr', 'value'],
        o: [],
      },
      config
    )

    this._defaultState = {
      value: false,
    }
  }
}
