import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'
import { Dict } from '../../../../../types/Dict'

export interface I {
  href: string
  class: string
  style: Dict<string>
}

export interface O {}

export default class SVGUse extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['href', 'class', 'style'],
        o: [],
      },
      config
    )
  }
}
