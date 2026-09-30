import { Field } from '../../../../../Class/Field'
import { System } from '../../../../../system'
import { ID_RADIO_FIELD } from '../../../../_ids'
import { Attr } from '../../../Style'

export interface I {
  style: object
  value: string
  name: string
  attr: Attr
  checked: boolean
}

export interface O {
  value: string
  checked: boolean
}

export default class RadioField extends Field<['value', 'checked'], I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'value', 'name', 'attr', 'checked'],
        o: ['value', 'checked'],
      },
      {},
      system,
      ID_RADIO_FIELD,
      ['value', 'checked']
    )

    this._defaultState = {
      value: '',
      checked: false,
    }
  }
}
