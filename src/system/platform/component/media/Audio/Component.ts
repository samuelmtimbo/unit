import { Element } from '../../../../../client/element'
import { applyStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { CS } from '../../../../../types/interface/CS'
import { $MS } from '../../../../../types/interface/async/$MS'

export interface Props {
  className?: string
  style?: Dict<string>
  src?: string
  controls?: boolean
  stream?: MediaStream
}

export const DEFAULT_STYLE = {
  display: 'block',
  height: '45px',
  width: '100%',
  boxSizing: 'border-box',
  // outline: 'none',
}

export default class AudioComp
  extends Element<HTMLAudioElement, Props>
  implements CS
{
  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, style = {}, src, controls = true } = this.$props
    const audio_element = this.$system.api.document.createElement('audio')
    audio_element.controls = controls
    if (className) {
      audio_element.className = className
    }
    if (src) {
      audio_element.src = src
    }
    applyStyle(audio_element, { ...DEFAULT_STYLE, ...style })

    this.$element = audio_element
  }

  private propHandler = {
    className: (className: string | undefined = ''): void => {
      this.$element.className = className
    },
    style: (style: Dict<any>): void => {
      applyStyle(this.$element, { ...DEFAULT_STYLE, ...style })
    },
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
        stream.$get({}, (_stream: MediaStream) => {
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

  onPropChanged(prop: string, current: any): void {
    this.propHandler[prop](current)
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
