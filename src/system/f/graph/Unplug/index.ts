import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { $G } from '../../../../types/interface/async/$G'
import { Async } from '../../../../types/interface/async/Async'
import { IO } from '../../../../types/IO'
import { ID_UNPLUG } from '../../../_ids'

export interface I<T> {
  graph: $G
  type: IO
  pinId: string
  subPinId: string
}

export interface O<T> {}

export default class Unplug<T> extends Functional<I<T>, O<T>> {
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
      ID_UNPLUG
    )
  }

  f({ graph, type, pinId, subPinId }: I<T>, done: Done<O<T>>): void {
    graph = Async(graph, ['G'])

    try {
      graph.$unplugPin({ type, pinId, subPinId, subPinSpec: {} })
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done()
  }
}
