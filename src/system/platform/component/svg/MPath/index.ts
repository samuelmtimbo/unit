import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_MPATH } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  href: string
}

export interface O {}

export default class SVGMPath extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'href'],
        o: [],
      },
      {},
      system,
      ID_MPATH
    )
  }
}
