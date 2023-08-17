import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Graph } from '../../../../../Class/Graph'
import { start } from '../../../../../start'
import { System } from '../../../../../system'
import { GraphBundle } from '../../../../../types/GraphClass'
import { GraphSpec } from '../../../../../types/GraphSpec'
import { ID_NEW_GRAPH } from '../../../../_ids'

export interface I {
  graph: GraphBundle
}

export interface O {
  graph: Graph
}

export default class NewGraph extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['graph'],
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

  f({ graph: graphClass }: I, done: Done<O>): void {
    // console.log('NewGraph', 'f', bundle)

    const { unit, specs = {} } = graphClass.__bundle

    this.__system.injectSpecs(specs)

    const spec = this.__system.getSpec(unit.id) as GraphSpec

    const graph = start(this.__system, spec)

    done({ graph })
  }
}
