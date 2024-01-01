import { $ } from '../../../../../Class/$'
import { Element_ } from '../../../../../Class/Element'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { ANI } from '../../../../../types/interface/ANI'
import { randomId } from '../../../../../util/id'
import { ID_ANIMATE } from '../../../../_ids'

export interface I {
  opt: KeyframeAnimationOptions
  keyframes: Keyframe[]
  element: Element_
  done: any
}

export interface O {
  animation: ANI & $
}

export default class Animate extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['opt', 'keyframes', 'element'],
        fo: ['animation'],
        i: ['done'],
        o: [],
      },
      {
        input: {
          element: {
            ref: true,
          },
          done: {},
        },
        output: {
          animation: {
            ref: true,
          },
        },
      },
      system,
      ID_ANIMATE
    )

    this.addListener('reset', this._cancel)
    this.addListener('destroy', this._cancel)
  }

  private _cancel(): void {
    if (this._i.element) {
      if (this._id) {
        this._i.element.emit('call', {
          method: 'cancelAnimation',
          data: [this._id],
        })

        this._id = undefined
      }
    }
  }

  private _id: string | undefined = undefined

  public f({ opt, keyframes, element }: I, done: Done<O>): void {
    const id = opt.id ?? randomId()

    this._id = id

    const _opt = {
      ...opt,
      id,
    }

    element.emit('call', {
      method: 'animate',
      data: [keyframes, _opt],
    })

    const animation = new (class Node extends $ implements ANI {
      __: string[] = ['ANI']

      stop(): void {
        element.emit('call', {
          method: 'stopAnimation',
          data: [id],
        })
      }
      play(): void {
        element.emit('call', {
          method: 'playAnimation',
          data: [id],
        })
      }
      cancel(): void {
        element.emit('call', {
          method: 'cancelAnimation',
          data: [id],
        })
      }
      finish(): void {
        element.emit('call', {
          method: 'finishAnimation',
          data: [id],
        })
      }
      commit(): void {
        element.emit('call', {
          method: 'commitAnimation',
          data: [id],
        })
      }
    })(this.__system)

    done({ animation })
  }

  d() {
    this._cancel()
  }

  public onRefInputDrop(name: string, data: any): void {
    if (name === 'element') {
      this._cancel()
    }
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._cancel()

    this._id = undefined

    this._forward_empty('animation')

    this._backward('keyframes')
    this._backward('opt')
    this._backward('done')
    // }
  }
}
