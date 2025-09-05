import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_RADIO_FIELD } from '../../../../_ids'
import { Attr } from '../../../Style'

export interface I {
  style: object
  value: string
  name: string
  attr: Attr
}

export interface O {
  value: string
}

export default class RadioField extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'value', 'name', 'attr'],
        o: [],
      },
      {},
      system,
      ID_RADIO_FIELD
    )
  }
}
