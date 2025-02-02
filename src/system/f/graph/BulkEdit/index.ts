import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { Action } from '../../../../types/Action'
import { $G } from '../../../../types/interface/async/$G'
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

  f({ graph, actions }: I<T>, done: Done<O<T>>): void {
    try {
      graph.$bulkEdit({ actions })
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done()
  }
}
