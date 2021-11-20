import { Element } from '../../../../../Class/Element/Element'

export interface I {
  style: object
  value: string
  maxLength: number
}

export interface O {}

export default class InputUnit extends Element<I, O> {
  constructor() {
    super({
      i: ['value', 'style', 'maxLength'],
      o: [],
    })

    this._defaultState = {
      value: '',
    }
  }
}
