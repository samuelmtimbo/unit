import { Semifunctional } from '../../../../Class/Semifunctional'
import { System } from '../../../../system'
import { ID_TRANSISTOR } from '../../../_ids'

export interface I<T> {
  a: T
  b: any
}

export interface O<T> {
  a: T
}

export default class Transistor<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['a'],
        fo: ['a'],
        i: ['b'],
        o: [],
      },
      {},
      system,
      ID_TRANSISTOR
    )
  }

  f({ a }: I<T>, done): void {
    if (this._input.b.peak() === true) {
      done({ a })
    }
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'b') {
    if (data === true) {
      const a = this._input.a.peak()

      if (a !== undefined) {
        this._done({ a })
      }
    }
    // }
  }
}
