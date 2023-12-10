import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { callExtensionMethod } from '../../../../../client/extension'
import { System } from '../../../../../system'
import { ID_QUERY_TABS } from '../../../../_ids'

export interface I {
  opt: {
    active?: boolean
    audible?: boolean
    autoDiscardable?: boolean
    currentWindow?: boolean
    discarded?: boolean
    groupId?: number
    highlighted?: boolean
    index?: number
    lastFocusedWindow?: boolean
    muted?: boolean
    pinned?: boolean
    status?: 'unloaded' | 'loading' | 'complete'
    title?: string
    url?: string | string[]
    windowId?: number
    windowType?: 'normal' | 'popup' | 'panel' | 'app' | 'devtools'
  }
}

export interface O {
  tabs: any[]
}

export default class QueryTabs extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['opt'],
        o: ['tabs'],
      },
      {},
      system,
      ID_QUERY_TABS
    )
  }

  f({ opt }: I, done: Done<O>) {
    const {
      api: {},
    } = this.__system

    callExtensionMethod('tabs', 'query', opt, (tabs, err) => {
      if (err) {
        done(undefined, err)

        return
      }

      done({ tabs })
    })
  }
}
