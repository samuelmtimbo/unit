import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_TEXT } from '../../../../_ids'

export interface I {
  value: string
}

export interface O {}

export default class Text_ extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value'],
        o: [],
      },
      {},
      system,
      ID_TEXT
    )

    this._defaultState = {
      value: '',
    }
  }
}
