import { Unit } from '../../../../../Class/Unit'
import {
  getAllLocalStorage,
  getStorageKeys,
  storageHasKey,
} from '../../../../../client/util/web/storage'
import { APINotSupportedError } from '../../../../../exception/APINotImplementedError'
import { ObjectUpdateType } from '../../../../../Object'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { J } from '../../../../../types/interface/J'
import { V } from '../../../../../types/interface/V'
import { Unlisten } from '../../../../../types/Unlisten'
import { ID_LOCAL_STORAGE } from '../../../../_ids'

export type I = {}

export type O = {}

export default class _LocalStorage
  extends Unit<I, O>
  implements J<Dict<any>>, V<Dict<string>>
{
  constructor(system: System) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system,
      ID_LOCAL_STORAGE
    )
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

  private _checkAPI = () => {
    if (!localStorage) {
      throw new APINotSupportedError('Local Storage')
    }
  }

  async read(): Promise<Dict<string>> {
    const obj = getAllLocalStorage()
    return obj
  }

  async write(data: Dict<string>): Promise<void> {
    // TODO
    return
  }

  async get(name: string): Promise<any> {
    this._checkAPI()

    const value = localStorage.getItem(name)
    if (value === null) {
      throw new Error('item not found')
    } else {
      return value
    }
  }

  async set(name: string, data: string): Promise<void> {
    this._checkAPI()

    localStorage.setItem(name, data)
  }

  async delete(name: string): Promise<any> {
    this._checkAPI()

    localStorage.removeItem(name)
  }

  async pathSet(path: string[], name: string, data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async pathGet(path: string[], name: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async pathDelete(path: string[], name: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async keys(): Promise<string[]> {
    const keys = getStorageKeys(localStorage)

    return keys
  }

  async hasKey(name: string): Promise<boolean> {
    const has = storageHasKey(localStorage, name)

    return has
  }
}
