import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { Action } from '../../../../types/Action'
import { $G } from '../../../../types/interface/async/$G'
import { Async } from '../../../../types/interface/async/Async'
import { ID_BULK_EDIT } from '../../../_ids'

export interface I<T> {
  graph: $G
  actions: Action[]
}

export interface O<T> {}

export default class BulkEdit<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['graph', 'actions'],
        o: [],
      },
      {
        input: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_BULK_EDIT
    )
  }

  f({ graph, actions }: I<T>, done: Done<O<T>>, fail: Fail): void {
    graph = Async(graph, ['G'], this.__system.async)

    try {
      graph.$bulkEdit({ actions })
    } catch (err) {
      fail(err.message)

      return
    }

    done()
  }
}
