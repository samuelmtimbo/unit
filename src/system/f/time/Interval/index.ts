import { Done } from '../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../Class/Semifunctional'
import { System } from '../../../../system'
import { ID_TIMER } from '../../../_ids'

export interface I {
  ms: number
}

export interface O {
  ms: number
}

export default class Interval extends Semifunctional<I, O> {
  private _interval: number | null = null

  constructor(system: System) {
    super(
      {
        fi: ['ms'],
        o: ['ms'],
        i: ['done'],
      },
      {},
      system,
      ID_TIMER
    )

    this.addListener('reset', this._reset)
    this.addListener('destroy', this._reset)
  }

  private _reset() {
    const {
      api: {
        window: { clearInterval },
      },
    } = this.__system

    if (this._interval !== null) {
      clearInterval(this._interval)

      this._interval = null
    }
  }

  public f({ ms }: I, done: Done<O>): void {
    const {
      api: {
        window: { setInterval },
      },
    } = this.__system

    this._reset()

    // @ts-ignore
    this._interval = setInterval(() => {
      this.pushOutput('ms', ms)
    }, ms)
  }

  public d() {
    this._reset()

    this._forward_all_empty()
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._reset()
    this._done({})
    // }
  }
}
