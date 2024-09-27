import { Primitive } from '../../../../Primitive'
import { System } from '../../../../system'
import { ID_DEFAULT } from '../../../_ids'

export interface I<T> {
  a: T
  d: T
}

export interface O<T> {
  a: T
}

export default class Default<T> extends Primitive<I<T>, O<T>> {
  private _current: T | undefined = undefined

  constructor(system: System) {
    super({ i: ['a', 'd'], o: ['a'] }, {}, system, ID_DEFAULT)

    this.addListener('reset', this._reset)
  }

  private _reset = () => {
    this._current = undefined
  }

  onDataInputData(name: string, data: I<T>[keyof I<T>]) {
    if (name === 'a') {
      this._current = data
      if (!this._input.d.empty()) {
        this._invalidate()
      }
    } else if (name === 'd') {
      if (this._input.a.empty()) {
        this._current = data
      }
    }
    this._forward_if_ready()
  }

  private _forward_if_ready() {
    while (
      !this._forwarding &&
      !this._backwarding &&
      this._o_active.size - this._o_invalid.size === 0 &&
      this._current !== undefined
    ) {
      this._forward('a', this._current)
    }
  }

  private _done() {
    this._backwarding = true
    if (this._input.a.empty()) {
      this._input.d.pull()
    } else {
      this._input.a.pull()
    }
    this._backwarding = false
  }

  onDataInputDrop(name: string) {
    if (name === 'a') {
      if (!this._input.d.empty()) {
        this._current = this._input.d.peak()
        this._invalidate()
        this._forward_if_ready()
      } else {
        this._current = undefined
        this._forward_all_empty()
      }
    } else {
      if (this._input.a.empty()) {
        this._current = undefined
        this._forward_all_empty()
      }
    }
  }

  onDataOutputDrop(name: string) {
    this._current = undefined
    this._done()
    if (!this._input.a.empty()) {
      this._current = this._input.d.peak()
      this._forward_if_ready()
    } else if (!this._input.d.empty()) {
      this._current = this._input.d.peak()
      this._forward_if_ready()
    }
  }

  public onDataInputInvalid(name: string) {
    this._invalidate()
  }
}
