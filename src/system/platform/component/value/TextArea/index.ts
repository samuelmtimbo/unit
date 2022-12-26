import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_TEXT_AREA } from '../../../../_ids'

export interface I {
  style: object
}

export interface O {}

export default class TextArea extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'style', 'placeholder'],
        o: [],
      },
      {},
      system,
      ID_TEXT_AREA
    )

    this._defaultState = {
      value: '',
      placeholder: '',
    }
  }
}
