import { Done } from '../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../Class/Semifunctional'
import { System } from '../../../../system'
import { ID_APPEND } from '../../../_ids'

export interface I<T> {
  a: T[]
  'a[i] < a[j]': boolean
}

export interface O<T> {
  'a[i]': T
  'a[j]': T
  b: T[]
}

export default class Sort<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['a'],
        fo: ['b'],
        i: ['a[i] < a[j]'],
        o: ['a[i]', 'a[j]'],
      },
      {},
      system,
      ID_APPEND
    )
  }

  private _index = 0
  private _test: boolean[] = []
  private _pairs: [T, T][] = []

  f({ a }: I<T>, done: Done<O<T>>): void {
    if (a.length < 2) {
      done({ b: a })

      return
    }

    this._index = 0
    this._test = []
    this._pairs = []

    a.sort((a, b) => {
      this._pairs.push([a, b])

      return 0
    })

    this._push_current()
  }

  private _push_current = () => {
    this._forwarding = true

    const [a, b] = this._pairs[this._index]

    this.pushOutput('a[i]', a)
    this.pushOutput('a[j]', b)

    this._forwarding = false

    this._loop()
  }

  public onIterDataInputData(name: string, data: any): void {
    switch (name) {
      case 'a[i] < a[j]': {
        this._test.push(data)

        this._index++

        this._input['a[i] < a[j]'].pull()

        this._loop()

        break
      }
    }
  }

  private _loop = () => {
    if (this._primitive._active_o_count === 0) {
      if (this._index === this._pairs.length - 1) {
        let j = 0

        const b = this._i.a.sort((a, b) => {
          const result = this._test[j]

          j++

          return result ? 1 : -1
        })

        this._done({ b })
      } else if (this._index < this._pairs.length - 1) {
        this._push_current()
      }
    }
  }

  public onIterDataOutputDrop(name: string): void {
    if (!this._forwarding) {
      this._loop()
    }
  }
}
