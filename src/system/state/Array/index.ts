import { Done } from '../../../Class/Functional/Done'
import { Semifunctional } from '../../../Class/Semifunctional'
import { A } from '../../../interface/A'
import { V } from '../../../interface/V'
import { Pod } from '../../../pod'
import { System } from '../../../system'

export interface I<T> {
  init: any[]
  done: any
}

export interface O<T> {}

export default class Array<T>
  extends Semifunctional<I<T>, O<T>>
  implements V, A
{
  private _arr: T[]

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
          arr: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  f({ init }: I<T>, done: Done<O<T>>): void {
    done({})
  }

  onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._input.init.pull()
    this._input.done.pull()
    // }
  }

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
}
