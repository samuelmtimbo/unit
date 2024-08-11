import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
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

export default class AttachText<T> extends Holder<I<T>, O<T>> {
  private _component: Component_
  private _text: string
  private _type: string

  constructor(system: System) {
    super(
      {
        fi: ['component', 'text', 'type'],
        fo: [],
        i: [],
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

    this._component = component
    this._text = text
    this._type = type

    // AD HOC
    setTimeout(() => {
      component.emit('call', { method: 'attachText', data: [type, text] })
    }, 0)
  }

  d() {
    const {
      api: {
        window: { setTimeout },
      },
    } = this.__system

    if (this._component) {
      setTimeout(() => {
        if (this._component) {
          this._component.emit('call', {
            method: 'detachText',
            data: [this._type, this._text],
          })

          this._component = undefined
        }
      }, 0)
    }
  }
}
