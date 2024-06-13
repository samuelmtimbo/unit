import { bundleSpec } from '../../../../../bundle'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { GraphBundle } from '../../../../../types/GraphClass'
import { GraphSpec } from '../../../../../types/GraphSpec'
import { $Graph } from '../../../../../types/interface/async/$Graph'
import { $S } from '../../../../../types/interface/async/$S'
import { weakMerge } from '../../../../../weakMerge'
import { $wrap } from '../../../../../wrap'
import { ID_START } from '../../../../_ids'

export interface I {
  graph: GraphBundle
  system: $S
  opt: {
    paused?: boolean
  }
}

export interface O {
  graph: $Graph
}

export default class Start extends Semifunctional<I, O> {
  private _graph: $Graph

  constructor(system: System) {
    super(
      {
        fi: ['graph', 'system', 'opt'],
        fo: ['graph'],
        i: ['done'],
        o: [],
      },
      {
        input: {
          system: {
            ref: true,
          },
        },
        output: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_START
    )
  }

  f({ graph: Graph, system, opt }: I, done: Done<O>): void {
    const { paused } = opt || {}

    const { __bundle } = Graph

    const id = __bundle.unit.id

    const spec = (this.__system.getSpec(id) ?? __bundle.specs[id]) as GraphSpec

    const bundle = bundleSpec(
      spec,
      weakMerge(__bundle.specs, this.__system.specs)
    )

    const _ = ['G', 'C', 'U']

    const $graph = system.$newGraph({ bundle, _ })

    const graph = $wrap<$Graph>(this.__system, $graph, _)

    if (!paused) {
      graph.$play({})
    }

    if (!paused) {
      graph.$play({})
    }

    this._graph = graph

    done({ graph })
  }

  d() {
    if (this._graph) {
      this._graph = undefined
    }
  }

  onIterDataInputData(name: string, data: any) {
    // if (name === 'done') {
    this._forward_empty('graph')
    // }
  }
}
