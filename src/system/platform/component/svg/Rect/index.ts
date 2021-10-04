import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'

export interface I {}

export interface O {}

export default class SVGRect extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['className', 'style', 'x', 'y', 'width', 'height'],
        o: [],
      },
      config
    )
  }
}
