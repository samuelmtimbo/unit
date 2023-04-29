import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_SELECT } from '../../../../_ids'

export interface I {
  style: object
  value: string
}

export interface O {}

export default class Select extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'style'],
        o: [],
      },
      {},
      system,
      ID_SELECT
    )

    this._defaultState = {
      value: '',
    }
  }
}
