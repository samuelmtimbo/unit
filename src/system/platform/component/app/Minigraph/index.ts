import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { GraphSpec } from '../../../../../types'
import { Dict } from '../../../../../types/Dict'

export interface I<T> {
  width: number
  height: number
  spec: GraphSpec
  style: Dict<string>
}

export interface O<T> {}

export default class Minigraph<T> extends Element<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['spec', 'style', 'width', 'height'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
