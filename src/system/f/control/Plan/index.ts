import { Primitive } from '../../../../Primitive'
import { System } from '../../../../system'
import { ID_PLAN } from '../../../_ids'

export interface I<T> {
  a: T
}

export interface O<T> {
  '0': T
  '1': T
}

export default class Plan<T> extends Primitive<I<T>, O<T>> {
  private _current: T | undefined = undefined
  private _looping: boolean = false

  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['0', '1'],
      },
      {},
      system,
      ID_PLAN
    )

    this.addListener('reset', this._reset)
  }

  private _reset() {
    this._current = undefined
    this._looping = false
  }

  onDataInputData(name: string, data: any) {
    this._current = data

    this._forward_if_ready()
  }

  private _forward_if_ready() {
    while (
      !this._forwarding &&
      !this._backwarding &&
      !this._looping &&
      this._current !== undefined &&
      this._i_invalid.size === 0
    ) {
      this._looping = true
      this._forwarding = true
      this._output[0].push(this._current)
      this._forwarding = false
    }
  }

  onDataInputDrop(name: string) {
    if (!this._backwarding) {
      this._current = undefined
      this._looping = false
      this._output[0].pull()
      this._output[1].pull()
    }
  }

  onDataInputInvalid(name: string) {
    this._looping = false
    this._current = undefined
    this._output[0].invalidate()
    this._output[1].invalidate()
  }

  onDataOutputDrop(name: string) {
    // console.log('Plan', 'onDataOutputDrop', name)
    if (name === '0') {
      if (this._current !== undefined) {
        this._forwarding = true
        this._output[1].push(this._current)
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

  public snapshotSelf() {
    return {
      ...super.snapshotSelf(),
      _looping: this._looping,
      _current: this._current,
    }
  }

  public restoreSelf(state): void {
    const { _looping, _current, ...rest } = state

    super.restoreSelf(rest)

    this._looping = _looping
    this._current = _current
  }
}
