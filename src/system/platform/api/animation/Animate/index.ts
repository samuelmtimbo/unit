import { $ } from '../../../../../Class/$'
import { Element_ } from '../../../../../Class/Element'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { sleep } from '../../../../../sleep'
import { System } from '../../../../../system'
import { ANI } from '../../../../../types/interface/ANI'
import { Unlisten } from '../../../../../types/Unlisten'
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

export default class Animate extends Holder<I, O> {
  private _id: string
  private _element: Element_

  constructor(system: System) {
    super(
      {
        fi: ['opt', 'keyframes', 'element'],
        fo: ['animation'],
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

  public async f({ opt, keyframes, element }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        window: { setTimeout },
      },
    } = this.__system

    const id = opt.id ?? randomId()

    this._id = id
    this._element = element

    const _opt = {
      ...opt,
      id,
    }

    element.animate(keyframes, _opt)

    await sleep(setTimeout, 0)

    let _animation: Animation

    setTimeout(() => {
      _animation = this.__system.cache.animations[id]
    }, 0)

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

      addListener(event, listener): Unlisten {
        if (['finish', 'cancel', 'remove'].includes(event)) {
          if (_animation) {
            _animation.addEventListener('finish', listener)

            return () => {
              _animation.removeEventListener('finish', listener)
            }
          }

          return super.addListener(event, listener)
        }
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
}
