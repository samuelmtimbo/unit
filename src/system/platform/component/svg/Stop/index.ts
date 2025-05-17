import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_ANIMATE_0 } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  offset: string
  stopColor: string
  stopOpacity: string
}

export interface O {}

// '<stop offset="50%" stop-color="red" stop-opacity="1"/>',

export default class SVGStop extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'offset', 'stopColor', 'stopOpacity'],
        o: [],
      },
      {},
      system,
      ID_ANIMATE_0
    )
  }
}
