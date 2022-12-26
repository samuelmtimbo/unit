import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_TEXT_FIELD } from '../../../../_ids'

export interface I {
  style: object
  value: string
  maxLength: number
}

export interface O {}

export default class TextField extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'style', 'maxLength'],
        o: [],
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
