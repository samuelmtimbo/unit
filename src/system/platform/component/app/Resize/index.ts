import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_RESIZE } from '../../../../_ids'

export interface I<T> {}

export interface O<T> {}

export default class Resize<T> extends Element_<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['size'],
        o: [],
      },
      {},
      system,
      ID_RESIZE
    )
  }
}
