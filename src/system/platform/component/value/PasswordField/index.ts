import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_PASSWORD_FIELD } from '../../../../_ids'

export interface I {
  style: object
  value: string
}

export interface O {}

export default class PasswordField extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'value'],
        o: [],
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
