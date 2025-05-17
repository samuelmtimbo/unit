import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_ANIMATE_MOTION } from '../../../../_ids'
import { Attr } from '../../../Style'

export interface I {
  attr: Attr
  dur: string
  repeatCount: string
}

export interface O {}

export default class SVGAnimateMotion extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'dur', 'repeatCount'],
        o: [],
      },
      {},
      system,
      ID_ANIMATE_MOTION
    )
  }
}
