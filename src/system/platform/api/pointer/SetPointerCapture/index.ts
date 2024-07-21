import { Element_ } from '../../../../../Class/Element'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { ID_SET_POINTER_CAPTURE } from '../../../../_ids'

export type I = {
  element: Element_
  pointerId: number
  done: any
}

export type O = {}

export default class SetPointerCapture extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['element', 'pointerId'],
        fo: [],
        i: [],
        o: [],
      },
      {
        input: {
          element: {
            ref: true,
          },
        },
      },
      system,
      ID_SET_POINTER_CAPTURE
    )
  }

  private _capturing = false
  private _pointerId: number
  private _element: Element_ = null

  f({ element, pointerId }: I): void {
    if (!this._capturing) {
      this._capturing = true
      this._pointerId = pointerId
      this._element = element

      element.emit('call', {
        method: 'setPointerCapture',
        data: [pointerId],
      })
    }
  }

  d() {
    if (this._capturing) {
      const pointerId = this._pointerId

      this._done()

      this._element.emit('call', {
        method: 'releasePointerCapture',
        data: [pointerId],
      })

      this._capturing = false
      this._pointerId = undefined
      this._element = null
    }
  }
}
