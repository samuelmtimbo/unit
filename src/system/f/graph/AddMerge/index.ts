import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { GraphMergeSpec } from '../../../../types/GraphMergeSpec'
import { G } from '../../../../types/interface/G'
import { ID_ADD_MERGE } from '../../../_ids'

export interface I<T> {
  id: string
  merge: GraphMergeSpec
  graph: G
}

export interface O<T> {}

export default class AddMerge<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['id', 'merge', 'graph'],
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
      ID_ADD_MERGE
    )
  }

  f({ id, merge, graph }: I<T>, done: Done<O<T>>): void {
    try {
      graph.addMerge(merge, id)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done()
  }
}
