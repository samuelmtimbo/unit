import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_ELLIPSE } from '../../../../_ids'
import { Style } from '../../../Style'

export interface I {
  style: Style
  x: number
  y: number
  rx: number
  ry: number
}

export interface O {}

export default class SVGEllipse extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'x', 'y', 'rx', 'ry'],
        o: [],
      },
      {},
      system,
      ID_ELLIPSE
    )
  }
}
