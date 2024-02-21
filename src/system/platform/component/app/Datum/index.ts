import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_DATUM } from '../../../../_ids'
import { Style } from '../../../Style'

export interface I<T> {
  id: string
  style: Style
}

export interface O<T> {}

export default class Datum<T> extends Element_<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['data'],
        o: [],
      },
      {},
      system,
      ID_DATUM
    )
  }
}
