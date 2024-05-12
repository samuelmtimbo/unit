import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_ATTACH_TEXT } from '../../../../_ids'

export interface I<T> {
  component: Component_
  text: string
  type: string
  done: any
}

export interface O<T> {}

export const VALID_MIME_TYPES = ['text/plain', 'text/html', 'text/uri-list']

export default class AttachText<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['component', 'text', 'type'],
        i: ['done'],
        o: [],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_ATTACH_TEXT
    )
  }

  async f({ component, text, type }: I<T>, done: Done<O<T>>) {
    if (!VALID_MIME_TYPES.includes(type)) {
      done(undefined, 'invalid mime type')

      return
    }

    // AD HOC
    setTimeout(() => {
      component.emit('call', { method: 'attachText', data: [type, text] })
    }, 0)
  }

  public onIterDataInputData(name: string, data: any): void {
    const {
      api: {
        window: { setTimeout },
      },
    } = this.__system

    // if (name === 'done')  {
    if (this._input.component.active() && this._input.text.active()) {
      setTimeout(() => {
        this._i.component.emit('call', {
          method: 'dettachText',
          data: [this._i.type, this._i.text],
        })

        this._done()
      }, 0)
    }

    this._input.done.pull()
    // }
  }
}
