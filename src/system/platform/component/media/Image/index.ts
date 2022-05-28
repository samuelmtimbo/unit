import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  src: string
  style: object
}

export interface O {}

export default class Image extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['src', 'style'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
