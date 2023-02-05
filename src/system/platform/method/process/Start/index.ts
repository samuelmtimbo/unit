import { $wrap } from '../../../../../$wrap'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { BundleSpec } from '../../../../../types/BundleSpec'
import { $Graph } from '../../../../../types/interface/async/$Graph'
import { $S } from '../../../../../types/interface/async/$S'
import { ID_START } from '../../../../_ids'

export interface I {
  bundle: BundleSpec
  system: $S
}

export interface O {
  graph: $Graph
}

export default class Start extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['bundle', 'system'],
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

  f({ bundle, system }: I, done: Done<O>): void {
    const $graph = system.$newGraph({ bundle, _: ['$G', '$C', '$U'] })

    const graph = $wrap<$Graph>(this.__system, $graph)

    done({ graph })
  }

  onIterDataInputData(name: string, data: any) {
    // if (name === 'done') {
    this._forward_empty('graph')
    // }
  }
}
