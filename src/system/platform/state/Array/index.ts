import { $ } from '../../../../Class/$'
import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { A } from '../../../../interface/A'
import { V } from '../../../../interface/V'

export interface I<T> {
  init: any[]
}

export interface O<T> {}

export default class Array<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['init'],
        o: ['arr'],
      },
      config,
      {
        output: {
          arr: {
            ref: true,
          },
        },
      }
    )
  }

  f({ init }: I<T>, done: Done<O<T>>): void {
    const arr = new (class __Object extends $ implements V, A {
      _: string[] = ['J']

      private _arr = init

      async append(a: any): Promise<void> {
        this._arr.push(a)
        return
      }

      async put(i: number, data: any): Promise<void> {
        this._arr[i] = data
        return
      }

      async at(i: number): Promise<any> {
        return this._arr[i]
      }

      async length(): Promise<number> {
        return this._arr.length
      }

      async indexOf(a: any): Promise<number> {
        return this._arr.indexOf(a)
      }

      async read(): Promise<any> {
        return this._arr
      }

      async write(data: any): Promise<void> {
        this._arr = data
      }
    })()

    done({
      arr,
    })
  }
}
