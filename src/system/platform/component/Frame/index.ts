import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  element: Element
}

export interface O {}

export default class FrameElement extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['element'],
        o: [],
      },
      config
    )
  }
}
