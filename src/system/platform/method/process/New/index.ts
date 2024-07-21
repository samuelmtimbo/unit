import { Done } from '../../../../../Class/Functional/Done'
import { Graph } from '../../../../../Class/Graph'
import { Holder } from '../../../../../Class/Holder'
import { start } from '../../../../../start'
import { System } from '../../../../../system'
import { GraphBundle } from '../../../../../types/GraphClass'
import { GraphSpec } from '../../../../../types/GraphSpec'
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

  f({ graph: graphClass }: I, done: Done<O>): void {
    // console.log('New', 'f', bundle)

    const { unit, specs = {} } = graphClass.__bundle

    this.__system.injectSpecs(specs)

    const spec = this.__system.getSpec(unit.id) as GraphSpec

    const graph = start(this.__system, { spec, specs })

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
