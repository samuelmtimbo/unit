import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  style: object
  value: number
}

export interface O {}

export default class NumberInput extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'value', 'min', 'max'],
        o: [],
      },
      {},
      system,
      pod
    )

    this._defaultState = {
      value: 0,
    }
  }
}
