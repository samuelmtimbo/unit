import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  style: object
}

export interface O {}

export default class Anchor extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'href', 'target'],
        o: [],
      },
      config
    )
  }
}
