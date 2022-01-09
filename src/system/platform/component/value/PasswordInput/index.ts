import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  style: object
  value: string
}

export interface O {}

export default class Select extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'value'],
        o: [],
      },
      {},
      system,
      pod
    )

    this._defaultState = {
      value: '',
    }
  }
}
