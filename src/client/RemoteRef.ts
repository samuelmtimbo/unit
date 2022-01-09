import { CALL, REF, REF_EXEC, UNWATCH, WATCH } from '../constant/STRING'
import { Dict } from '../types/Dict'
import { Unlisten } from '../types/Unlisten'
import { RemoteAPI, RemoteAPIData } from './RemoteAPI'

export class RemoteRef {
  private _API: RemoteAPI

  private _unlisten: Dict<Unlisten> = {}
  private _ref: Dict<RemoteRef> = {}

  private _post: (data: any) => void

  constructor(API: RemoteAPI, post: (data: any) => void) {
    this._API = API

    this._post = post
  }

  exec(data: RemoteAPIData): void {
    const { type, data: _data } = data

    switch (type) {
      case CALL:
        {
          const { id, method, data: __data } = _data
          this._API[CALL][method](__data, (data, err) => {
            this._post({ type: CALL, data: { id, data, err } })
          })
        }
        break
      case WATCH:
        {
          const { id, method, data: __data } = _data
          const unlisten = this._API[WATCH][method](__data, (data, err) => {
            this._post({ type: WATCH, data: { id, data, err } })
          })
          this._unlisten[id] = unlisten
        }
        break
      case UNWATCH:
        {
          const { id } = _data
          const unlisten = this._unlisten[id]
          delete this._unlisten[id]
          unlisten()
        }
        break
      case REF:
        {
          const { id, method, data: __data } = _data
          const ref = this._API[REF][method](__data)
          const remote_ref = new RemoteRef(ref, (data) => {
            this._post({ type: REF, data: { id, data } })
          })
          this._ref[id] = remote_ref
        }
        break
      case REF_EXEC:
        {
          const { id, data: __data } = _data
          const ref = this._ref[id]
          ref.exec(__data)
        }
        break
      default:
        throw new Error('Invalid Remote API Data Type')
    }
  }
}
