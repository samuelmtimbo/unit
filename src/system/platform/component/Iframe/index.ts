import { Element } from '../../../../Class/Element'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  src: string
  style: object
}

export interface O {}

export default class Iframe extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['src', 'srcdoc', 'style'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
