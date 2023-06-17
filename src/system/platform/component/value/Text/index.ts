import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_TEXT_0 } from '../../../../_ids'

export interface I {
  value: string
}

export interface O {}

export default class Text0 extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value'],
        o: [],
      },
      {},
      system,
      ID_TEXT_0
    )

    this._defaultState = {
      value: '',
    }
  }
}
