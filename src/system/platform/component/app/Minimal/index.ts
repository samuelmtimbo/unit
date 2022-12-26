import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_UNIT_MINIMAL } from '../../../../_ids'

export interface I<T> {
  id: string
}

export interface O<T> {}

export default class Minimal<T> extends Element_<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['id', 'style'],
        o: [],
      },
      {},
      system,
      ID_UNIT_MINIMAL
    )
  }
}
