import { EventEmitter2 } from 'eventemitter2'

export interface SharedObjectClient<T> {
  proxy: T
  emitter: EventEmitter2
  disconnect: () => void
}

export class SharedObject<T extends object> {
  private _obj: T
  private _clients: SharedObjectClient<T>[] = []

  constructor(obj: T) {
    this._obj = obj
  }

  connect(): SharedObjectClient<T> {
    const proxy = new Proxy(this._obj, {
      get: (target, name: string) => {
        const value = target[name]
        if (typeof value == 'function') {
          return (...args) => {
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
    const emitter = new EventEmitter2()
    const disconnect = () => {
      const i = this._clients.indexOf(client)
      this._clients.splice(i, 1)
    }
    const client = { proxy, emitter, disconnect }
    this._clients.push(client)
    return client
  }
}
