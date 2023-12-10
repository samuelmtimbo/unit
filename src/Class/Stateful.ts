import { MethodNotImplementedError } from '../exception/MethodNotImplementedError'
import { ObjectUpdateType } from '../ObjectUpdateType'
import { Primitive, PrimitiveEvents } from '../Primitive'
import { State } from '../State'
import { System } from '../system'
import { Dict } from '../types/Dict'
import { J } from '../types/interface/J'
import { V } from '../types/interface/V'
import { Unlisten } from '../types/Unlisten'
import { $ } from './$'
import { ION, Opt } from './Unit'

export type Stateful_EE = {
  set: [string, any]
}

export type StatefulEvents<_EE extends Dict<any[]>> = PrimitiveEvents<
  _EE & Stateful_EE
> &
  Stateful_EE

export class Stateful<
    I = any,
    O = any,
    _J extends Dict<any> = {},
    _EE extends StatefulEvents<_EE> = StatefulEvents<Stateful_EE>
  >
  extends Primitive<I, O, _EE>
  implements J, V
{
  __ = ['U', 'J', 'V']

  public stateful = true

  protected _defaultState: State = {}

  protected _state: Dict<any> = {}

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

  onDataInputData(name: string, data: any): void {
    this._forwarding = true
    this.set(name, data)
    this._forwarding = false
  }

  onDataInputDrop(name: string): void {
    if (!this._backwarding) {
      this.set(name, undefined)
    }
  }

  onRefInputData(name: any, data: any): void {
    super.onRefInputData(name, data)

    this._forwarding = true
    this.set(name, data)
    this._forwarding = false
  }

  onRefInputDrop(name: any): void {
    if (!this._backwarding) {
      this.set(name, undefined)
    }
  }

  public async get(name: string): Promise<any> {
    return this._state[name] ?? this._defaultState[name]
  }

  public async read(): Promise<any> {
    return this._state
  }

  public write(data: any): Promise<void> {
    this._state = data
    return
  }

  public async set(name: string, data: any): Promise<void> {
    this._state[name] = data
    this.emit('set', name, data)
    // @ts-ignore
    this.emit(name, data)
  }

  hasKey(name: string): Promise<boolean> {
    throw new MethodNotImplementedError()
  }

  delete(name: string): Promise<void> {
    delete this._state[name]

    return
  }

  pathSet(path: string[], name: string, data: any): Promise<void> {
    throw new MethodNotImplementedError()
  }

  pathGet(path: string[], name: string): Promise<any> {
    throw new MethodNotImplementedError()
  }

  pathDelete(path: string[], name: string): Promise<void> {
    throw new MethodNotImplementedError()
  }

  keys(): Promise<string[]> {
    throw new MethodNotImplementedError()
  }

  snapshotSelf(): Dict<any> {
    const _state = {}

    for (const key in this._state) {
      const value = this._state[key]

      if (value instanceof $) {
        _state[key] = null
      } else {
        _state[key] = value
      }
    }

    return {
      ...super.snapshotSelf(),
      _state,
    }
  }

  restoreSelf(state: Dict<any>): void {
    const { _state, ...rest } = state

    super.restoreSelf(rest)

    this._state = _state || this._defaultState
  }
}
