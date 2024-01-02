import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
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

export default class Detach extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['component', 'host', 'opt'],
        i: ['done'],
        fo: [],
        o: [],
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
    component.emit('call', { method: 'register', data: [] })
    host.emit('call', { method: 'register', data: [] })

    const hostUrl = globalUrl(host.__global_id)

    component.emit('call', { method: 'detach', data: [hostUrl, opt] })
  }

  private _attach = () => {
    this._i.component.emit('call', {
      method: 'attach',
      data: [this._i.opt],
    })
  }

  d() {
    this._attach()
  }

  public onIterDataInputData(name: string, data: any): void {
    switch (name) {
      case 'done':
        if (this._functional._active_i_count === 3) {
          this._attach()

          this._done()
        }

        this._backward('done')

        break
    }
  }
}
