import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_LINEAR_GRADIENT } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  id: string
  x1: string
  y1: string
  x2: string
  y2: string
}

export interface O {}

export default class SVGLinearGradient extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'id', 'x1', 'y1', 'x2', 'y2'],
        o: [],
      },
      {},
      system,
      ID_LINEAR_GRADIENT
    )
  }
}
