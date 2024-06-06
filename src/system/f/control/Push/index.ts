import { Primitive } from '../../../../Primitive'
import { System } from '../../../../system'
import { ID_PUSH } from '../../../_ids'

export interface I<T> {
  a: T
  b: any
}

export interface O<T> {
  a: T
}

export default class Push<T> extends Primitive<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a'],
      },
      {},
      system,
      ID_PUSH
    )
  }

  public onDataInputData(name: string, data: any): void {
    if (!this._forwarding) {
      if (name === 'a') {
        if (this._i.b !== undefined) {
          this._forward('a', this._i.a)
        }
      } else {
        if (this._i.a !== undefined) {
          this._forward('a', this._i.a)
        }
      }

      this._backward('b')
    }
  }

  public onDataOutputDrop(name: string): void {
    // if (name === 'a') {
    this._backward('a')
    // }
  }
}
