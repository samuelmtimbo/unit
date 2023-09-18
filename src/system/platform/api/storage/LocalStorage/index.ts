import { Unit } from '../../../../../Class/Unit'
import { EventEmitter_ } from '../../../../../EventEmitter'
import { ObjectUpdateType } from '../../../../../Object'
import {
  getAllLocalStorage,
  getStorageKeys,
  storageHasKey,
} from '../../../../../client/util/web/storage'
import { APINotSupportedError } from '../../../../../exception/APINotImplementedError'
import { MethodNotImplementedError } from '../../../../../exception/MethodNotImplementedError'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import { J } from '../../../../../types/interface/J'
import { V } from '../../../../../types/interface/V'
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

  private ___emitter = new EventEmitter_()

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
      throw new Error('local storage path length must be 0')
    }

    const setListener = (key_, data) => {
      if (key === '*' || key_ === key) {
        listener('set', path, key_, data)
      }
    }

    const deleteListener = (data) => {
      listener('delete', path, key, data)
    }

    emitter.addListener('set', setListener)
    emitter.addListener('delete', deleteListener)

    const unlisten = () => {
      emitter.removeListener('set', setListener)
      emitter.removeListener('delete', deleteListener)
    }

    return unlisten
  }

  private _checkAPI = () => {
    if (!localStorage) {
      throw new APINotSupportedError('Local Storage')
    }
  }

  async read(): Promise<Dict<string>> {
    // TODO system
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
    const { emitter } = this.__system

    this._checkAPI()

    localStorage.setItem(name, data)

    emitter.emit('set', name, data)
  }

  async delete(name: string): Promise<any> {
    const { emitter } = this.__system

    this._checkAPI()

    const data = localStorage.getItem(name)

    localStorage.removeItem(name)

    emitter.emit('delete', name, data)
  }

  async pathSet(path: string[], name: string, data: any): Promise<void> {
    throw new MethodNotImplementedError()
  }

  async pathGet(path: string[], name: string): Promise<any> {
    throw new MethodNotImplementedError()
  }

  async pathDelete(path: string[], name: string): Promise<void> {
    throw new MethodNotImplementedError()
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
