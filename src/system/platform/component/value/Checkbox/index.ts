import { Element } from '../../../../../Class/Element/Element'
import { Dict } from '../../../../../types/Dict'

export interface I {
  style: Dict<string>
  attr: Dict<string>
  class: string
  value: boolean
}

export interface O {}

export default class Checkbox extends Element<I, O> {
  constructor() {
    super({
      i: ['class', 'style', 'attr', 'value'],
      o: [],
    })

    this._defaultState = {
      value: false,
    }
  }
}
