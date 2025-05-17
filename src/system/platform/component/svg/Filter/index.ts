import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FILTER_0 } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  id: string
}

export interface O {}

export default class SVGFilter extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'id'],
        o: [],
      },
      {},
      system,
      ID_FILTER_0
    )
  }
}
