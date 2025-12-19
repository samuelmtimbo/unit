import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { GraphPinSpec } from '../../../../types/GraphPinSpec'
import { $G } from '../../../../types/interface/async/$G'
import { Async } from '../../../../types/interface/async/Async'
import { IO } from '../../../../types/IO'
import { ID_ADD_PIN } from '../../../_ids'

export interface I<T> {
  graph: $G
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
}

export interface O<T> {}

export default class AddPin<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['graph', 'type', 'pinId', 'pinSpec'],
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
      ID_ADD_PIN
    )
  }

  f({ graph, pinId, type, pinSpec }: I<T>, done: Done<O<T>>, fail: Fail): void {
    graph = Async(graph, ['G'], this.__system.async)

    try {
      graph.$exposePinSet({ type, pinId, pinSpec })
    } catch (err) {
      fail(err.message)

      return
    }

    done()
  }
}
