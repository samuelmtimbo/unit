import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FILTER_EFFECT_SPOT_LIGHT } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  x: number
  y: number
  z: number
  pointsAtX: number
  pointsAtY: number
}

export interface O {}

export default class SVGSFilterEffectSpotLight extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'x', 'y', 'z', 'pointsAtX', 'pointsAtY', 'pointsAtZ'],
        o: [],
      },
      {},
      system,
      ID_FILTER_EFFECT_SPOT_LIGHT
    )
  }
}
