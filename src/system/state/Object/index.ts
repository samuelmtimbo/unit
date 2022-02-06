import { Done } from '../../../Class/Functional/Done'
import { Semifunctional } from '../../../Class/Semifunctional'
import { J } from '../../../interface/J'
import { V } from '../../../interface/V'
import { ObjectUpdateType, Object_ } from '../../../Object'
import { Pod } from '../../../pod'
import { System } from '../../../system'
import { Dict } from '../../../types/Dict'
import { Unlisten } from '../../../types/Unlisten'

export interface I<T> {
  init: T
  done: any
}

export interface O<T> {}

export default class _Object<T extends Dict<any>>
  extends Semifunctional<I<T>, O<T>>
  implements V, J
{
  __: string[] = ['J', 'V']

  private _obj: Object_<T>

  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['init'],
        fo: [],
        i: ['done'],
        o: [],
      },
      {
        output: {
          obj: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  f({ init }: I<T>, done: Done<O<T>>): void {
    this._obj = new Object_<T>(init)
  }

  onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._backward('init')
    this._backward('done')
    // }
  }

  async get(name: string): Promise<any> {
    return this._obj.get(name)
  }

  async set(name: string, data: any): Promise<void> {
    return this._obj.set(name, data)
  }

  async hasKey(name: string): Promise<boolean> {
    return this._obj.hasKey(name)
  }

  async delete(name: string): Promise<any> {
    return this._obj.delete(name)
  }

  async pathSet(path: string[], name: string, data: any): Promise<void> {
    return this._obj.pathSet(path, name, data)
  }

  async pathGet(path: string[], name: string): Promise<any> {
    return this._obj.pathGet(path, name)
  }

  async pathDelete(path: string[], name: string): Promise<void> {
    return this._obj.pathDelete(path, name)
  }

  async read(): Promise<any> {
    return this._obj.read()
  }

  async write(data: any): Promise<void> {
    this._obj.write(data)
  }

  async keys(): Promise<string[]> {
    return this._obj.keys()
  }

  subscribe(
    path: string[],
    key: string,
    listener: (
      type: ObjectUpdateType,
      path: string[],
      key: string,
      data: any
    ) => void
  ): Unlisten {
    return this._obj.subscribe(path, key, listener)
  }
}
