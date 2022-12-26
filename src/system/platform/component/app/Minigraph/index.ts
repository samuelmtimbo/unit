import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { GraphSpec } from '../../../../../types'
import { Dict } from '../../../../../types/Dict'
import { ID_MINIGRAPH } from '../../../../_ids'

export interface I<T> {
  width: number
  height: number
  spec: GraphSpec
  style: Dict<string>
}

export interface O<T> {}

export default class Minigraph<T> extends Element_<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['spec', 'style', 'width', 'height'],
        o: [],
      },
      {},
      system,
      ID_MINIGRAPH
    )
  }
}
