import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { uuid } from '../../../../util/id'

export type I = {
  sol: string
}

export type O = {
  binary: string
}

export default class CompileSolidity extends Functional<I, O> {
  private _worker: Worker

  constructor(config?: Config) {
    super(
      {
        i: ['sol'],
        o: ['binary'],
      },
      config
    )

    const { href } = location
    const url = `${href}/_worker-solc.js`
    const worker = new Worker(url)
    this._worker = worker
  }

  async f({ sol }: I, done: Done<O>) {
    const callId = uuid()
    this._worker.postMessage({ callId, content: sol })
    this._worker.onmessage = (event) => {
      const { data } = event
      const { callId: _callId, result, err } = data
      if (_callId === callId) {
        if (err) {
          done(undefined, err)
        } else {
          done({ binary: result })
        }
      }
    }
  }
}
