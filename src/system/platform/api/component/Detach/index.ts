import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { Unlisten } from '../../../../../types/Unlisten'
import { ID_DETACH } from '../../../../_ids'

export type DetachOpt = {
  animate?: boolean
}

export interface I {
  component: Component_
  host: Component_
  opt: DetachOpt
  done: any
}

export interface O {}

export default class Detach extends Holder<I, O> {
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['component', 'host', 'opt'],
        fo: [],
      },
      {
        input: {
          component: {
            ref: true,
          },
          host: {
            ref: true,
          },
        },
      },
      system,
      ID_DETACH
    )
  }

  f({ component, host, opt }: I, done: Done<O>): void {
    this._unlisten = component.detach(host, opt)
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }
}
