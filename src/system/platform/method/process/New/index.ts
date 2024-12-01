import { Done } from '../../../../../Class/Functional/Done'
import { Graph } from '../../../../../Class/Graph'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { GraphBundle } from '../../../../../types/GraphClass'
import { ID_NEW_0 } from '../../../../_ids'

export interface I {
  graph: GraphBundle
  done: any
}

export interface O {
  graph: Graph
}

export default class New extends Holder<I, O> {
  private _graph: Graph

  constructor(system: System) {
    super(
      {
        fi: ['graph'],
        fo: ['graph'],
        i: [],
      },
      {
        output: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_NEW_0
    )
  }

  f({ graph: Class }: I, done: Done<O>): void {
    const graph = new Class(this.__system)

    this._graph = graph

    done({ graph })
  }

  d() {
    if (this._graph) {
      this._graph.destroy()

      this._graph = undefined
    }
  }
}
