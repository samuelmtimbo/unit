import { MethodNotImplementedError } from '../exception/MethodNotImplementedError'
import { ObjectUpdateType } from '../ObjectUpdateType'
import { System } from '../system'
import isEqual from '../system/f/comparison/Equals/f'
import { Callback } from '../types/Callback'
import { Dict } from '../types/Dict'
import { J } from '../types/interface/J'
import { V } from '../types/interface/V'
import { Unlisten } from '../types/Unlisten'
import { $ } from './$'
import { Component__, ComponentEE } from './Component'
import { ION, Opt } from './Unit'

export type Stateful_EE<I extends Dict<any> = any> = {
  set: [keyof I, I[keyof I]]
}

export type StatefulEvents<_EE extends Dict<any[]>> = ComponentEE<
  _EE & Stateful_EE
> &
  Stateful_EE

export class Stateful<
    I extends Dict<any> = any,
    O extends Dict<any> = any,
    _J extends Dict<any> = {},
    _EE extends StatefulEvents<_EE> = StatefulEvents<Stateful_EE>,
  >
  extends Component__<I, O, _EE>
  implements J<I>, V
{
  __ = ['U', 'J', 'V']

  protected _defaultState: Partial<Record<keyof I, any>> = {}

  protected _state: Partial<Record<keyof I, any>> = {}

  constructor(
    { i = [], o = [] }: ION<I, O>,
    opt: Opt,
    system: System,
    id: string
  ) {
    super(
      {
        i,
        o,
      },
      opt,
      system,
      id
    )
  }

  subscribe(
    path: string[],
    name: any,
    listener: (
      type: ObjectUpdateType,
      path: string[],
      key: string,
      data: any
    ) => void
  ): Unlisten {
    throw new MethodNotImplementedError()
  }

  public _set_from_input: boolean = false

  onDataInputData<K extends keyof I>(name: K, data: any): void {
    void this.set(name, data, true)
  }

  onDataInputDrop<K extends keyof I>(name: K): void {
    this._set_from_input = false

    if (!this._backwarding) {
      void this.set(name, undefined)
    }
  }

  onRefInputData(name: any, data: any): void {
    super.onRefInputData(name, data)

    this._forwarding = true
    void this.set(name, data)
    this._forwarding = false
  }

  onRefInputDrop(name: any): void {
    if (!this._backwarding) {
      void this.set(name, undefined)
    }
  }

  public get<K extends keyof I>(name: K): any {
    return this._state[name] ?? this._defaultState[name]
  }

  public read(callback: Callback<any>): void {
    callback(this._state)
  }

  public write(data: any, callback: Callback): void {
    this._state = data

    callback()
  }

  public set<K extends keyof I>(
    name: K,
    data: any,
    auto: boolean = false
  ): void {
    this._set_from_input = auto

    this._state[name] = data
    this.emit('set', name, data)
    // @ts-ignore
    this.emit(name, data)
  }

  hasKey<K extends keyof I>(name: K): boolean {
    throw new MethodNotImplementedError()
  }

  delete<K extends keyof I>(name: K): Promise<void> {
    delete this._state[name]

    return
  }

  deepSet(path: string[], data: any): void {
    throw new MethodNotImplementedError()
  }

  deepGet(path: string[]): any {
    throw new MethodNotImplementedError()
  }

  deepDelete(path: string[]): void {
    throw new MethodNotImplementedError()
  }

  deepHas(path: string[]): boolean {
    try {
      this.deepGet(path)

      return true
    } catch (err) {
      return false
    }
  }

  keys(): string[] {
    throw new MethodNotImplementedError()
  }

  setPinIgnored(): void {
    //
  }

  snapshotSelf(): Dict<any> {
    const _state: Partial<Record<keyof I, any>> = {}

    for (const key in this._state) {
      const value = this._state[key] as any

      if (value instanceof $) {
        _state[key] = null
      } else {
        _state[key] = value
      }
    }

    return {
      ...super.snapshotSelf(),
      ...(!isEqual(this._state, this._defaultState) ? { _state } : {}),
    }
  }

  restoreSelf(state: Dict<any>): void {
    const { _state, ...rest } = state

    super.restoreSelf(rest)

    this._state = _state || this._defaultState
  }
}
