import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  class: string
  style: object
}

export interface O {}

export default class Zoom extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'className'],
        o: [],
      },
      config
    )
  }
}
