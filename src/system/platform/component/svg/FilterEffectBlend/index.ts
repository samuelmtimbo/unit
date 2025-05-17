import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FILTER_EFFECT_BLEND } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  in: string
  in2: string
  mode: string
}

export interface O {}

export default class SVGSFilterEffectBlend extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'in', 'in2', 'mode'],
        o: [],
      },
      {},
      system,
      ID_FILTER_EFFECT_BLEND
    )
  }
}
