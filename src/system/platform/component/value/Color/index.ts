import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_COLOR } from '../../../../_ids'

export interface I {
  value: string
}

export interface O {}

export default class Color<I, O> extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value'],
        o: [],
      },
      {},
      system,
      ID_COLOR
    )

    this._defaultState = {
      value: '#000000',
    }
  }
}
