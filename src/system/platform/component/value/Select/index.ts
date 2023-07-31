import { Field } from '../../../../../Class/Field'
import { System } from '../../../../../system'
import { ID_SELECT } from '../../../../_ids'

export interface I {
  style: object
  value: string
}

export interface O {
  value: string
}

export default class Select extends Field<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'style'],
        o: ['value'],
      },
      {},
      system,
      ID_SELECT
    )

    this._defaultState = {
      value: '',
    }
  }
}
