import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { BootOpt, System } from '../../../../../system'
import { $S } from '../../../../../types/interface/async/$S'
import { Async } from '../../../../../types/interface/async/Async'
import { wrapSystem } from '../../../../../wrap/System'
import { ID_BOOT } from '../../../../_ids'

export interface I {
  init: BootOpt
  done: unknown
}

export interface O {
  system: $S
}

export default class Boot extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['init'],
        fo: ['system'],
        i: ['done'],
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
      specs: this.__system.specs,
      classes: this.__system.classes,
      components: this.__system.components,
    })

    const system = wrapSystem(_system, this.__system)

    const $system = Async(system, ['S'])

    done({
      system: $system,
    })
  }
}

export function createSubSystem(system: System, path: string) {}
