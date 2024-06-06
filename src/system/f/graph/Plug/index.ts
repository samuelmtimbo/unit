import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Graph } from '../../../../Class/Graph'
import { System } from '../../../../system'
import { GraphSubPinSpec } from '../../../../types'
import { IO } from '../../../../types/IO'
import { ID_PLUG } from '../../../_ids'

export interface I<T> {
  graph: Graph
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
    try {
      graph.plugPin(type, pinId, subPinId, subPin)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done()
  }
}
