import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_TRANSCEND } from '../../../../_ids'

export interface I<T> {
  style?: Dict<string>
}

export interface O<T> {}

export default class Transcend<T> extends Element_<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['style'],
        o: [],
      },
      {},
      system,
      ID_TRANSCEND
    )
  }
}
