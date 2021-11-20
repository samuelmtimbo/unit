import { Element } from '../../../../../Class/Element/Element'

export interface I {
  style: object
  value: string
}

export interface O {}

export default class Select extends Element<I, O> {
  constructor() {
    super({
      i: ['style', 'value'],
      o: [],
    })

    this._defaultState = {
      value: '',
    }
  }
}
