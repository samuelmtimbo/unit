import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { OB } from '../../../../../types/interface/OB'
import { Unlisten } from '../../../../../types/Unlisten'
import { ID_OBSERVE } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'

export type I<T> = {
  observer: OB
  component: Component_
}

export type O<T> = {
  entry: T[]
}

export default class Observe<T> extends Holder<I<T>, O<T>> {
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['component', 'observer'],
        fo: [],
        i: [],
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

    this._unlisten = observer.observe(leaf.$element, (entry) => {
      this._output.entry.push(entry)
    })
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }
}
