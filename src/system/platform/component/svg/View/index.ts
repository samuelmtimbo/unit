import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_ANIMATE_0 } from '../../../../_ids'

export interface I {
  attributeName: string
  type: string
  from: string
  to: string
  dur: string
  repeatCount: string
}

export interface O {}

// view: '<view id="view1" viewBox="0 0 100 100"/>',

export default class SVGView extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'attributeName', 'from', 'to', 'dur', 'repeatCount'],
        o: [],
      },
      {},
      system,
      ID_ANIMATE_0
    )
  }
}
