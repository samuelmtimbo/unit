import { Element } from '../../../../../Class/Element'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export type I = {
  element: Element
  pointerId: number
  done: any
}

export type O = {}

export default class SetPointerCapture extends Semifunctional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['element', 'pointerId'],
        fo: [],
        i: ['done'],
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
      pod
    )
  }

  private _capturing = false
  private _pointerId: number

  f({ element, pointerId }: I): void {
    if (!this._capturing) {
      this._release()

      this._capturing = true
      this._pointerId = pointerId

      element.refEmitter().emit('call', {
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

      element.refEmitter().emit('call', {
        method: 'releasePointerCapture',
        data: [pointerId],
      })
    }
  }
}
