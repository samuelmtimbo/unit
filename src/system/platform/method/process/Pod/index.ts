import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Graph } from '../../../../../Class/Graph'
import { G } from '../../../../../interface/G'
import { PO } from '../../../../../interface/PO'
import { System } from '../../../../../system'
import { GraphSpec } from '../../../../../types'

export interface IPod extends PO {}

export interface IPodOpt {}

export interface I {
  spec: GraphSpec
}

export interface O {
  graph: G
}

export default class Pod extends Functional<I, O> {
  __ = ['G']

  constructor(system?: System) {
    super(
      {
        i: ['spec'],
        o: ['graph'],
      },
      {
        output: {
          graph: {
            ref: true,
          },
        },
      },
      system
    )
  }

  f({ spec }: I, done: Done<O>): void {
    const graph = new Graph(spec, {}, this.__system)

    graph.play()

    done({ graph })
  }
}
