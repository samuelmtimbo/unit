import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { BootOpt, System } from '../../../../../system'
import { $S } from '../../../../../types/interface/async/$S'
import { Async } from '../../../../../types/interface/async/Async'
import { weakMerge } from '../../../../../weakMerge'
import { wrapSystem } from '../../../../../wrap/System'
import { ID_BOOT } from '../../../../_ids'

export interface I {
  init: BootOpt
  done: any
}

export interface O {
  system: $S
}

export default class Boot extends Holder<I, O> {
  private _system: System

  constructor(system: System) {
    super(
      {
        fi: ['init'],
        fo: ['system'],
        i: [],
        o: [],
      },
      {
        output: {
          system: {
            ref: true,
          },
        },
      },
      system,
      ID_BOOT
    )
  }

  f({ init }: I, done: Done<O>): void {
    const _system = this.__system.boot({
      ...init,
      specs: weakMerge(this.__system.specs, init.specs ?? {}),
      classes: this.__system.classes,
      components: this.__system.components,
    })

    this._system = _system

    const system_ = wrapSystem(_system, this.__system)

    const system = Async(system_, ['S'], this.__system.async) as $S

    done({
      system,
    })
  }

  d() {
    if (this._system) {
      this._system = undefined
    }
  }
}
