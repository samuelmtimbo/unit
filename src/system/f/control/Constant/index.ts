import { Primitive } from '../../../../Primitive'
import { isPrimitive } from '../../../../spec/primitive'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_CONSTANT } from '../../../_ids'

export interface I<T> {
  a: T
}

export interface O<T> {
  a: T
}

export default class Constant<T> extends Primitive<I<T>, O<T>> {
  private _current: T | undefined = undefined

  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['a'],
      },
      {},
      system,
      ID_CONSTANT
    )

    this.addListener('reset', () => {
      this._current = undefined
    })
  }

  onDataInputData(name: string, data: T) {
    this._current = data

    this._output.a.push(data)
  }

  onDataInputDrop(name: string) {
    if (!this._backwarding) {
      this._forward_all_empty()
      this._current = undefined
    }
  }

  onDataOutputDrop(name: string) {
    if (!this._forwarding_empty) {
      if (this._current !== undefined) {
        this._output.a.push(this._current)
      }
    }
  }

  onDataInputInvalid(name: string) {
    this._invalidate()
  }

  public snapshotSelf(): Dict<any> {
    return {
      ...super.snapshotSelf(),
      ...(this._current !== undefined
        ? { _current: isPrimitive(this._current) ? this._current : undefined }
        : {}),
    }
  }

  public restoreSelf(state: Dict<any>): void {
    const { _current, ...rest } = state

    super.restoreSelf(rest)

    this._current = _current
  }
}
