import {
  getAllSessionStorage,
  getStorageKeys,
  storageHasKey,
} from '../../../../../client/util/web/storage'
import { J } from '../../../../../interface/J'
import { V } from '../../../../../interface/V'
import { ObjectUpdateType } from '../../../../../Object'
import { Pod } from '../../../../../pod'
import { Primitive } from '../../../../../Primitive'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'

export type I = {}

export type O = {}

export default class SessionStorage extends Primitive<I, O> implements V, J {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system,
      pod
    )
  }

  private _checkAPI = () => {
    if (!sessionStorage) {
      throw new Error('Session Storage API not implemented')
    }
  }

  async read(): Promise<any> {
    this._checkAPI()

    const obj = getAllSessionStorage()
    return obj
  }

  async write(data: any): Promise<void> {
    this._checkAPI()

    throw new Error('Method not implemented.')
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

  pathSet(path: string[], name: string, data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }

  pathGet(path: string[], name: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  pathDelete(path: string[], name: string): Promise<void> {
    throw new Error('Method not implemented.')
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
    throw new Error('Method not implemented.')
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
