import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  value: number
  style: object
  min: number
  max: number
}

export interface O {}

export default class Slider extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['value', 'style', 'min', 'max'],
        o: [],
      },
      {},
      system,
      pod
    )

    this._defaultState = {
      value: 0,
      min: 0,
      max: 100,
    }
  }
}
