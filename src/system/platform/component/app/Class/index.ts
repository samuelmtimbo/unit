import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_UNIT_CLASS } from '../../../../_ids'

export interface I<T> {
  id: string
  style: Dict<any>
}

export interface O<T> {}

export default class Class<T> extends Element_<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['id', 'style', 'attr'],
        o: [],
      },
      {},
      system,
      ID_UNIT_CLASS
    )
  }
}
