import { $ } from '../../../../Class/$'
import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { J } from '../../../../interface/J'
import { V } from '../../../../interface/V'

export interface I<T> {
  init: object
}

export interface O<T> {}

export default class _Object<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['init'],
        o: ['obj'],
      },
      config,
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
      _: string[] = ['J']

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

      hasKey(name: string): Promise<boolean> {
        throw new Error('Method not implemented.')
      }

      async delete(name: string): Promise<any> {
        delete this._obj[name]
        return
      }

      async setPath(path: string[], name: string, data: any): Promise<void> {
        throw new Error('Method not implemented.')
      }

      async getPath(path: string[], name: string): Promise<any> {
        throw new Error('Method not implemented.')
      }

      async deletePath(path: string[], name: string): Promise<void> {
        throw new Error('Method not implemented.')
      }

      async read(): Promise<any> {
        return this._obj
      }

      async write(data: any): Promise<void> {
        this._obj = data
      }
    })()

    done({
      obj,
    })
  }
}
