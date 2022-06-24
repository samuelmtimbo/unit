import { Element_ } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  value: string
}

export interface O {}

export default class Color<I, O> extends Element_<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['value'],
        o: [],
      },
      {},
      system,
      pod
    )

    this._defaultState = {
      value: '#000000',
    }
  }
}
