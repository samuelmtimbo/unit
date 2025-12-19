import { bundleSpec } from '../../../../../bundle'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { getSpec } from '../../../../../spec/util'
import { System } from '../../../../../system'
import { GraphBundle } from '../../../../../types/GraphClass'
import { GraphSpec } from '../../../../../types/GraphSpec'
import { $Graph } from '../../../../../types/interface/async/$Graph'
import { $S } from '../../../../../types/interface/async/$S'
import { Async } from '../../../../../types/interface/async/Async'
import { UCGEE } from '../../../../../types/interface/UCGEE'
import { weakMerge } from '../../../../../weakMerge'
import { $wrap } from '../../../../../wrap'
import { ID_START_0 } from '../../../../_ids'

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

export default class Start extends Holder<I, O> {
  private _graph: $Graph

  constructor(system: System) {
    super(
      {
        fi: ['graph', 'system', 'opt'],
        fo: ['graph'],
        i: [],
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
      ID_START_0
    )
  }

  f({ graph: Graph, system, opt }: I, done: Done<O>): void {
    system = Async(system, ['S'], this.__system.async)

    const { paused } = opt || {}

    const { __bundle } = Graph

    const { unit } = __bundle

    const { id, input = {} } = unit

    const specs_ = weakMerge(__bundle.specs, this.__system.specs)

    const spec = getSpec(specs_, id) as GraphSpec

    const bundle = bundleSpec(spec, specs_, false)

    const $graph = system.$start({ bundle, __: UCGEE })

    for (const pinId in input) {
      const pin = input[pinId]

      if (pin.data !== undefined) {
        $graph.$setPinData({
          type: 'input',
          pinId,
          data: pin.data,
          lastData: undefined,
        })
      }
    }

    const graph = $wrap<$Graph>(this.__system, $graph, UCGEE)

    if (!paused) {
      graph.$play({})
    }

    this._graph = graph

    done({ graph })
  }

  d() {
    if (this._graph) {
      this._graph.$destroy({})

      this._graph = undefined
    }
  }
}
