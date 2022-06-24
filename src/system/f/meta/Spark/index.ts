import { Pod } from '../../../../pod'
import { Primitive } from '../../../../Primitive'
import { System } from '../../../../system'

export interface I<T> {}

export interface O<T> {
  a: T
}

export interface R<T> {
  a: T
}

export default class Spark<T> extends Primitive<I<T>, O<T>> {
  private _ran: boolean = false

  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a'],
        o: ['a'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  onDataInputData(name: string, data: T) {
    if (this._ran) {
      return
    }

    this._ran = true

    this._output.a.push(data)
  }
}
