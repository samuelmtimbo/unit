import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_G } from '../../../../_ids'

export interface I {
  style: object
  attr: Dict<string>
}

export interface O {}

export default class SVGG extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'attr'],
        o: [],
      },
      {},
      system,
      ID_G
    )
  }
}
