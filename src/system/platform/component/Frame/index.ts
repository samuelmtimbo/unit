import { Element } from '../../../../Class/Element'
import { CA } from '../../../../types/interface/CA'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface I {
  style: Dict<string>
}

export interface O {
  board: CA
}

export default class FrameElement extends Element<I, O> {
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
