import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Component } from '../../../../../client/component'
import { LayoutBase } from '../../../../../client/layout'
import { System } from '../../../../../system'
import { Callback } from '../../../../../types/Callback'
import { Unlisten } from '../../../../../types/Unlisten'
import { Component_ } from '../../../../../types/interface/Component'
import { OB } from '../../../../../types/interface/OB'
import { remove } from '../../../../../util/array'
import { ID_INTERSECTION_OBSERVER } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'

export type I = {
  root: Component_
  opt: IntersectionObserverInit
  done: any
}

export type O = {
  observer: OB
}

export default class IntersectionObserver_ extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['root', 'opt'],
        fo: ['observer'],
        i: ['done'],
        o: [],
      },
      {
        input: {
          root: {
            ref: true,
          },
        },
        output: {
          observer: {
            ref: true,
          },
        },
      },
      system,
      ID_INTERSECTION_OBSERVER
    )
  }

  async f({ root }: I, done: Done<O>) {
    const {
      api: {
        document: { IntersectionObserver },
      },
    } = this.__system

    const globalId = root.getGlobalId()

    const _component = await firstGlobalComponentPromise(
      this.__system,
      globalId
    )

    const callback: IntersectionObserverCallback = (
      entries: IntersectionObserverEntry[]
    ) => {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        const callback = callbacks[i]

        if (!callback) {
          return
        }

        const _entry = {
          isIntersecting: entry.isIntersecting,
          time: entry.time,
        }

        callback(_entry)
      }
    }

    let base: LayoutBase = _component.getRootBase()

    let r: Component = _component

    while (base.length === 0) {
      base = r.$slotParent.getRootBase()

      r = r.$slotParent
    }

    const rootFirstRootLeaf = base[0][1]

    const _observer = new IntersectionObserver(callback, {
      root: rootFirstRootLeaf.$element as Element,
      threshold: 0.1,
    })

    const callbacks: Callback[] = []

    const observer = new (class IntersectionObserver_ extends $ implements OB {
      __: string[] = ['OB']

      observe(element: Element, callback: Callback): Unlisten {
        callbacks.push(callback)

        _observer.observe(element)

        return () => {
          remove(callbacks, callback)

          _observer.unobserve(element)
        }
      }
    })(this.__system)

    done({ observer })
  }

  d() {
    // TODO
  }
}
