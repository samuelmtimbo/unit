import { Primitive } from '../../../../Primitive'
import { System } from '../../../../system'
import { ID_KEEP } from '../../../_ids'

export interface I<T> {
  a: any
  b: boolean
}

export interface O<T> {}

export default class Keep<T> extends Primitive<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: [],
      },
      {},
      system,
      ID_KEEP
    )
  }

  public onDataInputData(name: string, data: any): void {
    if (name === 'a') {
      //
    } else {
      this._input.a.pull()
      this._input.b.pull()
    }
  }
}
