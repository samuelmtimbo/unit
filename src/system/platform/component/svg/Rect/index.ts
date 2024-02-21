import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_RECT } from '../../../../_ids'
import { Style } from '../../../Style'

export interface I {
  style: Style
  x: number
  y: number
  width: number
  height: number
}

export interface O {}

export default class SVGRect extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'x', 'y', 'width', 'height'],
        o: [],
      },
      {},
      system,
      ID_RECT
    )
  }
}
