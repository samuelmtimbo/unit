import { Element } from '../../../../../Class/Element/Element'
import { Style } from '../../../Props'

export interface I {
  style: Style
  x: number
  y: number
  r: number
}

export interface O {}

export default class SVGCircle extends Element<I, O> {
  constructor() {
    super({
      i: ['style', 'x', 'y', 'r'],
      o: [],
    })
  }
}
