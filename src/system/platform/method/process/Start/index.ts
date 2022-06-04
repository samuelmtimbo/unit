import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { BundleSpec } from '../../../../../types/BundleSpec'
import { G } from '../../../../../types/interface/G'
import { P } from '../../../../../types/interface/P'

export interface IPod extends P {}

export interface IPodOpt {}

export interface I {
  bundle: BundleSpec
  pod: P
}

export interface O {
  graph: G
}

export default class Start extends Semifunctional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['bundle', 'pod'],
        fo: ['graph'],
        i: ['done'],
        o: [],
      },
      {
        input: {
          pod: {
            ref: true
          }
        },
        output: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  f({ bundle, pod }: I, done: Done<O>): void {    
    const [map, graph, unlisten] = pod.newGraph(bundle)

    done({ graph })
  }

  onIterDataInputData(name: string, data: any) {
    // if (name === 'done') {
    this._forward_empty('graph')
    // }
  }
}
