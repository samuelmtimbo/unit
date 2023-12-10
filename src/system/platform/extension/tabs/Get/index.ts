import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { callExtensionMethod } from '../../../../../client/extension'
import { System } from '../../../../../system'
import { ID_GET_TAB } from '../../../../_ids'

export interface I {
  id: number
}

export interface O {
  tab: object
}

export default class GetTab extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['id'],
        o: ['tab'],
      },
      {},
      system,
      ID_GET_TAB
    )
  }

  f({ id }: I, done: Done<O>) {
    const {
      api: {},
    } = this.__system

    callExtensionMethod('tabs', 'get', id, (tab, err) => {
      if (err) {
        done(undefined, err)

        return
      }

      done({ tab })
    })
  }
}
