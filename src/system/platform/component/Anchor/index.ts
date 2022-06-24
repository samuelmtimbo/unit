import { Element_ } from '../../../../Class/Element'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  style: object
}

export interface O {}

export default class Anchor extends Element_<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'href', 'target'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
