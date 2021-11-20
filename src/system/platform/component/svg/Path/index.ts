import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'
import { Dict } from '../../../../../types/Dict'

export interface I {
  style: Dict<string>
  d: string
  fillRule: string
}

export interface O {}

export default class SVGPath extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'd', 'fillRule'],
        o: [],
      },
      config
    )

    this._defaultState = {
      d: '',
    }
  }
}
