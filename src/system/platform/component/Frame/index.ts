import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { CA } from '../../../../types/interface/CA'
import { ID_FRAME } from '../../../_ids'

export interface I {
  style: Dict<string>
}

export interface O {
  board: CA
}

export default class FrameElement extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style'],
        o: ['board'],
      },
      {},
      system,
      ID_FRAME
    )
  }
}
