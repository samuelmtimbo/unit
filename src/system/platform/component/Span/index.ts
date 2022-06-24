import { Element_ } from '../../../../Class/Element'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  style: object
}

export interface O {}

export default class Span extends Element_<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
