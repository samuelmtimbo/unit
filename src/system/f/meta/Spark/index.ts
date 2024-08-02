import { Primitive } from '../../../../Primitive'
import { System } from '../../../../system'
import { ID_SPARK } from '../../../_ids'

export interface I<T> {
  a: T
}

export interface O<T> {
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

    this.addListener('reset', () => {
      this._ran = false

      const a = this._input.a.peak()

      if (a !== undefined) {
        this._loop(a)
      }
    })
  }

  public onDataInputDrop(name: string, data: any): void {
    this._ran = false

    if (this._output.a.active()) {
      this._forward_empty('a')
    }
  }

  onDataInputData(name: string, data: T) {
    this._loop(data)
  }

  private _loop = (data: T) => {
    if (this._paused || this._ran) {
      return
    }

    this._ran = true

    this._output.a.push(data)
  }
}
