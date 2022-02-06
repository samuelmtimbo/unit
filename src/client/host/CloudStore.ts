import { System } from '../../system'
import { Dict } from '../../types/Dict'
import { Store } from '../store'
import { requestJSON } from './fetchJSON'
import { isSignedIn } from './user'

export class CloudStore<T> implements Store<T> {
  private _hostname: string
  private _init: boolean

  constructor(public system: System, hostname: string) {
    this._hostname = hostname
  }

  private _id(id: string) {
    return `${this._hostname}/${id}`
  }

  init() {
    if (this._init) {
      return
    }

    this._init = true
  }

  get = (id: string): Promise<T | null> => {
    if (isSignedIn(this.system)) {
      return requestJSON(this._id(id)).then((response) => {
        return response.json()
      })
    } else {
      return Promise.resolve(null)
    }
  }

  getAll = (): Promise<Dict<T>> => {
    if (isSignedIn(this.system)) {
      return requestJSON(this._hostname, {}).then((response) => {
        return response.json()
      })
    } else {
      return Promise.resolve({})
    }
  }

  add = (id: string, data: T): Promise<T> => {
    // TODO
    return requestJSON(this._hostname, {
      method: 'POST',
      data: {
        id,
        data,
      },
    })
  }

  put = (id: string, data: T): Promise<T> => {
    return requestJSON(this._id(id), {
      method: 'PUT',
      data: {
        data,
      },
    })
  }

  patch = (id: string, data: T): Promise<T> => {
    return requestJSON(this._id(id), {
      method: 'PATCH',
      data,
    })
  }

  delete = (id: string): Promise<void> => {
    return requestJSON(this._id(id), {
      method: 'DELETE',
      data: {},
    })
  }

  addAll = (data: T[]): Promise<void> => {
    // TODO
    return
  }

  clear = (): Promise<any> => {
    // TODO
    return
  }

  reset = (data: T[]): Promise<any> => {
    // TODO
    return
  }
}
