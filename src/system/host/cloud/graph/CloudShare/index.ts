import { Functional } from '../../../../../Class/Functional'
import { Graph } from '../../../../../Class/Graph'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export type I = {
  graph: Graph
}

export type O = {}

export default class CloudShare extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['graph'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
