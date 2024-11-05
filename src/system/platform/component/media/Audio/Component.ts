import HTMLElement_ from '../../../../../client/html'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { CS } from '../../../../../types/interface/CS'
import { $MS } from '../../../../../types/interface/async/$MS'

export interface Props {
  style?: Dict<string>
  src?: string
  controls?: boolean
  stream?: MediaStream
}

export default class Audio_
  extends HTMLElement_<HTMLAudioElement, Props>
  implements CS
{
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('audio'),
      $system.style['audio'],
      {
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
      }
    )

    const { src, controls = true } = this.$props

    this.$element.controls = controls

    if (src) {
      this.$element.src = src
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

  captureStream(opt: { frameRate: number }): Promise<MediaStream> {
    // @ts-ignore
    if (this.$element.captureStream) {
      // @ts-ignore
      return this.$element.captureStream()
    }

    return null
  }
}
