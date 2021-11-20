import { workerPort } from '../../../../../api/worker/workerPort'
import { bundleSpec } from '../../../../../bundle'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'
import { graphFromPort } from '../../../../../graphFromPort'
import { $Graph } from '../../../../../interface/async/$Graph'
import { RemoteClient } from '../../../../../RemoteClient'
import { GraphSpec } from '../../../../../types'

export interface I {
  spec: GraphSpec
}

export interface O {
  graph: $Graph // RETURN
}

export default class WorkerPod extends Functional<I, O> {
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

  f({ spec }: I, done: Done<O>) {
    if (!this._client) {
      const port = workerPort()
      const client = new RemoteClient(port)
      this._client = client
    }

    const _bundle = bundleSpec(spec, globalThis.__specs)

    this._client.init(_bundle)

    const port = this._client.port()

    const graph = graphFromPort(port)

    done({
      graph,
    })
  }

  i() {
    // if (name === 'spec') {
    this._client.invalidate()
    // }
  }
}
