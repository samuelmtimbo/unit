import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface I<T> {
  value: string
  style: Dict<string>
}

export interface O<T> {}

export default class IOButton<T> extends Element<I<T>, O<T>> {
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
  }
}
