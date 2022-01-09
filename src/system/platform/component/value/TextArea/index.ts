import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  style: object
}

export interface O {}

export default class TextArea extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['value', 'style'],
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
