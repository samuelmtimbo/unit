import { Element } from '../../../../../Class/Element/Element'

export interface I {
  value: number
  style: object
  min: number
  max: number
}

export interface O {}

export default class Slider extends Element<I, O> {
  constructor() {
    super({
      i: ['value', 'style', 'min', 'max'],
      o: [],
    })

    this._defaultState = {
      value: 0,
      min: 0,
      max: 100,
    }
  }
}
