import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { BootOpt, System } from '../../../../../system'
import { $S } from '../../../../../types/interface/async/$S'
import { Async } from '../../../../../types/interface/async/Async'
import { clone } from '../../../../../util/object'
import { wrapSystem } from '../../../../../wrap/System'
import { ID_BOOT } from '../../../../_ids'

export interface I {
  init: BootOpt
  done: unknown
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
    const { path } = init

    const _system = this.__system.boot({
      path,
      specs: clone(this.__system.specs),
      classes: this.__system.classes,
      components: this.__system.components,
    })

    this._system = _system

    const system = wrapSystem(_system, this.__system)

    const $system = Async(system, ['S'])

    done({
      system: $system,
    })
  }

  d() {
    if (this._system) {
      this._system.destroy()

      this._system = undefined
    }
  }
}
