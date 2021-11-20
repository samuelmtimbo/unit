import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'

export interface I {
  a: any
}

export interface O {
  a: any
}

export default class RequestAnimationFrame extends Functional<I, O> {
  constructor() {
    super({
      i: ['a'],
      o: ['a'],
    })

    this.addListener('reset', () => {
      this._reset()
    })

    this.addListener('destroy', () => {
      this._reset()
    })
  }

  private _reset(): void {
    if (this._frame) {
      cancelAnimationFrame(this._frame)
      this._frame = undefined
    }
  }

  private _frame: number | undefined = undefined

  public f({ a }: I, done: Done<O>): void {
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
