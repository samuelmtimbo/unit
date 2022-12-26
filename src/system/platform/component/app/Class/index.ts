import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_CLASS } from '../../../../_ids'

export interface I<T> {
  id: string
}

export interface O<T> {}

export default class Class<T> extends Element_<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['id'],
        o: [],
      },
      {},
      system,
      ID_CLASS
    )
  }
}
