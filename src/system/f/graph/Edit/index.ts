import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { Action } from '../../../../types/Action'
import { $G } from '../../../../types/interface/async/$G'
import { Async } from '../../../../types/interface/async/Async'
import { ID_EDIT } from '../../../_ids'

export interface I<T> {
  graph: $G
  action: Action
}

export interface O<T> {}

export default class Edit<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['graph', 'action'],
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
      ID_EDIT
    )
  }

  f({ graph, action }: I<T>, done: Done<O<T>>, fail: Fail): void {
    graph = Async(graph, ['G'], this.__system.async)

    try {
      graph.$bulkEdit({ actions: [action] })
    } catch (err) {
      fail(err.message)

      return
    }

    done()
  }
}
