import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { Semifunctional } from '../../../../Class/Semifunctional'
import { System } from '../../../../system'
import { ID_N_ARRAY_BUILDER } from '../../../_ids'

export type I<T> = {
  a: T
  n: number
}

export type O<T> = {
  'a[]': T[]
}

export default class NArrayBuilder<T> extends Semifunctional<I<T>, O<T>> {
  private _n: number
  private _array: T[]

  constructor(system: System) {
    super(
      {
        fi: ['n'],
        fo: ['a[]'],
        i: ['a'],
        o: [],
      },
      {},
      system,
      ID_N_ARRAY_BUILDER
    )

    this.addListener('reset', () => {
      this._n = undefined
      this._array = []
    })
  }

  f({ n }: I<T>, done: Done<O<T>>, fail: Fail) {
    if (n < 0) {
      fail('n cannot be negative')

      return
    }

    if (n === 0) {
      this._output['a[]'].push([])

      return
    }

    this._n = n
    this._array = []

    if (this._i.a !== undefined) {
      this._loop(this._i.a)
    }
  }

  d() {
    this._n = undefined
    this._array = []
  }

  onIterDataInputData(name: string, data: any): void {
    // console.log('NArrayBuilder', name, data)

    // if (name === 'a') {
    const a = data as T
    if (this._n !== undefined) {
      this._loop(a)
    }
    // }
  }

  private _loop(a: T) {
    this._array.push(a)
    if (this._array.length === this._n) {
      this._output['a[]'].push(this._array)
      this._n = undefined
      this._array = []
    }
    this._input.a.pull()
  }
}
