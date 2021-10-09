import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'

export interface I {
  style: object
}

export interface O {}

export default class CodeEditor extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['value', 'style', 'config', 'theme', 'lang'],
        o: [],
      },
      config
    )

    this._defaultState = {
      value: '',
    }
  }
}
