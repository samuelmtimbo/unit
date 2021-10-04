import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'

export type I = {
  a: number
  b: number
}

export type O = {
  i: number
}

// this is how `range` would be implemented
// if we had to write it as a primitive (not a composition)

export default class Range extends Primitive<I, O> {
  private _current: number

  constructor(config?: Config) {
    super(
      {
        i: ['a', 'b'],
        o: ['i'],
      },
      config
    )
  }

  onDataInputData() {
    if (this._active_i_count === 2 && this._active_o_count === 0) {
      if (this._i.a < this._i.b) {
        this._current = this._i.a
        this._forward()
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
      this._forward()
    } else {
      this._backward_all()
    }
  }

  private _forward() {
    this._output.i.push(this._current)
  }
}
