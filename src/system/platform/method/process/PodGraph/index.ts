import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Graph } from '../../../../../Class/Graph'
import { PO } from '../../../../../interface/PO'
import { Pod } from '../../../../../pod'
import { spawn } from '../../../../../spawn'
import { System } from '../../../../../system'
import { GraphSpecs } from '../../../../../types'
import { Dict } from '../../../../../types/Dict'
import { BundleSpec } from '../BundleSpec'

export interface IPod extends PO {}

export interface IPodOpt {}

export interface I {
  opt: {
    specs?: GraphSpecs
    sandbox?: string[]
  }
}

export interface O {
  pod: PO
}

export default class _Pod extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['opt'],
        o: ['pod'],
      },
      {
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

  f({ opt }: I, done: Done<O>): void {
    const { specs, sandbox } = opt

    const __pod = spawn(this.__system)

    const pod = new (class $Pod extends $ implements PO {
      getSpecs(): GraphSpecs {
        throw new Error('Method not implemented.')
      }

      refUnit(id: string): void {
        throw new Error('Method not implemented.')
      }

      refGraph(bundle: BundleSpec): [Dict<string>, Graph] {
        throw new Error('Method not implemented.')
      }
    })(this.__system, this.__pod)

    done({ pod })
  }
}
