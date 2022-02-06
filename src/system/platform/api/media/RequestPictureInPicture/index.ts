import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { _ } from '../../../../../interface/$_'
import { $C } from '../../../../../interface/async/$C'
import { $PS } from '../../../../../interface/async/$PS'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'
import { listenGlobalComponent } from '../../../../globalComponent'
import Video from '../../../component/media/Video/Component'

export interface I {
  media: $C & $PS & _
  opt: {}
}

export interface O {}

export default class RequestPictureInPicture extends Semifunctional<I, O> {
  private _picture_in_picture: any

  private _exit_picture_in_picture: Promise<any> = Promise.resolve()

  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['media', 'opt'],
        i: ['stop'],
      },
      {
        input: {
          media: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  private _unlisten: Unlisten

  private _plunk() {
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }

    if (this._picture_in_picture) {
      this._exit_picture_in_picture = document.exitPictureInPicture()

      this._picture_in_picture = undefined
    }
  }

  async f({ media, opt }: I, done: Done<O>): Promise<void> {
    await this._exit_picture_in_picture

    const global_id = media.getGlobalId()

    listenGlobalComponent(
      this.__system,
      global_id,
      async (component: Video | null): Promise<void> => {
        if (component === null) {
          this._plunk()
        } else {
          if (document.pictureInPictureElement === component.$element) {
            this.err('media is already Picture in Picture')
          } else {
            const pictureInPicture = await component.requestPictureInPicture()

            const leavePnPListener = (event) => {
              // console.log('RequestPictureInPicture', 'leavepictureinpicture')
              this._picture_in_picture = undefined

              this._plunk()
            }

            component.$element.addEventListener(
              'leavepictureinpicture',
              leavePnPListener
            )

            this._unlisten = () => {
              component.$element.removeEventListener(
                'leavepictureinpicture',
                leavePnPListener
              )
            }

            this._picture_in_picture = pictureInPicture
          }
        }
      }
    )
  }

  onIterDataInputData(name: string): void {
    // if (name === 'stop') {
    this._plunk()

    this._backward('media')
    this._backward('opt')
    // }
  }
}
