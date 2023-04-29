import { Value } from '../../../../../Class/Value'
import { System } from '../../../../../system'
import { ID_SLIDER } from '../../../../_ids'

export interface I {
  value: number
  style: object
  min: number
  max: number
}

export interface O {
  value: number
}

export default class Slider extends Value<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'style', 'min', 'max'],
        o: ['value'],
      },
      {},
      system,
      ID_SLIDER
    )

    this._defaultState = {
      value: 0,
      min: 0,
      max: 100,
    }
  }
}
