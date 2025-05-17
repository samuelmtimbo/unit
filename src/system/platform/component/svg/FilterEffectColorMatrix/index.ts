import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FILTER_EFFECT_COLOR_MATRIX } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  type: string
  values: string
}

export interface O {}

export default class SVGSFilterEffectColorMatrix extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'type', 'values'],
        o: [],
      },
      {},
      system,
      ID_FILTER_EFFECT_COLOR_MATRIX
    )
  }
}
