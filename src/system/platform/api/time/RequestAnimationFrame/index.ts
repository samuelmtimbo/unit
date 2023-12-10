import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_REQUEST_ANIMATION_FRAME } from '../../../../_ids'

export interface I {
  a: any
}

export interface O {
  a: any
}

export default class RequestAnimationFrame extends Functional<I, O> {
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

    this.addListener('reset', () => {
      this._reset()
    })

    this.addListener('destroy', () => {
      this._reset()
    })
  }

  private _reset(): void {
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

  private _frame: number | undefined = undefined

  public f({ a }: I, done: Done<O>): void {
    const {
      api: {
        animation: { requestAnimationFrame },
      },
    } = this.__system

    if (requestAnimationFrame) {
      this._reset()

      this._frame = requestAnimationFrame(() => {
        this._frame = undefined

        done({ a })
      })
    } else {
      done(undefined, 'request animation frame not supported')
    }
  }
}
