import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'

export interface I<T> {
  a: T
}

export interface O<T> {
  a: T
}

export default class Memory<T> extends Primitive<I<T>, O<T>> {
  private _current: T | undefined = undefined

  constructor(config?: Config) {
    super({ i: ['a'], o: ['a'] }, config)

    this.addListener('reset', () => {
      this._current = undefined
    })
  }

  onDataInputData(name: string, data: I<T>[keyof I<T>]) {
    this._current = data
    this._forward_if_ready()
  }

  private _forward_if_ready() {
    while (
      !this._forwarding &&
      !this._backwarding &&
      this._current !== undefined
    ) {
      this._forward('a', this._current)
      this._current = undefined
      this._backward_all()
    }
  }

  onDataOutputDrop(name: string) {
    this._current = undefined
  }

  public onDataInputInvalid(name: string) {
    this._invalidate()
  }
}
