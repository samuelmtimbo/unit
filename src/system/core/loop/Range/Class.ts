import { Primitive } from '../../../../Primitive'
import { System } from '../../../../system'
import { ID_RANGE } from '../../../_ids'

export type I = {
  a: number
  b: number
}

export type O = {
  i: number
}

export default class Range extends Primitive<I, O> {
  private _current: number

  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['i'],
      },
      {},
      system,
      ID_RANGE
    )
  }

  onDataInputData() {
    if (this._input.a.active() && this._input.b.active()) {
      if (this._i.a < this._i.b) {
        this._current = this._i.a
        this._forward('i', this._current)
      } else {
        this._backward_all()
      }
    }
  }

  onDataInputDrop() {
    if (this._current !== undefined) {
      this._forward_all_empty()
    }
  }

  onDataOutputDrop() {
    this._current++
    if (this._current < this._i.b) {
      this._forward('i', this._current)
    } else {
      this._backward_all()
    }
  }
}
