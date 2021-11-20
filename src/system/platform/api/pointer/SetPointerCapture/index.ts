import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Unit } from '../../../../../Class/Unit'
import { Config } from '../../../../../Class/Unit/Config'

export type I = {
  element: Unit
  pointerId: number
  done: any
}

export type O = {}

export default class SetPointerCapture extends Semifunctional<I, O> {
  constructor(config?: Config) {
    super(
      {
        fi: ['element', 'pointerId'],
        fo: [],
        i: ['done'],
        o: [],
      },
      config,
      {
        input: {
          element: {
            ref: true,
          },
        },
      }
    )
  }

  private _capturing = false
  private _pointerId: number

  f({ element, pointerId }): void {
    if (!this._capturing) {
      this._release()

      this._capturing = true
      this._pointerId = pointerId

      element.emit('call', {
        method: 'setPointerCapture',
        data: [pointerId],
      })
    }
  }

  onIterDataInputData(name: string, value: any) {
    // console.log('SetPointerCapture', 'onIterDataInputData', name, value)
    this._release()
  }

  private _release = () => {
    if (this._capturing) {
      const pointerId = this._pointerId

      const element = this._input.element.peak()

      this._done()

      this._input.done.pull()

      this._capturing = false
      this._pointerId = undefined

      element.emit('call', {
        method: 'releasePointerCapture',
        data: [pointerId],
      })
    }
  }
}
