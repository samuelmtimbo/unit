import { Field } from '../../../../../Class/Field'
import { System } from '../../../../../system'
import { ID_SLIDER } from '../../../../_ids'

export interface I {
  value: number
  style: object
  min: number
  max: number
  attr: object
}

export interface O {
  value: number
}

export default class Slider extends Field<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'style', 'min', 'max', 'attr'],
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

  initialValue() {
    const { value = 0, min = 0, max = 100 } = this._i

    // @ts-ignore
    return this._input?.value?.peak() ? value : min
  }
}
