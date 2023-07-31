import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_DISPATCH } from '../../../../_ids'

export interface I<T> {
  element: Component_
  event: string
  data: any
  opt: {
    bubbles?: boolean
  }
}

export interface O<T> {}

export default class Dispatch<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['element', 'event', 'data', 'opt'],
        o: [],
      },
      {
        input: {
          element: {
            ref: true,
          },
        },
      },
      system,
      ID_DISPATCH
    )
  }

  f({ element, event, data, opt }: I<T>, done: Done<O<T>>) {
    const _event = `_${event}`

    element.emit('call', {
      method: 'dispatchEvent',
      data: [event, data, opt.bubbles],
    })

    done()
  }
}
