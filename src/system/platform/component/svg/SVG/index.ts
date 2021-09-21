import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'

export interface I {
  style: object
  viewBox: string
}

export interface O {}

export default class SVG extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'viewBox'],
        o: [],
      },
      config
    )

    this._defaultState = {}
  }
}
