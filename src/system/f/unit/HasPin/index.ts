import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { $U } from '../../../../types/interface/async/$U'
import { Async } from '../../../../types/interface/async/Async'
import { IO } from '../../../../types/IO'
import { ID_HAS_PIN } from '../../../_ids'

export interface I<T> {
  graph: $U
  type: IO
  pinId: string
}

export interface O<T> {
  has: boolean
}

export default class HasPin<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['graph', 'type', 'pinId'],
        o: ['has'],
      },
      {
        input: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_HAS_PIN
    )
  }

  f({ graph, pinId, type }: I<T>, done: Done<O<T>>, fail: Fail): void {
    graph = Async(graph, ['U'], this.__system.async)

    try {
      graph.$hasPin({ type, pinId }, (has: boolean) => {
        done({ has })
      })
    } catch (err) {
      fail(err.message)

      return
    }
  }
}
