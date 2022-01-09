import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface I {
  style: Dict<string>
  attr: Dict<string>
  class: string
  value: boolean
}

export interface O {}

export default class Checkbox extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['class', 'style', 'attr', 'value'],
        o: [],
      },
      {},
      system,
      pod
    )

    this._defaultState = {
      value: false,
    }
  }
}
