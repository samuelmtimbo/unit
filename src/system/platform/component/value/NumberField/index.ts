import { Value } from '../../../../../Class/Value'
import { System } from '../../../../../system'
import { ID_NUMBER_FIELD } from '../../../../_ids'

export interface I {
  style: object
  value: number
}

export interface O {
  value: number
}

export default class NumberField extends Value<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'min', 'max'],
        o: [],
      },
      {},
      system,
      ID_NUMBER_FIELD
    )

    this._defaultState = {
      value: 0,
    }
  }
}
