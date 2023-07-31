import {
  getAllLocalStorage,
  getStorageKeys,
  storageHasKey,
} from '../../../../client/util/web/storage'
import { MethodNotImplementedError } from '../../../../exception/MethodNotImplementedError'
import { ObjectUpdateType } from '../../../../Object'
import { Dict } from '../../../../types/Dict'
import { IStorage } from '../../../../types/global/IStorage'
import { J } from '../../../../types/interface/J'
import { Unlisten } from '../../../../types/Unlisten'

export class Storage_ implements J {
  private _storage: IStorage

  constructor(storage: IStorage) {
    this._storage = storage
  }

  async read(): Promise<Dict<string>> {
    const obj = getAllLocalStorage()
    return obj
  }

  async write(data: Dict<string>): Promise<void> {
    // TODO
    return
  }

  async get(name: string): Promise<string> {
    const value = this._storage.getItem(name)

    if (value === null) {
      throw new Error('item not found')
    } else {
      return value
    }
  }

  async set(name: string, data: string): Promise<void> {
    this._storage.setItem(name, data)
  }

  async delete(name: string): Promise<any> {
    this._storage.removeItem(name)
  }

  pathSet(path: string[], name: string, data: any): Promise<void> {
    throw new MethodNotImplementedError()
  }

  pathGet(path: string[], name: string): Promise<any> {
    throw new MethodNotImplementedError()
  }

  pathDelete(path: string[], name: string): Promise<void> {
    throw new MethodNotImplementedError()
  }

  async keys(): Promise<string[]> {
    const keys = getStorageKeys(this._storage)
    return keys
  }

  async hasKey(name: string): Promise<boolean> {
    const has = storageHasKey(this._storage, name)
    return has
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
}
