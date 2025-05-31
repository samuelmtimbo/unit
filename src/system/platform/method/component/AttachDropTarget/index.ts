import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { Unlisten } from '../../../../../types/Unlisten'
import { ID_ATTACH_DROP_TARGET } from '../../../../_ids'

export interface I<T> {
  component: Component_<any>
  opt: {}
  done: any
}

export interface O<T> {
  items: string[]
}

export default class AttachDropTarget<T> extends Holder<I<T>, O<T>> {
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['component', 'opt'],
        i: [],
        o: ['items'],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_ATTACH_DROP_TARGET
    )
  }

  async f({ component, opt }: I<T>, done: Done<O<T>>) {
    this._unlisten = component.attachDropTarget()

    component.addListener('drop_', (items: string[]) => {
      this._output.items.push(items)
    })
  }

  d() {
    if (this._i.component) {
      this._unlisten()

      this._done()
    }
  }
}
