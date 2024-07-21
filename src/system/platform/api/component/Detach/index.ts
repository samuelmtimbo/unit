import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { globalUrl } from '../../../../../spec/globalUrl'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
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
  private _component: Component_

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
    this._component = component

    component.emit('call', { method: 'register', data: [] })
    host.emit('call', { method: 'register', data: [] })

    const hostUrl = globalUrl(host.__global_id)

    component.emit('call', { method: 'detach', data: [hostUrl, opt] })
  }

  d() {
    if (this._component) {
      this._component.emit('call', {
        method: 'attach',
        data: [this._i.opt],
      })

      this._component = undefined
    }
  }
}
