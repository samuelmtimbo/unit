import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_SLIDER } from '../../../../_ids'

export interface I {
  value: number
  style: object
  min: number
  max: number
}

export interface O {}

export default class Slider extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'style', 'min', 'max'],
        o: [],
      },
      {},
      system,
      ID_SLIDER
    )

    this._defaultState = {
      value: 0,
      min: 0,
      max: 100,
    }
  }
}
