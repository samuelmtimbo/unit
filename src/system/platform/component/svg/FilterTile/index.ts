import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FILTER_EFFECT_TILE } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  in: string
}

export interface O {}

export default class SVGSFilterEffectTile extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'in'],
        o: [],
      },
      {},
      system,
      ID_FILTER_EFFECT_TILE
    )
  }
}
