import { Element } from '../../../../../Class/Element/Element'
import { Dict } from '../../../../../types/Dict'

export interface I {
  style: Dict<string>
  class: string
}

export interface O {}

export default class SVGTextPath extends Element<I, O> {
  constructor() {
    super({
      i: ['style', 'className'],
      o: [],
    })
  }
}
