import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_SVG_FILTER_EFFECT_MORPHOLOGY } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  operator: number
  radius: number
}

export interface O {}

export default class SVGSFilterEffectMorphology extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'operator', 'radius'],
        o: [],
      },
      {},
      system,
      ID_SVG_FILTER_EFFECT_MORPHOLOGY
    )
  }
}
