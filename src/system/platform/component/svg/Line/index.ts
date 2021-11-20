import { Element } from '../../../../../Class/Element/Element'

export interface I {}

export interface O {}

export default class SVGLine extends Element<I, O> {
  constructor() {
    super({
      i: ['class', 'style', 'x1', 'x2', 'y1', 'y2'],
      o: [],
    })
  }
}
