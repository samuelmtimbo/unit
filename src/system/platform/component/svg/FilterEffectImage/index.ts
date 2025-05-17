import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FILTER_EFFECT_IMAGE } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  x: number
  y: number
  width: number
  height: number
}

export interface O {}

export default class SVGSFilterEffectImage extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'x', 'y', 'width', 'height'],
        o: [],
      },
      {},
      system,
      ID_FILTER_EFFECT_IMAGE
    )
  }
}
