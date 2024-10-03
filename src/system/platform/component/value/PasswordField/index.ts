import { Field } from '../../../../../Class/Field'
import { System } from '../../../../../system'
import { ID_PASSWORD_FIELD } from '../../../../_ids'

export interface I {
  style: object
  value: string
}

export interface O {
  value: string
}

export default class PasswordField extends Field<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'value', 'attr'],
        o: ['value'],
      },
      {},
      system,
      ID_PASSWORD_FIELD
    )

    this._defaultState = {
      value: '',
    }
  }
}
