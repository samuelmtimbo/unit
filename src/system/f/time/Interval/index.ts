import { Done } from '../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../Class/Semifunctional'
import { System } from '../../../../system'
import { ID_INTERVAL } from '../../../_ids'

export interface I {
  ms: number
  done: any
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
      ID_INTERVAL
    )
  }

  f({ ms }: I, done: Done<O>): void {
    const {
      api: {
        window: { setInterval },
      },
    } = this.__system

    // @ts-ignore
    this._interval = setInterval(() => {
      this.pushOutput('ms', ms)
    }, ms)
  }

  d() {
    const {
      api: {
        window: { clearInterval },
      },
    } = this.__system

    if (this._interval !== null) {
      clearInterval(this._interval)

      this._interval = undefined
    }

    this._forward_all_empty()
  }

  onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this.d()

    this._forward_empty('ms')

    this._backward('ms')

    this._backward('done')
    // }
  }
}
