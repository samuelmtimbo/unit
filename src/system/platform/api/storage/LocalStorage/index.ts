import { Unit } from '../../../../../Class/Unit'
import { Config } from '../../../../../Class/Unit/Config'
import { getAllLocalStorage } from '../../../../../client/util/web/storage'
import { J } from '../../../../../interface/J'
import { V } from '../../../../../interface/V'
import { ObjectUpdateType } from '../../../../../Object'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../Unlisten'

export type I = {}

export type O = {}

export default class _LocalStorage
  extends Unit<I, O>
  implements J, V<Dict<string>>
{
  constructor(config?: Config) {
    super(
      {
        i: [],
        o: [],
      },
      config,
      {}
    )
  }

  private _checkAPI = () => {
    if (!localStorage) {
      throw new Error('Local Storage API not implemented')
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

  async get(name: string): Promise<string> {
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

  setPath(path: string[], name: string, data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getPath(path: string[], name: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  deletePath(path: string[], name: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
