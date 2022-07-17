import { Element_ } from '../../../../Class/Element'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { CA } from '../../../../types/interface/CA'

export interface I {
  style: Dict<string>
}

export interface O {
  board: CA
}

export default class FrameElement extends Element_<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style'],
        o: ['board'],
      },
      {},
      system,
      pod
    )
  }
}
