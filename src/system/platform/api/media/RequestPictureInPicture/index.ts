import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'
import { PS } from '../../../../../types/interface/PS'
import { ID_REQUEST_PICTURE_IN_PICTURE } from '../../../../_ids'

export interface I {
  media: PS
  opt: {}
  done: any
}

export interface O {}

export default class RequestPictureInPicture extends Semifunctional<I, O> {
  private _picture_in_picture: PictureInPictureWindow

  private _exit_picture_in_picture_promise: Promise<any> = Promise.resolve()

  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['media', 'opt'],
        i: ['done'],
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

  async f({ media, opt }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        document: { pictureInPictureElement },
      },
    } = this.__system

    await this._exit_picture_in_picture_promise

    const element = await media.requestPictureInPicture()

    if (pictureInPictureElement === element) {
      done(undefined, 'media is already displayed picture in picture')

      return
    }

    const window = await element.requestPictureInPicture()

    this._picture_in_picture = window

    const leavePnPListener = () => {
      this._picture_in_picture = undefined

      this.d()

      this._backward('opt')
    }

    element.addEventListener('leavepictureinpicture', leavePnPListener)

    this._unlisten = () => {
      element.removeEventListener('leavepictureinpicture', leavePnPListener)
    }
  }

  d() {
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

  onIterDataInputData(name: string): void {
    // if (name === 'done') {
    this.d()

    this._backward('opt')

    this._backward('done')
    // }
  }
}
