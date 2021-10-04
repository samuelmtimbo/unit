import { $C } from '../../../../../async/$C'
import { $PS } from '../../../../../async/$PS'
import { Config } from '../../../../../Class/Unit/Config'
import '../../../../../client/document'
import { Primitive } from '../../../../../Primitive'
import { Unlisten } from '../../../../../Unlisten'
import Video from '../Video/Component'

export interface I {
  media: $C & $PS
  opt: {}
}

export interface O {}

export default class RequestPictureInPicture extends Primitive<I, O> {
  private _taking_err: boolean = false

  private _picture_in_picture: any

  private _exit_picture_in_picture: Promise<any> = Promise.resolve()

  constructor(config?: Config) {
    super(
      {
        i: ['media', 'opt', 'stop'],
        o: [],
      },
      config,
      {
        input: {
          media: {
            ref: true,
          },
        },
      }
    )

    this.addListener('take_err', () => {
      if (!this._taking_err) {
        this._input.opt.pull()
      }
    })
  }

  onRefInputData(name: string, data: any): void {
    // if (name === 'source') {
    this._setup()
    // }
  }

  onDataInputData(name: string): void {
    if (name === 'opt') {
      this._setup()
    } else if (name === 'stop') {
      this._plunk()
      this._input.opt.pull()
      this._input.stop.pull()
    }
  }

  onRefInputDrop(name: string): void {
    // if (name === 'name') {
    this._plunk()
    // }
  }

  onDataInputDrop(name: string): void {
    if (name === 'opt') {
      this._plunk()
    }
  }

  onDataInputInvalid(name: string): void {
    // if (name === 'opt') {
    this._plunk()
    // }
  }

  private _unlisten: Unlisten

  private async _setup() {
    const { media, opt } = this._i

    if (media !== undefined && opt !== undefined) {
      if (this.hasErr()) {
        this._taking_err = true
        this.takeErr()
        this._taking_err = false
      }

      await this._exit_picture_in_picture

      media.$component({}, async (component: Video | null): Promise<void> => {
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
      })
    }
  }

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
}
