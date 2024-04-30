import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_RADIO_FIELD } from '../../../../_ids'

export interface I {
  style: object
  value: string
  maxLength: number
}

export interface O {
  value: string
}

export default class RadioField extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'value', 'name'],
        o: [],
      },
      {},
      system,
      ID_RADIO_FIELD
    )
  }
}
