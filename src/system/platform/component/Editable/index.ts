import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { ID_EDITABLE } from '../../../_ids'
import { Style } from '../../Props'

export interface I {
  style: Style
}

export interface O {}

export default class Editable extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style'],
        o: [],
      },
      {},
      system,
      ID_EDITABLE
    )
  }
}
