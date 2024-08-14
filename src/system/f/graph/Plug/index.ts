import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { GraphSubPinSpec } from '../../../../types'
import { $G } from '../../../../types/interface/async/$G'
import { Async } from '../../../../types/interface/async/Async'
import { IO } from '../../../../types/IO'
import { ID_PLUG } from '../../../_ids'

export interface I<T> {
  graph: $G
  type: IO
  pinId: string
  subPinId: string
  subPin: GraphSubPinSpec
}

export interface O<T> {}

export default class Plug<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['graph', 'type', 'pinId', 'subPinId', 'subPin'],
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
      ID_PLUG
    )
  }

  f({ graph, pinId, type, subPinId, subPin }: I<T>, done: Done<O<T>>): void {
    graph = Async(graph, ['G'])

    try {
      graph.$plugPin({ type, pinId, subPinId, subPinSpec: subPin })
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done()
  }
}
