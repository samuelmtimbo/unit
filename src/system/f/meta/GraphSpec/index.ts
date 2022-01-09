import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { G } from '../../../../interface/G'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { GraphSpec } from '../../../../types'

export interface I<T> {
  graph: G
}

export interface O<T> {
  spec: GraphSpec
}

export default class _GraphSpec<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
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
      pod
    )
  }

  f({ graph }: I<T>, done: Done<O<T>>): void {
    const spec = graph.getSpec()

    done({
      spec,
    })
  }
}
