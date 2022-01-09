import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  style: object
  value: string
  maxLength: number
}

export interface O {}

export default class TextInput extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['value', 'style', 'maxLength'],
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
