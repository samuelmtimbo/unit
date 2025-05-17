import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FILTER_EFFECT_CONVOLVE_MATRIX } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  lightingColor: string
  surfaceScale: string
}

export interface O {}

export default class SVGSFilterEffectConvolveMatrix extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'order', 'kernelMatrix'],
        o: [],
      },
      {},
      system,
      ID_FILTER_EFFECT_CONVOLVE_MATRIX
    )
  }
}
