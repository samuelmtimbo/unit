import { Callback } from './types/Callback'

export class Waiter<T> {
  private _data: T = undefined
  private _callback: Callback<T>[] = []

  constructor(data: T = undefined) {
    this._data = data
  }

  set(data: T): void {
    this._data = data

    for (const callback of this._callback) {
      callback(data)
    }

    this._callback = []
  }

  clear() {
    this._data = undefined
  }

  async once(): Promise<T> {
    if (this._data !== undefined) {
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
