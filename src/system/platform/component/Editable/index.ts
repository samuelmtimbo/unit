import { Element } from '../../../../Class/Element'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Style } from '../../Props'

export interface I {
  style: Style
}

export interface O {}

export default class Editable extends Element<I, O> {
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
