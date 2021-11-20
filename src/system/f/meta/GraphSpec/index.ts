import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { G } from '../../../../interface/G'
import { GraphSpec } from '../../../../types'

export interface I<T> {
  graph: G
}

export interface O<T> {
  spec: GraphSpec
}

export default class _GraphSpec<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['graph', 'any'],
        o: ['spec'],
      },
      config,
      {
        input: {
          graph: {
            ref: true,
          },
        },
      }
    )
  }

  f({ graph }: I<T>, done: Done<O<T>>): void {
    const spec = graph.getSpec()

    done({
      spec,
    })
  }
}
