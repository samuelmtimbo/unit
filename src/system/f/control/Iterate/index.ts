import { Primitive } from '../../../../Primitive'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_ITERATE } from '../../../_ids'

export interface I<T> {
  init: T
  next: T
}

export interface O<T> {
  current: T
  local: T
}

export default class Iterate<T> extends Primitive<I<T>, O<T>> {
  private _current: T | undefined = undefined
  private _next: boolean = undefined

  constructor(system: System) {
    super(
      {
        i: ['init', 'next'],
        o: ['local', 'current'],
      },
      {},
      system,
      ID_ITERATE
    )

    this.addListener('reset', this._reset)
  }

  private _reset() {
    this._current = undefined
    this._next = undefined
  }

  onDataInputData(name: string, data: I<T>[keyof I<T>]) {
    if (name === 'init') {
      this._current = data as T
      this._output.local.push(data)
      this._output.current.push(data)
    } else if (name === 'next') {
      this._current = data
      this._next = true
      this._output.current.push(data)
      this._input.next.pull()
      this._output.local.push(this._current)
      if (this._output.local.empty()) {
        this._next = undefined
      }
    }
  }

  onDataInputDrop(name: string) {
    if (!this._backwarding) {
      if (name === 'init') {
        this._reset()
        this._forward_all_empty()
        return
      }
    }
  }

  onDataOutputDrop(name: string) {
    if (!this._forwarding_empty) {
      if (name === 'current') {
        this._output.local.pull()
        this._input.init.pull()
      } else if (name === 'local') {
        if (this._next === true) {
          this._next = false
          this._output.local.push(this._current)
        }
      }
    }
  }

  public onDataInputInvalid(name: string): void {
    if (name === 'init') {
      this._reset()
      this._output.local.invalidate()
    }
    this._output.current.invalidate()
  }

  public snapshotSelf(): Dict<any> {
    return {
      ...super.snapshotSelf(),
      ...(this._current !== undefined ? { _current: this._current } : {}),
      ...(this._next !== undefined ? { _next: this._next } : {}),
    }
  }

  public restoreSelf(state: Dict<any>): void {
    const { _current, _next, ...rest } = state

    super.restoreSelf(rest)

    this._current = _current
    this._next = _next
  }
}
