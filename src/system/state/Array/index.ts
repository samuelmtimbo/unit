import { $ } from '../../../Class/$'
import { Done } from '../../../Class/Functional/Done'
import { Semifunctional } from '../../../Class/Semifunctional'
import { Config } from '../../../Class/Unit/Config'
import { A } from '../../../interface/A'
import { V } from '../../../interface/V'

export interface I<T> {
  init: any[]
  done: any
}

export interface O<T> {
  arr: A
}

export default class Array<T> extends Semifunctional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        fi: ['init'],
        fo: ['arr'],
        i: ['done'],
        o: [],
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
    const arr = new (class __Array extends $ implements V, A {
      _: string[] = ['A']

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

  onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._input.init.pull()
    this._input.done.pull()
    // }
  }
}
