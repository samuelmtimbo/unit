import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_RADIAL_GRADIENT } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  id: string
  cx: number
  cy: number
  r: string
}

export interface O {}

export default class SVGRadialGradient extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'id', 'cx', 'cy', 'r'],
        o: [],
      },
      {},
      system,
      ID_RADIAL_GRADIENT
    )
  }
}
