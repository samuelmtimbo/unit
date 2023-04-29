import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_CHECKBOX } from '../../../../_ids'

export interface I {
  style: Dict<string>
  attr: Dict<string>
  value: boolean
}

export interface O {}

export default class Checkbox extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'attr', 'value'],
        o: [],
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
