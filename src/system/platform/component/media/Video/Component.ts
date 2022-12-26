import { Element } from '../../../../../client/element'
import { htmlPropHandler, PropHandler } from '../../../../../client/propHandler'
import applyStyle from '../../../../../client/style'
import { APINotSupportedError } from '../../../../../exception/APINotImplementedError'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { $ST } from '../../../../../types/interface/async/$ST'

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

export default class VideoComp extends Element<HTMLVideoElement, Props> {
  private prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      className,
      style = {},
      src,
      autoplay = true,
      controls = true,
    } = this.$props

    this.$element = this.$system.api.document.createElement('video')

    this.$element.controls = controls

    if (className) {
      this.$element.className = className
    }

    if (src) {
      this.$element.src = src
    }

    this.$element.autoplay = autoplay

    applyStyle(this.$element, { ...DEFAULT_STYLE, ...style })

    this.prop_handler = {
      ...htmlPropHandler(this, DEFAULT_STYLE),

      src: (src: string | undefined) => {
        if (src === undefined) {
          this.$element.pause()
          this.$element.removeAttribute('src') // empty source
          this.$element.load()
        } else {
          this.$element.src = src
        }
      },
      stream: (stream: $ST | undefined): void => {
        if (stream === undefined) {
          this.$element.srcObject = null
        } else {
          stream.$stream({}, (_stream: MediaStream) => {
            this.$element.srcObject = _stream
          })
        }
      },
      controls: (controls: boolean | undefined): void => {
        if (controls === undefined) {
          this.$element.removeAttribute('controls')
        } else {
          this.$element.controls = controls
        }
      },
    }
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
    if (this.$element.captureStream) {
      // @ts-ignore
      return this.$element.captureStream(frameRate)
    } else {
      throw new APINotSupportedError('Capture Stream')
    }
  }

  async requestPictureInPicture(): Promise<any> {
    if (this.$element.requestPictureInPicture) {
      try {
        return await this.$element.requestPictureInPicture()
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
