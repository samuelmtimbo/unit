import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FILTER_EFFECT_DIFFUSE_LIGHTING } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  lightingColor: string
  surfaceScale: string
}

export interface O {}

export default class SVGSFilterEffectDiffuseLighting extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'lightingColor', 'surfaceScale'],
        o: [],
      },
      {},
      system,
      ID_FILTER_EFFECT_DIFFUSE_LIGHTING
    )
  }
}
