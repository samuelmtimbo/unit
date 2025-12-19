import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { $G } from '../../../../types/interface/async/$G'
import { $U } from '../../../../types/interface/async/$U'
import { Async } from '../../../../types/interface/async/Async'
import { IO } from '../../../../types/IO'
import { ID_REMOVE_PLUG } from '../../../_ids'

export interface I<T> {
  graph: $G & $U
  type: IO
  pinId: string
  subPinId: string
}

export interface O<T> {}

export default class RemovePlug<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['graph', 'type', 'pinId', 'subPinId'],
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
      ID_REMOVE_PLUG
    )
  }

  f(
    { graph, type, pinId, subPinId }: I<T>,
    done: Done<O<T>>,
    fail: Fail
  ): void {
    graph = Async(graph, ['G'], this.__system.async)

    try {
      graph.$coverPin({ type, pinId, subPinId })

      done()
    } catch (err) {
      fail(err.message)

      return
    }
  }
}
