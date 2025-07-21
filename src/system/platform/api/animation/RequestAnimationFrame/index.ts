import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { apiNotSupportedError } from '../../../../../exception/APINotImplementedError'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_REQUEST_ANIMATION_FRAME } from '../../../../_ids'

export interface I {
  a: any
}

export interface O {
  a: any
}

export default class RequestAnimationFrame extends Functional<I, O> {
  private _frame: number | undefined = undefined

  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['a'],
      },
      {},
      system,
      ID_REQUEST_ANIMATION_FRAME
    )
  }

  public f({ a }: I, done: Done<O>, fail: Fail): void {
    const {
      api: {
        animation: { requestAnimationFrame },
      },
    } = this.__system

    if (!requestAnimationFrame) {
      fail(apiNotSupportedError('Request Animation Frame'))

      return
    }

    this._frame = requestAnimationFrame(() => {
      this._frame = undefined

      done({ a })
    })
  }

  d() {
    const {
      api: {
        animation: { cancelAnimationFrame },
      },
    } = this.__system

    if (this._frame) {
      cancelAnimationFrame(this._frame)

      this._frame = undefined
    }
  }

  public snapshotSelf(): Dict<any> {
    return {
      ...super.snapshotSelf(),
      ...(this._frame !== undefined ? { _frame: this._frame } : {}),
    }
  }

  public restoreSelf(state: Dict<any>): void {
    const { _frame, ...rest } = state

    super.restoreSelf(rest)

    if (_frame !== undefined) {
      this._frame = requestAnimationFrame(() => {
        this._frame = undefined

        this._done({ a: this._i.a })
      })
    }
  }
}
