import { Done } from '../../../Class/Functional/Done'
import { Holder } from '../../../Class/Holder'
import { extractValueInterface } from '../../../extractValueInterface'
import { SharedRef } from '../../../SharefRef'
import { System } from '../../../system'
import { Async } from '../../../types/interface/async/Async'
import { V } from '../../../types/interface/V'
import { clone } from '../../../util/clone'
import { weakMerge } from '../../../weakMerge'
import { $wrap } from '../../../wrap'
import { wrapSharedRefArrayInterface } from '../../../wrap/Array'
import { wrapSharedRef } from '../../../wrap/Object'
import { wrapSharedValue } from '../../../wrap/SharedValue'
import { ID_STATE } from '../../_ids'

export interface I<T> {
  init: T
  done: any
}

export interface O<T> {
  data: V<T>
}

export default class State<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['init'],
        fo: ['data'],
        i: [],
        o: [],
      },
      {
        output: {
          data: {
            ref: true,
          },
        },
      },
      system,
      ID_STATE
    )
  }

  f({ init }: I<T>, done: Done<O<T>>): void {
    const sharedRef: SharedRef<T> = { current: clone(init) }

    let api: any = weakMerge(wrapSharedValue(sharedRef, this.__system), {
      raw: function () {
        return sharedRef.current
      },
    })

    let _ = extractValueInterface(init)

    if (_) {
      switch (_) {
        case 'A':
          {
            api = weakMerge(
              api,
              wrapSharedRefArrayInterface(sharedRef as SharedRef<any[]>)
            )
          }
          break
        case 'J':
          {
            api = weakMerge(api, wrapSharedRef(sharedRef))
          }
          break
      }
    }

    const __ = _ ? ['V', _] : ['V']

    let data = Async(api, __, this.__system.async)

    data = $wrap<V<T>>(this.__system, api, __)

    done({
      data,
    })
  }
}
