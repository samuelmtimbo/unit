import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_SET_1 } from '../../../../_ids'
import { Attr } from '../../../Style'

export interface I {
  attr: Attr
  attributeName: string
  to: string
  begin: string
  dur: string
}

export interface O {}

export default class SVGSet extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'attributeName', 'to', 'begin', 'dur'],
        o: [],
      },
      {},
      system,
      ID_SET_1
    )
  }
}
