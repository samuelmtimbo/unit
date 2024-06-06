import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Graph } from '../../../../Class/Graph'
import { System } from '../../../../system'
import { IO } from '../../../../types/IO'
import { ID_ADD_PIN_TO_MERGE } from '../../../_ids'

export interface I<T> {
  graph: Graph
  mergeId: string
  unitId: string
  type: IO
  pinId: string
}

export interface O<T> {}

export default class AddPinToMerge<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['graph', 'mergeId', 'unitId', 'type', 'pinId'],
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
      ID_ADD_PIN_TO_MERGE
    )
  }

  f({ graph, mergeId, type, pinId, unitId }: I<T>, done: Done<O<T>>): void {
    try {
      graph.addPinToMerge(mergeId, unitId, type, pinId)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done()
  }
}
