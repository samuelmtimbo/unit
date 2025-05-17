import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_POLYLINE } from '../../../../_ids'
import { Attr, Style } from '../../../Style'

export interface I {
  attr: Attr
  style: Style
  points: string
}

export interface O {}

export default class SVGPolyline extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'style', 'points'],
        o: [],
      },
      {},
      system,
      ID_POLYLINE
    )
  }
}
