import {
  getAllSessionStorage,
  getStorageKeys,
  storageHasKey,
} from '../../../../../client/util/web/storage'
import { MethodNotImplementedError } from '../../../../../exception/MethodNotImplementedError'
import { ObjectUpdateType } from '../../../../../ObjectUpdateType'
import { Primitive } from '../../../../../Primitive'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { V } from '../../../../../types/interface/V'
import { Unlisten } from '../../../../../types/Unlisten'
import { ID_SESSION_STORAGE } from '../../../../_ids'

export type I = {}

export type O = {}

export default class SessionStorage extends Primitive<I, O> implements V, J {
  constructor(system: System) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system,
      ID_SESSION_STORAGE
    )
  }

  private _checkAPI = () => {
    if (!sessionStorage) {
      throw new Error('session Storage API not implemented')
    }
  }

  async read(): Promise<any> {
    this._checkAPI()

    const obj = getAllSessionStorage()
    return obj
  }

  async write(data: any): Promise<void> {
    this._checkAPI()

    throw new MethodNotImplementedError()
  }

  async get(name: string): Promise<any> {
    this._checkAPI()

    const value = sessionStorage.getItem(name)
    if (value === null) {
      throw new Error('item not found')
    } else {
      return value
    }
  }

  async set(name: string, data: any): Promise<void> {
    this._checkAPI()

    localStorage.setItem(name, data)
  }

  async delete(name: string): Promise<any> {
    this._checkAPI()

    sessionStorage.removeItem(name)
  }

  deepSet(path: string[], data: any): Promise<void> {
    throw new MethodNotImplementedError()
  }

  deepGet(path: string[]): Promise<any> {
    throw new MethodNotImplementedError()
  }

  deepDelete(path: string[]): Promise<void> {
    throw new MethodNotImplementedError()
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
    throw new MethodNotImplementedError()
  }

  async keys(): Promise<string[]> {
    const keys = getStorageKeys(sessionStorage)
    return keys
  }

  async hasKey(name: string): Promise<boolean> {
    const has = storageHasKey(sessionStorage, name)
    return has
  }
}
