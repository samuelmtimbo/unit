import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_NUMBER_FIELD } from '../../../../_ids'

export interface I {
  style: object
  value: number
}

export interface O {}

export default class NumberField extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'value', 'min', 'max'],
        o: [],
      },
      {},
      system,
      ID_NUMBER_FIELD
    )

    this._defaultState = {
      value: 0,
    }
  }
}
