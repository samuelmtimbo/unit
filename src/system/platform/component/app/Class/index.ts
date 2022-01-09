import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  id: string
}

export interface O<T> {}

export default class Class<T> extends Element<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['id'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
