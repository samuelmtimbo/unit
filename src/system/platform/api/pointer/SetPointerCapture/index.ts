import { Unit } from '../../../../../Class/Unit'
import { Config } from '../../../../../Class/Unit/Config'
import { Primitive } from '../../../../../Primitive'

export type I = {
  element: Unit
  pointerId: number
  release: any
}

export type O = {}

export default class SetPointerCapture extends Primitive<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['element', 'pointerId', 'release'],
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

  onDataInputData(name: string, value: any) {
    // console.log('SetPointerCapture', 'onDataInputData', name, value)
    if (name === 'element' || name === 'pointerId') {
      if (!this._capturing) {
        const element = this._input.element.peak()
        const pointerId = this._input.pointerId.peak()
        if (element !== undefined && pointerId !== undefined) {
          this._release()
          this._capturing = true
          this._pointerId = pointerId
          element.emit('call', {
            method: 'setPointerCapture',
            data: [pointerId],
          })
        }
      }
    } else {
      this._release()
    }
  }

  private _release = () => {
    if (this._capturing) {
      const pointerId = this._pointerId
      const element = this._input.element.peak()
      this._backwarding = true
      this._input.pointerId.pull()
      this._input.release.pull()
      this._backwarding = false
      this._capturing = false
      this._pointerId = undefined
      element.emit('call', {
        method: 'releasePointerCapture',
        data: [pointerId],
      })
    }
  }

  onDataInputDrop(name: string) {
    // console.log('SetPointerCapture', 'onInputDrop', name)
    if (name === 'element' || name === 'pointerId') {
      if (!this._backwarding) {
        this._release()
      }
    } else {
    }
  }
}
