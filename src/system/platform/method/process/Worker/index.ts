import { AsyncWorkerS } from '../../../../../AsyncWorker'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { workerPort } from '../../../../../client/platform/web/workerPort'
import { RemoteClient } from '../../../../../RemoteClient'
import { System } from '../../../../../system'
import { $S } from '../../../../../types/interface/async/$S'
import { $wrap } from '../../../../../wrap'
import { ID_WORKER } from '../../../../_ids'

export interface I {
  init: {}
}

export interface O {
  system: $S
}

export default class Worker extends Functional<I, O> {
  private _client: RemoteClient

  constructor(system: System) {
    super(
      {
        i: ['init'],
        o: ['system'],
      },
      {
        output: {
          system: {
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

  f({ init }: I, done: Done<O>) {
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

    this._client.init({})

    const port = this._client.port()

    const $system = AsyncWorkerS(port)

    const system = $wrap<$S>(this.__system, $system)

    done({
      system,
    })
  }

  i() {
    // if (name === 'spec') {
    this._client.invalidate()
    // }
  }
}
