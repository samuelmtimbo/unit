import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'

export interface I {}

export interface O {}

export default class SVGLine extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['class', 'style', 'x1', 'x2', 'y1', 'y2'],
        o: [],
      },
      config
    )
  }
}
