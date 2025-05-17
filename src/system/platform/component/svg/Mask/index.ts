import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_MASK } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  id: string
}

export interface O {}

export default class SVGMask extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'id'],
        o: [],
      },
      {},
      system,
      ID_MASK
    )
  }
}
