import { AsyncWorker } from '../../../../AsyncWorker'
import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { workerPort } from '../../../../client/platform/web/port/worker'
import { RemoteClient } from '../../../../RemoteClient'
import { System } from '../../../../system'
import { $S } from '../../../../types/interface/async/$S'
import { $wrap } from '../../../../wrap'
import { ID_WORKER } from '../../../_ids'

export interface I {
  init: {}
}

export interface O {
  system: $S
}

export default class Worker_ extends Functional<I, O> {
  private _worker: Worker

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
  }

  f({ init }: I, done: Done<O>) {
    const {
      specs,
      api: {
        worker: { start },
      },
    } = this.__system

    let worker: Worker

    try {
      worker = start()
    } catch (err) {
      done(undefined, err.message)

      return
    }

    const port = workerPort(worker)

    const client = new RemoteClient(port)

    const remote = client.port()

    const $system = AsyncWorker(remote, ['S'])

    const system = $wrap<$S>(this.__system, $system)

    client.init({})

    done({
      system,
    })
  }

  d() {
    if (this._worker) {
      this._worker.terminate()

      this._worker = undefined
    }
  }
}
