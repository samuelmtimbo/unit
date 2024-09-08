import { mergeAttr } from '../../../../../client/attr'
import { Element } from '../../../../../client/element'
import { PropHandler, htmlPropHandler } from '../../../../../client/propHandler'
import { applyStyle } from '../../../../../client/style'
import { APINotSupportedError } from '../../../../../exception/APINotImplementedError'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { CS } from '../../../../../types/interface/CS'
import { $MS } from '../../../../../types/interface/async/$MS'

export interface Props {
  className?: string
  style?: Dict<string>
  src?: string
  stream?: $MS
  autoplay?: boolean
  controls?: boolean
  attr?: Dict<string>
}

export const DEFAULT_STYLE = {
  height: '100%',
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  // outline: 'none',
}

export default class VideoComp
  extends Element<HTMLVideoElement, Props>
  implements CS
{
  private prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      className,
      style = {},
      src,
      autoplay = true,
      controls = true,
      attr,
    } = this.$props

    this.$element = this.$system.api.document.createElement('video')

    this.$element.controls = controls

    if (className) {
      this.$element.className = className
    }
    if (src) {
      this.$element.src = src
    }
    if (attr) {
      mergeAttr(this.$element, attr)
    }

    this.$element.autoplay = autoplay

    applyStyle(this.$element, { ...DEFAULT_STYLE, ...style })

    this.prop_handler = {
      ...htmlPropHandler(this, this.$element, DEFAULT_STYLE),

      src: (src: string | undefined) => {
        if (src === undefined) {
          this.$element.pause()
          this.$element.removeAttribute('src') // empty source
          this.$element.load()
        } else {
          this.$element.src = src
        }
      },
      stream: (stream: $MS | undefined): void => {
        if (stream === undefined) {
          this.$element.srcObject = null
        } else {
          stream.$mediaStream({}, (_stream: MediaStream) => {
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
      currentTime: (t: number | undefined): void => {
        if (t === undefined) {
          //
        } else {
          this.$element.currentTime = t
        }
      },
    }
  }

  onPropChanged(prop: string, current: any): void {
    // console.log('onPropChanged', prop, current)

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

  async requestPictureInPicture(): Promise<HTMLVideoElement> {
    if (this.$element.requestPictureInPicture) {
      try {
        return this.$element
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

  play(): void {
    this.$element.play()
  }

  pause(): void {
    this.$element.pause()
  }

  reset(): void {
    super.reset()

    this.$element.pause()
    this.$element.currentTime = 0
  }
}
