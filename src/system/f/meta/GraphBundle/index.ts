import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { BundleSpec } from '../../../../types/BundleSpec'
import { G } from '../../../../types/interface/G'
import { ID_GRAPH_BUNDLE } from '../../../_ids'

export interface I<T> {
  graph: G
  opt: {
    snapshot?: boolean
  }
}

export interface O<T> {
  bundle: BundleSpec
}

export default class _GraphBundle<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['graph', 'opt'],
        o: ['bundle'],
      },
      {
        input: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_GRAPH_BUNDLE
    )
  }

  f({ graph, opt }: I<T>, done: Done<O<T>>): void {
    const { snapshot } = opt

    const bundle = graph.getBundleSpec()

    done({
      bundle,
    })
  }
}
