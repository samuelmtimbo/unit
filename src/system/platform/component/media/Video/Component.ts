import HTMLElement_ from '../../../../../client/html'
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
  controls?: boolean
  attr?: Dict<string>
}

export default class Video_
  extends HTMLElement_<HTMLVideoElement, Props>
  implements CS
{
  public $input: Dict<string[]> = {
    stream: ['MS'],
  }

  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('video'),
      $system.style['video'],
      {
        autoplay: true,
        controls: true,
      },
      {
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
    )

    const { src, controls = true } = this.$props

    this.$element.controls = controls

    if (src) {
      this.$element.src = src
    }
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
    void this.$element.play()
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
