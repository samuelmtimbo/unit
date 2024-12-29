import { Primitive } from '../../../../Primitive'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_NEXT } from '../../../_ids'

export interface I<T> {
  init: T
  next: T
}

export interface O<T> {
  current: T
}

export default class Next<T> extends Primitive<I<T>, O<T>> {
  private _current: T | undefined = undefined
  private _next: boolean = undefined

  constructor(system: System) {
    super(
      {
        i: ['init', 'next'],
        o: ['current'],
      },
      {},
      system,
      ID_NEXT
    )

    this.addListener('reset', this._reset)
  }

  private _reset() {
    this._current = undefined
    this._next = undefined
  }

  onDataInputData(name: string, data: I<T>[keyof I<T>]) {
    const {
      api: {
        window: { nextTick },
      },
    } = this.__system

    if (name === 'init') {
      this._current = data as T
      this._output.current.push(data)
    } else if (name === 'next') {
      this._current = data
      this._next = true
      this._input.next.pull()

      nextTick(() => {
        this._output.current.push(data)

        this._next = undefined
      })
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
        this._input.init.pull()
      }
    }
  }

  public onDataInputInvalid(name: string): void {
    if (name === 'init') {
      this._reset()
    }
    this._output.current.invalidate()
  }

  public snapshotSelf(): Dict<any> {
    return {
      ...super.snapshotSelf(),
      _current: this._current,
      _next: this._next,
    }
  }

  public restoreSelf(state: Dict<any>): void {
    const { _current, _next, ...rest } = state

    super.restoreSelf(rest)

    this._current = _current
    this._next = _next
  }
}
