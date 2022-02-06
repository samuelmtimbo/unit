import applyStyle from '../../../../../client/applyStyle'
import { Element } from '../../../../../client/element'
import { htmlPropHandler, PropHandler } from '../../../../../client/propHandler'
import { APINotSupportedError } from '../../../../../exception/APINotImplementedError'
import { $ST } from '../../../../../interface/async/$ST'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  src?: string
  stream?: $ST
  autoplay?: boolean
  controls?: boolean
}

export const DEFAULT_STYLE = {
  height: '100%',
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  // outline: 'none',
}

export default class Video extends Element<HTMLVideoElement, Props> {
  private _video_el: HTMLVideoElement

  private prop_handler: PropHandler

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const {
      className,
      style = {},
      src,
      autoplay = true,
      controls = true,
    } = this.$props

    const video_el = this.$system.api.document.createElement('video')

    video_el.controls = controls

    if (className) {
      video_el.className = className
    }

    if (src) {
      video_el.src = src
    }

    video_el.autoplay = autoplay

    applyStyle(video_el, { ...DEFAULT_STYLE, ...style })

    this._video_el = video_el

    this.prop_handler = {
      ...htmlPropHandler(this._video_el, DEFAULT_STYLE),

      src: (src: string | undefined) => {
        if (src === undefined) {
          this._video_el.pause()
          this._video_el.removeAttribute('src') // empty source
          this._video_el.load()
        } else {
          this._video_el.src = src
        }
      },
      stream: (stream: $ST | undefined): void => {
        if (stream === undefined) {
          this._video_el.srcObject = null
        } else {
          stream.$stream({}, (_stream: MediaStream) => {
            this._video_el.srcObject = _stream
          })
        }
      },
      controls: (controls: boolean | undefined): void => {
        if (controls === undefined) {
          this._video_el.removeAttribute('controls')
        } else {
          this._video_el.controls = controls
        }
      },
    }

    this.$element = video_el
  }

  onPropChanged(prop: string, current: any): void {
    this.prop_handler[prop](current)
  }

  async captureStream({
    frameRate,
  }: {
    frameRate: number
  }): Promise<MediaStream> {
    // @ts-ignore
    if (this._video_el.captureStream) {
      // @ts-ignore
      return this._video_el.captureStream(frameRate)
    } else {
      throw new APINotSupportedError('Capture Stream')
    }
  }

  async requestPictureInPicture(): Promise<any> {
    if (this._video_el.requestPictureInPicture) {
      try {
        return await this._video_el.requestPictureInPicture()
      } catch (err) {
        switch (err.name) {
          case 'InvalidStateError':
            throw new Error('video is not loaded')
          case 'NotAllowedError':
            throw new Error(
              `must be handling a user gesture if there isn't already an element in Picture-in-Picture`
            )
          default:
            throw new Error(err.message)
        }
      }
    } else {
      throw new APINotSupportedError('Picture-in-Picture')
    }
  }
}
