import { Primitive } from '../../../../Primitive'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_LOOP } from '../../../_ids'

export interface I<T> {
  init: T
  next: T
  test: boolean
}

export interface O<T> {
  local: T
  current: T
  final: T
}

export default class Loop<T> extends Primitive<I<T>, O<T>> {
  private _current: T | undefined = undefined
  private _next: T | undefined = undefined
  private _test: boolean | undefined = undefined
  private _looping: boolean = false
  private _nexting: boolean = false

  constructor(system: System) {
    super(
      {
        i: ['init', 'next', 'test'],
        o: ['local', 'current', 'final'],
      },
      {},
      system,
      ID_LOOP
    )

    this.addListener('reset', this._reset)
  }

  private _reset() {
    this._current = undefined
    this._next = undefined
    this._nexting = false
    this._looping = false
  }

  onDataInputData(name: string, data: I<T>[keyof I<T>]) {
    if (name === 'init') {
      this._current = data as T
      this._output.local.push(data as T)
      this._forward_if_ready()
    } else if (name === 'next') {
      if (
        this._next === undefined &&
        this._current !== undefined &&
        this._input.test.peak()
      ) {
        this._next = data as T
        this._pull_next()
      }
    } else if (name === 'test') {
      this._test = data as boolean

      if (this._current !== undefined) {
        this._forward_if_ready()
      }
    }
  }

  onDataInputDrop(name: string) {
    if (!this._backwarding) {
      if (name === 'next') {
        return
      }

      if (name === 'test') {
        this._test = undefined
        this._next = undefined
        this._forward_empty('current')
        this._forward_empty('final')
        return
      }

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
        if (this._next !== undefined) {
          this._loop()
        }
      } else if (name === 'local') {
        if (this._current === undefined) {
          this._done()
        } else if (this._looping) {
          this._looping = false
          this._output.local.push(this._current)
          if (this._test !== undefined) {
            this._forward_if_ready()
          }
        }
      } else {
        this._current = undefined
        this._backward('test')
        if (this._output.local.empty()) {
          this._done()
        }
      }
    }
  }

  public onDataInputInvalid(name: string): void {
    if (name === 'init') {
      this._reset()
      this._output.local.invalidate()
    } else if (name === 'test') {
      this._nexting = false
      this._next = undefined
    }
    this._output.current.invalidate()
    this._output.final.invalidate()
  }

  private _pull_next(): void {
    this._nexting = false
    this._input.next.pull()
    if (this._output.current.empty()) {
      this._loop()
    }
  }

  private _loop(): void {
    this._looping = true
    this._current = this._next
    this._next = undefined
    this._backward('test')
    if (this._looping && this._output.local.empty()) {
      this._looping = false
      this._output.local.push(this._current)
      this._forward_if_ready()
    }
  }

  private _iterate(): void {
    this._forwarding = true
    if (this._input.test.peak()) {
      this._nexting = true
      this._output.current.push(this._current)
      const next = this._input.next.peak()
      if (this._next === undefined && next !== undefined) {
        this._next = next
        this._pull_next()
      }
    } else {
      this._output.final.push(this._current)
      this._output.current.pull()
    }
    this._forwarding = false
  }

  private _done(): void {
    this._reset()
    this._backward('init')
  }

  private _forward_if_ready(): void {
    while (
      !this._forwarding &&
      !this._looping &&
      !this._nexting &&
      this._current !== undefined &&
      !this._input.test.empty() &&
      !this._input.test.invalid() &&
      (this._output.current.empty() || this._output.current.invalid()) &&
      (this._output.final.empty() || this._output.final.invalid())
    ) {
      this._iterate()
    }
  }

  public snapshotSelf(): Dict<any> {
    return {
      ...super.snapshotSelf(),
      _current: this._current,
      _next: this._next,
      _test: this._test,
      _nexting: this._nexting,
      _looping: this._looping,
    }
  }

  public restoreSelf(state: Dict<any>): void {
    const { _current, _next, _test, _nexting, _looping, ...rest } = state

    super.restoreSelf(rest)

    this._current = _current
    this._next = _next
    this._test = _test
    this._nexting = _nexting
    this._looping = _looping
  }
}
