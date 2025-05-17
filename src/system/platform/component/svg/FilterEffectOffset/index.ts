import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FILTER_EFFECT_OFFSET } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  dx: number
  dy: number
}

export interface O {}

export default class SVGSFilterEffectOffset extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'dx', 'dy'],
        o: [],
      },
      {},
      system,
      ID_FILTER_EFFECT_OFFSET
    )
  }
}
