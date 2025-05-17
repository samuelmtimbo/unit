import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FILTER_EFFECT_POINT_LIGHT } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  azimuth: number
  elevation: number
}

export interface O {}

export default class SVGSFilterEffectPointLight extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'azimuth', 'elevation'],
        o: [],
      },
      {},
      system,
      ID_FILTER_EFFECT_POINT_LIGHT
    )
  }
}
