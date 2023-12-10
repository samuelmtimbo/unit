import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { OB } from '../../../../../types/interface/OB'
import { ID_OBSERVE } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'

export type I<T> = {
  observer: OB
  component: Component_
}

export type O<T> = {
  entry: T[]
}

export default class Observe<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['component', 'observer'],
        fo: [],
        i: ['done'],
        o: ['entry'],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_OBSERVE
    )
  }

  async f({ observer, component }: I<T>, done: Done<O<T>>): Promise<void> {
    const {
      api: {
        document: {},
      },
    } = this.__system

    // component.emit('call', { method: 'target', data: [] })

    const globalId = component.getGlobalId()

    const _component = await firstGlobalComponentPromise(
      this.__system,
      globalId
    )

    const leaf = _component.getFirstRootLeaf()

    if (leaf.$element instanceof Text) {
      done(undefined, 'cannot observe text node')

      return
    }

    observer.observe(leaf.$element, (entry) => {
      this._output.entry.push(entry)
    })
  }

  d() {
    // TODO
  }
}
