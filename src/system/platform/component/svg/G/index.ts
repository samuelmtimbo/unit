import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {}

export interface O {}

export default class SVGG extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['class', 'style'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
