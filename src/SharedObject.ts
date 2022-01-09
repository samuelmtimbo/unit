import { EventEmitter, EventEmitter_EE } from './EventEmitter'
import { Dict } from './types/Dict'
import { Unlisten } from './types/Unlisten'

export type SharedObjectClientEvents<_EE extends Dict<any[]>> =
  EventEmitter_EE<_EE> & _EE

export interface SharedObjectClient<T, _EE extends Dict<any[]>> {
  proxy: T
  emitter: EventEmitter<SharedObjectClientEvents<_EE>>
  disconnect: Unlisten
}

export class SharedObject<T extends Dict<any>, _EE extends Dict<any[]>> {
  private _obj: T
  private _clients: SharedObjectClient<T, _EE>[] = []

  constructor(obj: T) {
    this._obj = obj
  }

  connect(): SharedObjectClient<T, _EE> {
    const proxy = new Proxy(this._obj, {
      get: <K extends keyof _EE>(target, name: K) => {
        const value = target[name]
        if (typeof value == 'function') {
          return (...args: SharedObjectClientEvents<_EE>[K]) => {
            const r = value.call(target, ...args)
            for (const c of this._clients) {
              if (c !== client) {
                c.emitter.emit(name, ...args)
              }
            }
            return r
          }
        }
        return value
      },
    })
    const emitter = new EventEmitter<SharedObjectClientEvents<_EE>>()
    const disconnect = () => {
      const i = this._clients.indexOf(client)
      this._clients.splice(i, 1)
    }
    const client: SharedObjectClient<T, _EE> = { proxy, emitter, disconnect }
    this._clients.push(client)
    return client
  }
}
