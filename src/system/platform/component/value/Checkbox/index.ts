import { Field } from '../../../../../Class/Field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_CHECKBOX } from '../../../../_ids'

export interface I {
  style: Dict<string>
  attr: Dict<string>
  value: boolean
}

export interface O {
  value: boolean
}

export default class Checkbox extends Field<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'attr', 'value'],
        o: ['value'],
      },
      {},
      system,
      ID_CHECKBOX
    )

    this._defaultState = {
      value: false,
    }
  }
}
