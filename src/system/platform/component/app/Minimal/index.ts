import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  id: string
}

export interface O<T> {}

export default class Minimal<T> extends Element<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['id', 'style'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
