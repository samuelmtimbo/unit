import { Element } from '../../../../../Class/Element/Element'

export interface I {
  style: object
}

export interface O {}

export default class TextArea extends Element<I, O> {
  constructor() {
    super({
      i: ['value', 'style'],
      o: [],
    })

    this._defaultState = {
      value: '',
    }
  }
}
