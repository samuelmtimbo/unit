import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'
import { Style } from '../../../Props'

export interface I {
  style: Style
  x: number
  y: number
  width: number
  height: number
}

export interface O {}

export default class SVGRect extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'x', 'y', 'width', 'height'],
        o: [],
      },
      config
    )
  }
}
