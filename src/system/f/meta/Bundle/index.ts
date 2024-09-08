import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { BundleSpec } from '../../../../types/BundleSpec'
import { $G } from '../../../../types/interface/async/$G'
import { Async } from '../../../../types/interface/async/Async'
import { clone } from '../../../../util/object'
import { ID_BUNDLE } from '../../../_ids'

export interface I<T> {
  graph: $G
  opt: {
    snapshot?: boolean
  }
}

export interface O<T> {
  bundle: BundleSpec
}

export default class Bundle<T> extends Functional<I<T>, O<T>> {
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
      ID_BUNDLE
    )
  }

  f({ graph, opt }: I<T>, done: Done<O<T>>): void {
    graph = Async(graph, ['G'], this.__system.async)

    const { snapshot = false } = opt

    graph.$getBundle({ deep: snapshot }, (bundle) => {
      bundle = clone(bundle)

      done({
        bundle,
      })
    })
  }
}
