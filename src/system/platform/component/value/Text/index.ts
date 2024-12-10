import { Field } from '../../../../../Class/Field'
import { System } from '../../../../../system'
import { ID_TEXT_0 } from '../../../../_ids'

export interface I {
  value: string
}

export interface O {
  value: string
}

export default class Text0 extends Field<'value', I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value'],
        o: ['value'],
      },
      {},
      system,
      ID_TEXT_0,
      'value'
    )

    this._defaultState = {}
  }
}
