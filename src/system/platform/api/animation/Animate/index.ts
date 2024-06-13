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
  private _id: string
  private _element: Element_

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
  }

  public f({ opt, keyframes, element }: I, done: Done<O>): void {
    const id = opt.id ?? randomId()

    this._id = id
    this._element = element

    const _opt = {
      ...opt,
      id,
    }

    element.animate(keyframes, _opt)

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
    if (this._id) {
      this._element.cancelAnimation(this._id)

      this._id = undefined
      this._element = undefined
    }
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this.d()

    this._forward_empty('animation')

    this._backward('keyframes')
    this._backward('opt')
    this._backward('done')
    // }
  }
}
