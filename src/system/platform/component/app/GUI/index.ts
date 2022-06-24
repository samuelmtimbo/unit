import { Element_ } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface I<T> {
  style?: Dict<string>
}

export interface O<T> {}

export default class GUI<T> extends Element_<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'disabled'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
