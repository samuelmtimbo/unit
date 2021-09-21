import { workerPort } from '../../../../../api/worker/workerPort'
import { Config } from '../../../../../Class/Unit/Config'
import { graphFromPort } from '../../../../../graphFromPort'
import { Primitive } from '../../../../../Primitive'
import { RemoteClient } from '../../../../../RemoteClient'
import { GraphSpec, GraphSpecs } from '../../../../../types'

export interface I {
  spec: GraphSpec
}

export interface O {}

export type Bundle = {
  spec: GraphSpec
  specs: GraphSpecs
}

export function bundle(spec: GraphSpec, specs: GraphSpecs): Bundle {
  //
  return { spec, specs }
}

export default class WorkerPod extends Primitive<I, O> {
  _ = ['U']

  private _client: RemoteClient

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

    this.addListener('destroy', () => {
      if (this._client) {
        this._client.terminate()
        this._client = undefined
      }
    })
  }

  onDataInputInvalid(name: string): void {
    // if (name === 'spec') {
    this._client.invalidate()

    this._output.graph.invalidate()
    // }
  }

  onDataInputData(name: string, data: any): void {
    // console.log('WorkerPod', 'onDataInputData', name, data)
    // if (name === 'spec') {
    const spec = data as GraphSpec

    if (!this._client) {
      const port = workerPort()
      const client = new RemoteClient(port)
      this._client = client
    }

    const _bundle = bundle(spec, globalThis.__specs)

    this._client.init(_bundle)

    const port = this._client.port()

    const graph = graphFromPort(port)

    this._output.graph.push(graph)
    // }
  }

  onDataInputDrop(name: string) {
    if (name === 'spec') {
      this._output.graph.pull()
    }
  }
}
