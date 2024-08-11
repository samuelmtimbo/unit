import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { apiNotSupportedError } from '../../../../../exception/APINotImplementedError'
import { System } from '../../../../../system'
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

  public f({ a }: I, done: Done<O>): void {
    const {
      api: {
        animation: { requestAnimationFrame },
      },
    } = this.__system

    if (requestAnimationFrame) {
      this.d()

      this._frame = requestAnimationFrame(() => {
        this._frame = undefined

        done({ a })
      })
    } else {
      done(undefined, apiNotSupportedError('Request Animation Frame'))
    }
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
}
