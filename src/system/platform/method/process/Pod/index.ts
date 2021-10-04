import { Graph } from '../../../../../Class/Graph'
import { Config } from '../../../../../Class/Unit/Config'
import { PO } from '../../../../../interface/PO'
import { Primitive } from '../../../../../Primitive'
import { GraphSpec } from '../../../../../types'

export interface I {
  spec: GraphSpec
}

export interface O {
  pod: PO
}

export default class Pod extends Primitive<I, O> {
  _ = ['G']

  constructor(config?: Config) {
    super(
      {
        i: ['spec'],
        o: ['graph'],
      },
      config,
      {
        output: {
          graph: {
            ref: true,
          },
        },
      }
    )
  }

  onDataInputData(name: string, data: any) {
    if (name === 'spec') {
      const spec = data
      const graph = new Graph(spec, { paused: false })
      this._output.graph.push(graph)
      graph.play()
    }
  }

  onDataInputDrop(name: string) {
    if (name === 'spec') {
      this._output.graph.pull()
    }
  }
}
