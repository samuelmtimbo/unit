import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_POLYGON } from '../../../../_ids'
import { Attr, Style } from '../../../Style'

export interface I {
  attr: Attr
  style: Style
}

export interface O {}

export default class SVGPolygon extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'style', 'points'],
        o: [],
      },
      {},
      system,
      ID_POLYGON
    )
  }
}
