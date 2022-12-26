import { bundleSpec } from '../../../../../bundle'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { workerPort } from '../../../../../client/platform/web/workerPort'
import { asyncGraphFromPort } from '../../../../../graphFromPort'
import { RemoteClient } from '../../../../../RemoteClient'
import { System } from '../../../../../system'
import { GraphSpec } from '../../../../../types'
import { $Graph } from '../../../../../types/interface/async/$Graph'
import { ID_WORKER } from '../../../../_ids'

export interface I {
  spec: GraphSpec
}

export interface O {
  graph: $Graph // RETURN
}

export default class Worker extends Functional<I, O> {
  private _client: RemoteClient

  constructor(system: System) {
    super(
      {
        i: ['spec'],
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
      ID_WORKER
    )

    this.addListener('destroy', () => {
      if (this._client) {
        this._client.terminate()
        this._client = undefined
      }
    })
  }

  f({ spec }: I, done: Done<O>) {
    const {
      specs,
      api: {
        worker: { start },
      },
    } = this.__system

    if (!this._client) {
      let worker
      try {
        worker = start()
      } catch (err) {
        done(undefined, err.message)
        return
      }
      const port = workerPort(worker)
      const client = new RemoteClient(port)
      this._client = client
    }

    const _bundle = bundleSpec(spec, specs)

    this._client.init(_bundle)

    const port = this._client.port()

    const graph = asyncGraphFromPort(this.__system, port)

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
