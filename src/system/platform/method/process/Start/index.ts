import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { GraphBundle } from '../../../../../types/GraphClass'
import { G } from '../../../../../types/interface/G'
import { S } from '../../../../../types/interface/S'
import { ID_START } from '../../../../_ids'

export interface I {
  bundle: GraphBundle
  system: S
}

export interface O {
  graph: G
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
    const [map, graph, unlisten] = system.newGraph(bundle)

    done({ graph })
  }

  onIterDataInputData(name: string, data: any) {
    // if (name === 'done') {
    this._forward_empty('graph')
    // }
  }
}
