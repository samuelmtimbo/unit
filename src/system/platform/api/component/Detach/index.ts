import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { globalUrl } from '../../../../../spec/globalUrl'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_DETACH } from '../../../../_ids'

export interface I {
  component: Component_
  host: Component_
  opt: {
    animate?: boolean
  }
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
    const hostUrl = globalUrl(host.__global_id)

    component.emit('call', { method: 'detach', data: [hostUrl, opt] })
  }

  public onIterDataInputData(name: string, data: any): void {
    switch (name) {
      case 'done':
        this._i.component.emit('call', {
          method: 'attach',
          data: [{ opt: this._i.opt }],
        })

        this._done()

        this._backward('done')

        break
    }
  }
}
