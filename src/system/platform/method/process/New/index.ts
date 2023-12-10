import { Done } from '../../../../../Class/Functional/Done'
import { Graph } from '../../../../../Class/Graph'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { start } from '../../../../../start'
import { System } from '../../../../../system'
import { GraphBundle } from '../../../../../types/GraphClass'
import { GraphSpec } from '../../../../../types/GraphSpec'
import { ID_NEW_0 } from '../../../../_ids'

export interface I {
  graph: GraphBundle
  done: any
}

export interface O {
  graph: Graph
}

export default class New extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['graph'],
        fo: ['graph'],
        i: ['done'],
      },
      {
        output: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_NEW_0
    )
  }

  f({ graph: graphClass }: I, done: Done<O>): void {
    // console.log('New', 'f', bundle)

    const { unit, specs = {} } = graphClass.__bundle

    this.__system.injectSpecs(specs)

    const spec = this.__system.getSpec(unit.id) as GraphSpec

    const graph = start(this.__system, { spec, specs })

    done({ graph })
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._forward_all_empty()
    this._backward('graph')
    this._backward('done')
    // }
  }
}
