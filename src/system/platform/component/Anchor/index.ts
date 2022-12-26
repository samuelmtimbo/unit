import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { ID_ANCHOR } from '../../../_ids'

export interface I {
  style: object
}

export interface O {}

export default class Anchor extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'href', 'target'],
        o: [],
      },
      {},
      system,
      ID_ANCHOR
    )
  }
}
