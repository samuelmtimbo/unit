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

export default class PasswordField extends Field<'value', I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'value', 'attr'],
        o: ['value'],
      },
      {},
      system,
      ID_PASSWORD_FIELD,
      'value'
    )

    this._defaultState = {
      value: '',
    }
  }
}
