import { Element } from '../../../../Class/Element'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  value: any
  style: object
}

export interface O {}

export default class Datum extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'value'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
