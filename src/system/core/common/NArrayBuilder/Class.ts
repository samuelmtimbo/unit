import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'

export type I<T> = {
  a: T
  n: number
}

export type O<T> = {
  'a[]': T[]
}

export default class ArrayBuilder<T> extends Primitive<I<T>, O<T>> {
  private _n: number
  private _array: T[]

  constructor(config?: Config) {
    super(
      {
        i: ['n', 'a'],
        o: ['a[]'],
      },
      config
    )

    this.addListener('reset', () => {
      this._n = undefined
      this._array = []
    })
  }

  onDataInputData(name: string, data: any) {
    switch (name) {
      case 'n':
        const n = data as number
        if (this._n < 0) {
          this.err('n cannot be negative')
          return
        }
        if (n === 0) {
          this._output['a[]'].push([])
          return
        }
        if (this._i.n !== undefined) {
          this._forwarding_empty = true
          this._output['a[]'].pull()
          this._forwarding_empty = false
        }
        this._n = n
        this._array = []
        if (this._i.a !== undefined) {
          this._loop(this._i.a as T)
        }
        break
      case 'a':
        if (this._n !== undefined) {
          this._loop(data as T)
        }
        break
    }
  }

  onDataInputDrop(name: string) {
    if (name === 'n' && !this._backwarding) {
      this._n = undefined
      this._array = []
      this._output['a[]'].pull()
    }
  }

  onDataOutputDrop(name: string) {
    if (!this._forwarding_empty) {
      this._backwarding = true
      this._input.n.pull()
      this._backwarding = false
    }
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
