import { Functional } from '../../../../../Class/Functional'
import { Graph } from '../../../../../Class/Graph'
import { Primitive } from '../../../../../Primitive'
import { System } from '../../../../../system'

export type I = {
  graph: Graph
}

export type O = {}

export default class CloudShare extends Functional<I, O> {
  constructor(system?: System) {
    super(
      {
        i: ['graph'],
        o: [],
      },
      {},
      system
    )
  }
}
