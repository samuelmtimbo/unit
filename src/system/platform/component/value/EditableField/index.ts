import { Field } from '../../../../../Class/Field'
import { System } from '../../../../../system'
import { ID_EDITABLE_FIELD } from '../../../../_ids'

export interface I {
  style: object
  value: string
  maxLength: number
}

export interface O {
  value: string
}

export default class EditableField extends Field<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'style', 'maxLength'],
        o: ['value'],
      },
      {},
      system,
      ID_EDITABLE_FIELD
    )

    this._defaultState = {
      value: '',
    }
  }
}
