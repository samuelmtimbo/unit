import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { ID_BOLD } from '../../../_ids'

export interface I {
  style: object
}

export interface O {}

export default class Bold extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style'],
        o: [],
      },
      {},
      system,
      ID_BOLD
    )
  }
}
