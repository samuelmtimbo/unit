import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'

export interface I<T> {
  a: T
}

export interface O<T> {
  first: T
  second: T
}

export default class Plan<T> extends Primitive<I<T>, O<T>> {
  private _current: T | undefined = undefined
  private _looping: boolean = false

  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['first', 'second'],
      },
      config
    )
  }

  onDataInputData(name: string, data: any) {
    if (!this._output.second.empty()) {
      this._forwarding_empty = true
      this._output.second.pull()
      this._forwarding_empty = false
    }
    this._current = data
    this._forward_if_ready()
  }

  private _forward_if_ready() {
    while (
      !this._forwarding &&
      !this._backwarding &&
      !this._looping &&
      this._current !== undefined
    ) {
      this._looping = true
      this._forwarding = true
      this._output.first.push(this._current)
      this._forwarding = false
    }
  }

  onDataInputDrop(name: string) {
    if (!this._backwarding) {
      this._current = undefined
      this._looping = false
      this._output.first.pull()
      this._output.second.pull()
    }
  }

  onDataInputInvalid(name: string) {
    this._looping = false
    this._output.first.invalidate()
    this._output.second.invalidate()
  }

  onDataOutputDrop(name: string) {
    // console.log('Plan', 'onDataOutputDrop', name)
    if (name === 'first') {
      if (this._current !== undefined) {
        this._forwarding = true
        this._output.second.push(this._current)
        this._forwarding = false
      }
    } else {
      this._looping = false
    }
    this._backward_if_ready()
    this._forward_if_ready()
  }

  private _backward_if_ready() {
    if (
      this._current !== undefined &&
      !this._forwarding &&
      !this._forwarding_empty &&
      !this._looping
    ) {
      this._current = undefined
      this._backward_all()
    }
  }
}
