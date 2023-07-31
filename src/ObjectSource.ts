import { Callback } from './types/Callback'
import { Unlisten } from './types/Unlisten'

export class ObjectSource<T> {
  private _data: T = null
  private _callback: Callback<T>[] = []

  constructor(data: T = null) {
    this._data = data
  }

  set(data: T): void {
    this._data = data

    for (const callback of this._callback) {
      callback(data)
    }
  }

  connect(callback: Callback<T>): Unlisten {
    this._callback.push(callback)

    if (this._data) {
      callback(this._data)
    }

    return () => {
      const i = this._callback.indexOf(callback)

      if (i > -1) {
        this._callback.splice(i, 1)
      } else {
        throw new Error('can only unlisten once')
      }
    }
  }
}
