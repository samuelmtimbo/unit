import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'
import { $_ } from '../../../../../types/interface/$_'
import { $C } from '../../../../../types/interface/async/$C'
import { $PS } from '../../../../../types/interface/async/$PS'
import { ID_REQUEST_PICTURE_IN_PICTURE } from '../../../../_ids'
import { listenGlobalComponent } from '../../../../globalComponent'
import VideoComp from '../../../component/media/Video/Component'

export interface I {
  media: $C & $PS & $_
  opt: {}
}

export interface O {}

export default class RequestPictureInPicture extends Semifunctional<I, O> {
  private _picture_in_picture: any

  private _exit_picture_in_picture_promise: Promise<any> = Promise.resolve()

  constructor(system: System) {
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
      ID_REQUEST_PICTURE_IN_PICTURE
    )
  }

  private _unlisten: Unlisten

  private _plunk() {
    const {
      api: {
        document: { exitPictureInPicture },
      },
    } = this.__system
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }

    if (this._picture_in_picture) {
      this._exit_picture_in_picture_promise = exitPictureInPicture()

      this._picture_in_picture = undefined
    }
  }

  async f({ media, opt }: I, done: Done<O>): Promise<void> {
    await this._exit_picture_in_picture_promise

    const globalId = media.getGlobalId()

    listenGlobalComponent(
      this.__system,
      globalId,
      async (component: VideoComp | null): Promise<void> => {
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
