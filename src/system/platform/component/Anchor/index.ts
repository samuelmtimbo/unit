import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  class: string
  style: object
}

export interface O {}

export default class Anchor extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'className', 'href', 'target'],
        o: [],
      },
      config
    )
  }
}
