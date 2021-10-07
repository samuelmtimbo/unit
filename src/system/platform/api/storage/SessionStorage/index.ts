import { Config } from '../../../../../Class/Unit/Config'
import { getAllSessionStorage } from '../../../../../client/util/web/storage'
import { J } from '../../../../../interface/J'
import { V } from '../../../../../interface/V'
import { ObjectUpdateType } from '../../../../../Object'
import { Primitive } from '../../../../../Primitive'
import { Unlisten } from '../../../../../Unlisten'

export type I = {}

export type O = {}

export default class SessionStorage extends Primitive<I, O> implements V, J {
  constructor(config?: Config) {
    super(
      {
        i: [],
        o: [],
      },
      config
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
