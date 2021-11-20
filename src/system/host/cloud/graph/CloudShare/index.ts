import { Graph } from '../../../../../Class/Graph'
import { Config } from '../../../../../Class/Unit/Config'
import { Primitive } from '../../../../../Primitive'

export type I = {
  graph: Graph
}

export type O = {}

export default class CloudShare extends Primitive<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['graph'],
        o: [],
      },
      config
    )
  }
}
