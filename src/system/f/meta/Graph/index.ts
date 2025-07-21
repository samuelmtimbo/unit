import { $ } from '../../../../Class/$'
import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { Graph } from '../../../../Class/Graph'
import { System } from '../../../../system'
import { G } from '../../../../types/interface/G'
import { ID_GRAPH } from '../../../_ids'

export interface I<T> {
  unit: $
}

export interface O<T> {
  graph: G
}

export default class Graph0<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit'],
        o: ['graph'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
        output: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_GRAPH
    )
  }

  f({ unit }: I<T>, done: Done<O<T>>, fail: Fail): void {
    if (!unit.__.includes('G')) {
      fail('not a graph')

      return
    }

    done({
      graph: unit as Graph,
    })
  }
}
