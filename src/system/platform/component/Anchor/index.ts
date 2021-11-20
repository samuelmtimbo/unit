import { Element } from '../../../../Class/Element/Element'

export interface I {
  style: object
}

export interface O {}

export default class Anchor extends Element<I, O> {
  constructor() {
    super({
      i: ['style', 'href', 'target'],
      o: [],
    })
  }
}
