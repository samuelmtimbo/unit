import {
  getAllLocalStorage,
  getStorageKeys,
  storageHasKey,
} from '../../../../client/util/web/storage'
import { J } from '../../../../interface/J'
import { Dict } from '../../../../types/Dict'

export class Storage_ implements J {
  private _storage: Storage

  constructor(storage: Storage) {
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

  setPath(path: string[], name: string, data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getPath(path: string[], name: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  deletePath(path: string[], name: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async keys(): Promise<string[]> {
    const keys = getStorageKeys(this._storage)
    return keys
  }

  async hasKey(name: string): Promise<boolean> {
    const has = storageHasKey(this._storage, name)
    return has
  }
}
