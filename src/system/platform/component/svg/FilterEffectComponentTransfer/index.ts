import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FILTER_EFFECT_COMPONENT_TRANSFER } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  lightingColor: string
  surfaceScale: string
}

export interface O {}

export default class SVGSFilterEffectComponentTransfer extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr'],
        o: [],
      },
      {},
      system,
      ID_FILTER_EFFECT_COMPONENT_TRANSFER
    )
  }
}
