import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_TIMER } from '../../../_ids'

export interface I {
  ms: number
}

export interface O {
  ms: number
}

export default class Timer extends Functional<I, O> {
  private _timer: number | null = null

  constructor(system: System) {
    super(
      {
        i: ['ms'],
        o: ['ms'],
      },
      {},
      system,
      ID_TIMER
    )
  }

  public f({ ms }: I, done: Done<O>): void {
    const {
      api: {
        window: { setTimeout },
      },
    } = this.__system

    // @ts-ignore
    this._timer = setTimeout(() => {
      this._timer = null

      done({ ms })
    }, ms)
  }

  d() {
    const {
      api: {
        window: { clearTimeout },
      },
    } = this.__system

    if (this._timer !== null) {
      clearTimeout(this._timer)

      this._timer = undefined
    }
  }
}
