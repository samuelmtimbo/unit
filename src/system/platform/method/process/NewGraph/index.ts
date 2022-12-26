import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Graph } from '../../../../../Class/Graph'
import { start } from '../../../../../start'
import { System } from '../../../../../system'
import { BundleSpec } from '../../../../../types/BundleSpec'
import { ID_NEW_GRAPH } from '../../../../_ids'

export interface I {
  bundle: BundleSpec
}

export interface O {
  graph: Graph
}

export default class NewGraph extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['bundle'],
        o: ['graph'],
      },
      {
        output: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_NEW_GRAPH
    )
  }

  f({ bundle }: I, done: Done<O>): void {
    // console.log('NewGraph', 'f', bundle)

    const { spec = {}, specs = {} } = bundle

    // RETURN
    for (const specId in specs) {
      this.__system.specs[specId] = specs[specId]
    }

    const graph = start(this.__system, spec)

    done({ graph })
  }
}
