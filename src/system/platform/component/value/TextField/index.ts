import { Field } from '../../../../../Class/Field'
import { System } from '../../../../../system'
import { ID_TEXT_FIELD } from '../../../../_ids'

export interface I {
  style: object
  value: string
  maxLength: number
  attr: object
}

export interface O {
  value: string
}

export default class TextField extends Field<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'style', 'maxLength', 'attr'],
        o: ['value'],
      },
      {},
      system,
      ID_TEXT_FIELD
    )

    this._defaultState = {
      value: '',
    }
  }
}
