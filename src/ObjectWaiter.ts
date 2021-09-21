import { Callback } from './Callback'

export class ObjectWaiter<T> {
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
    this._callback = []
  }

  async once(): Promise<T> {
    if (this._data) {
      return this._data
    } else {
      return new Promise((resolve, reject) => {
        const callback = () => {
          resolve(this._data)
        }
        this._callback.push(callback)
      })
    }
  }
}
