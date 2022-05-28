import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Graph } from '../../../../../Class/Graph'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { GraphSpecs } from '../../../../../types'
import { BundleSpec } from '../../../../../types/BundleSpec'
import { Dict } from '../../../../../types/Dict'
import { G } from '../../../../../types/interface/G'
import { P } from '../../../../../types/interface/P'
import { S } from '../../../../../types/interface/S'
import { Unlisten } from '../../../../../types/Unlisten'

export interface I {
  init: {}
  system: S
}

export interface O {
  pod: P
}

export default class Spawn extends Semifunctional<I, O> {
  private _unlisten: Unlisten

  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['init', 'system'],
        fo: ['pod'],
        i: ['done'],
        o: [],
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

    this.addListener('destroy', () => {
      this.d()
    })
  }

  f({ init, system }: I, done: Done<O>): void {
    const [__pod, unlisten] = system.newPod(init)

    this._unlisten = unlisten

    const pod = new (class $Pod extends $ implements P {
      getSpecs(): GraphSpecs {
        return __pod.getSpecs()
      }

      refUnit(id: string): void {
        return __pod.refUnit(id)
      }

      newGraph(bundle: BundleSpec): [Dict<string>, Graph, Unlisten] {
        throw __pod.newGraph(bundle)
      }
    })(this.__system, this.__pod)

    done({ pod })
  }

  d() {
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }
  }
}
