import { $ } from '../../../Class/$'
import { Done } from '../../../Class/Functional/Done'
import { Semifunctional } from '../../../Class/Semifunctional'
import { J } from '../../../interface/J'
import { V } from '../../../interface/V'
import { _keys } from '../../f/object/Keys/f'

export interface I<T> {
  init: object
  done: any
}

export interface O<T> {
  obj: J
}

export default class _Object<T> extends Semifunctional<I<T>, O<T>> {
  constructor() {
    super(
      {
        fi: ['init'],
        fo: ['obj'],
        i: ['done'],
        o: [],
      },
      {
        output: {
          obj: {
            ref: true,
          },
        },
      }
    )
  }

  f({ init }: I<T>, done: Done<O<T>>): void {
    const obj = new (class __Object extends $ implements J, V {
      __: string[] = ['J']

      private _obj = init

      async get(name: string): Promise<any> {
        if (this._obj.hasOwnProperty(name)) {
          return this._obj[name]
        }
      }

      async set(name: string, data: any): Promise<void> {
        this._obj[name] = data
        return
      }

      async hasKey(name: string): Promise<boolean> {
        return this._obj[name] !== undefined
      }

      async delete(name: string): Promise<any> {
        delete this._obj[name]
        return
      }

      async setPath(path: string[], name: string, data: any): Promise<void> {
        let current = this._obj
        for (const p of path) {
          current = current[p]
        }
        current[name] = data
      }

      async getPath(path: string[], name: string): Promise<any> {
        let current = this._obj
        for (const p of path) {
          current = current[p]
        }
        return current[name]
      }

      async deletePath(path: string[], name: string): Promise<void> {
        let current = this._obj
        for (const p of path) {
          current = current[p]
        }
        delete current[name]
      }

      async read(): Promise<any> {
        return this._obj
      }

      async write(data: any): Promise<void> {
        this._obj = data
      }

      async keys(): Promise<string[]> {
        return _keys(this._obj)
      }
    })()

    done({
      obj,
    })
  }

  onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._backward('init')
    this._backward('done')
    // }
  }
}
