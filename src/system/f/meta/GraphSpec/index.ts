import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { GraphSpec } from '../../../../types'
import { G } from '../../../../types/interface/G'
import { ID_GRAPH_SPEC } from '../../../_ids'

export interface I<T> {
  graph: G
}

export interface O<T> {
  spec: GraphSpec
}

export default class _GraphSpec<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['graph', 'any'],
        o: ['spec'],
      },
      {
        input: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_GRAPH_SPEC
    )
  }

  f({ graph }: I<T>, done: Done<O<T>>): void {
    const spec = graph.getSpec()

    done({
      spec,
    })
  }
}
