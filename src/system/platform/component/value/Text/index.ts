import { Element } from '../../../../../Class/Element/Element'

export interface I {
  value: string
}

export interface O {}

export default class TextUnit extends Element<I, O> {
  constructor() {
    super({
      i: ['value'],
      o: [],
    })

    this._defaultState = {
      value: '',
    }
  }
}
