import { Element } from '../../../../../Class/Element/Element'
import { Dict } from '../../../../../types/Dict'

export interface I {
  href: string
  class: string
  style: Dict<string>
}

export interface O {}

export default class SVGUse extends Element<I, O> {
  constructor() {
    super({
      i: ['href', 'class', 'style'],
      o: [],
    })
  }
}
