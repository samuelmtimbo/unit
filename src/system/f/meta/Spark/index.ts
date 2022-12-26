import { Primitive } from '../../../../Primitive'
import { System } from '../../../../system'
import { ID_SPARK } from '../../../_ids'

export interface I<T> {}

export interface O<T> {
  a: T
}

export interface R<T> {
  a: T
}

export default class Spark<T> extends Primitive<I<T>, O<T>> {
  private _ran: boolean = false

  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['a'],
      },
      {},
      system,
      ID_SPARK
    )
  }

  onDataInputData(name: string, data: T) {
    if (this._paused || this._ran) {
      return
    }

    this._ran = true

    this._output.a.push(data)
  }
}
