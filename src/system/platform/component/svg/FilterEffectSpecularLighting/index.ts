import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FILTER_EFFECT_SPECULAR_LIGHTING } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  azimuth: number
  elevation: number
}

export interface O {}

export default class SVGSFilterEffectSpecularLighting extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'specularExponent', 'lightingColor'],
        o: [],
      },
      {},
      system,
      ID_FILTER_EFFECT_SPECULAR_LIGHTING
    )
  }
}
