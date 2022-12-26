import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_CIRCLE } from '../../../../_ids'
import { Style } from '../../../Props'

export interface I {
  style: Style
  x: number
  y: number
  r: number
}

export interface O {}

export default class SVGCircle extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'x', 'y', 'r'],
        o: [],
      },
      {},
      system,
      ID_CIRCLE
    )
  }
}
