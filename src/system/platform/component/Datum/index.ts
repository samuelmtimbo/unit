import { Element } from '../../../../Class/Element/Element'

export interface I {
  value: any
  style: object
}

export interface O {}

export default class Datum extends Element<I, O> {
  constructor() {
    super({
      i: ['style', 'value'],
      o: [],
    })
  }
}
