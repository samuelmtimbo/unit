import { ObjectUpdateType } from '../../../../ObjectUpdateType'
import { Primitive } from '../../../../Primitive'
import {
  delete_,
  get,
  hasKey,
  keys,
  read,
  set,
  write,
} from '../../../../client/util/storage'
import { MethodNotImplementedError } from '../../../../exception/MethodNotImplementedError'
import { ObjectPathTooDeepError } from '../../../../exception/ObjectPathTooDeep'
import { System } from '../../../../system'
import { Callback } from '../../../../types/Callback'
import { Unlisten } from '../../../../types/Unlisten'
import { J } from '../../../../types/interface/J'
import { V } from '../../../../types/interface/V'

export type I = {}

export type O = {}

export default class Storage_ extends Primitive<I, O> implements V, J {
  private _prefix: string

  constructor(system: System, id: string, prefix: string) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system,
      id
    )

    this._prefix = prefix
  }

  protected _storage = (): Storage => {
    throw new MethodNotImplementedError()
  }

  read(callback: Callback<any>): void {
    const { path } = this.__system

    const storage = this._storage()

    const data = read(storage, path)

    callback(data)
  }

  write(data: any, callback: Callback): void {
    const { path } = this.__system

    const storage = this._storage()

    write(storage, path, data)

    callback()
  }

  get(name: string): any {
    const { path } = this.__system

    const storage = this._storage()

    return get(storage, path, name)
  }

  set(name: string, data: any): void {
    const { path, emitter } = this.__system

    const storage = this._storage()

    set(storage, path, name, data)

    emitter.emit(`${this._prefix}_storage`, name, data)
  }

  delete(name: string): any {
    const { path, emitter } = this.__system

    const storage = this._storage()

    delete_(storage, path, name)

    emitter.emit(`${this._prefix}_storage`, name, undefined)
  }

  deepSet(path_: string[], data: any): void {
    const { path } = this.__system

    const storage = this._storage()

    if (path_.length > 0) {
      throw new ObjectPathTooDeepError()
    }

    return set(storage, path_[0], data, path)
  }

  deepGet(path_: string[]): any {
    const { path } = this.__system

    const storage = this._storage()

    if (path_.length > 0) {
      throw new ObjectPathTooDeepError()
    }

    return get(storage, path, path_[0])
  }

  deepDelete(path_: string[]): void {
    const { path } = this.__system

    const storage = this._storage()

    if (path_.length > 1) {
      throw new ObjectPathTooDeepError()
    }

    return delete_(storage, path, path_[0])
  }

  deepHas(path: string[]): boolean {
    try {
      this.deepGet(path)

      return true
    } catch (err) {
      return false
    }
  }

  subscribe(
    path: string[],
    key: string,
    listener: (
      type: ObjectUpdateType,
      path: string[],
      key: string,
      data: any
    ) => void
  ): Unlisten {
    const { emitter } = this.__system

    if (path.length > 0) {
      throw new ObjectPathTooDeepError()
    }

    return emitter.addListener(`${this._prefix}_storage`, (key_, value) => {
      if (key_ === key || key === '*') {
        if (value === undefined) {
          listener('delete', [], key, value)
        } else {
          listener('set', [], key, value)
        }
      }
    })
  }

  keys(): string[] {
    const { path } = this.__system

    const storage = this._storage()

    return keys(storage, path)
  }

  hasKey(name: string): boolean {
    const { path } = this.__system

    const storage = this._storage()

    const has = hasKey(storage, path, name)

    return has
  }
}
