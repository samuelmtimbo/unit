import { Element } from '../../../../Class/Element/Element'

export interface I {
  style: object
}

export interface O {}

export default class Span extends Element<I, O> {
  constructor() {
    super({
      i: ['style'],
      o: [],
    })
  }
}
