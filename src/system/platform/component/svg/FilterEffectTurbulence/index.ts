import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_SVG_FILTER_EFFECT_TURBULENCE } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  offset: string
  stopColor: string
  stopOpacity: string
}

export interface O {}

export default class SVGFilterEffectTurbulence extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'type', 'baseFrequency', 'numOctaves'],
        o: [],
      },
      {},
      system,
      ID_SVG_FILTER_EFFECT_TURBULENCE
    )
  }
}
