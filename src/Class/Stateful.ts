import { J } from '../interface/J'
import { V } from '../interface/V'
import { ObjectUpdateType } from '../Object'
import { Pod } from '../pod'
import { Primitive, PrimitiveEvents } from '../Primitive'
import { State } from '../State'
import { System } from '../system'
import { Dict } from '../types/Dict'
import { Unlisten } from '../types/Unlisten'
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

  protected _obj: Dict<any>

  constructor({ i = [], o = [] }: ION, opt: Opt, system: System, pod: Pod) {
    super(
      {
        i,
        o,
      },
      opt,
      system,
      pod
    )

    this._obj = {}
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
    throw new Error('Method not implemented.')
  }

  onDataInputData(name: string, data: any): void {
    // console.log('Stateful', 'onDataInputData', name, data)
    this._forwarding = true
    this.set(name, data)
    this._forwarding = false
  }

  onDataInputDrop(name: string): void {
    if (!this._backwarding) {
      this.set(name, undefined)
    }
  }

  public async get(name: string): Promise<any> {
    return this._obj[name] ?? this._defaultState[name]
  }

  public async read(): Promise<any> {
    return this._obj
  }

  public write(data: any): Promise<void> {
    this._obj = data
    return
  }

  public async set(name: string, data: any): Promise<void> {
    this._obj[name] = data
    this.emit('set', name, data)
  }

  hasKey(name: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  public delete(name: string): Promise<void> {
    delete this._obj[name]
    return
  }

  private _obj_at_path = (path: string[]): Dict<any> => {
    let obj = this._obj
    for (const p of path) {
      obj = obj[p]
    }
    return obj
  }

  pathSet(path: string[], name: string, data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }

  pathGet(path: string[], name: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  pathDelete(path: string[], name: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  keys(): Promise<string[]> {
    throw new Error('Method not implemented.')
  }
}
